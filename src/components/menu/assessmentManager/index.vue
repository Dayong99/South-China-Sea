<template>
  <div id="ship_manager" class="ship_manager" v-show="assessManagerShow">
    <div class="manager_title">
      <span>评估结果</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="queryParams.warshipName"
        class="operation_input"
        clearable
      >
      </el-input>
      <el-button class="operation_search" @click="search">搜索</el-button>
      <el-button class="operation_clear" @click="resetSearch">重置</el-button>
    </div>
    <div class="manager_table">
      <el-table :data="tableData" border style="width: 100%" max-height="400px">
        <el-table-column
          label="评估类型"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <!--<span>{{ scope.row.warshipType }}</span> -->
            <span>暂无</span>
          </template>
        </el-table-column>
        <el-table-column
          label="评估时间"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.assesstime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="配置参数"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <img
              src="@/assets/images/menu/assessView.png"
              @click="detailAssessMentInfo(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="评估结果"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <img
              style="width:20px;cursor:pointer"
              src="@/assets/images/menu/assessView.png"
              @click="detailAssessMentInfo(scope.row,0)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="manager_page">
      <!-- 分页 -->
      <pagination
        :total="total"
        :page.sync="pagination.num"
        :limit.sync="pagination.size"
        @pagination="search"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import eventBus from '@/utils/eventBus.js'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      total: 0,
      // 新增 修改 对话框
      dialog: {
        isVisible: false,
        title: "",
      },
      // 详细面板显示隐藏
      assessManagerShow: false,
      managerValue: "",
      tableData: [],
      // 分页
      pagination: {
        size: 5,
        num: 1,
      },
      queryParams: {
        warshipName: null,
      },
      //风险评估画的区域集合，用于删除
      rectangle: [],
      //风险区域数据
      riskArr: [],
      //风险区域颜色
      colorArr: [
        "#0000CD",
        "#00FFFF",
        "#00FECE",
        "#00FF02",
        "#FEFF01",
        "#FD9901",
        "#FD6600",
        "#FA0101",
        "#CE1F90",
        "#FD01FA",
      ],
      //风险区域位置颜色集合
      reArr: [],
      //航线数据
      lineData: [],
      //风险航线 线段点集合，用于删除
      linesArr: [],
      assessMentInfo: {} // 点击航线信息
    };
  },
  computed: {
    ...mapState({
      routeAlgorithmInfo: (state) => state.menuBar.routeAlgorithmInfo,
      routeInfoflag: (state) => state.earth.routeInfoflag,
      closeflag: (state) => state.routeInfo.closeflag,
    }),
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    routeAlgorithmInfo: {
      handler(val) {
        console.log(val[1],`信息`)
        if (val[0]) {
          this.assessManagerShow = true;
          this.assessMentInfo = val[1];
          this.fetch();
        } else {
          this.assessManagerShow = false;
          this.assessMentInfo = val[1];
        }
      },
      deep: true,
    },

    routeInfoflag(val) {
      console.log("区域航线val------", val);
      //清除风险等级区域
      this.clearRectangle();
      this.clearRouteLine();
      //true选中显示风险等级区域
      if (val) {
        this.drawRectangle();
        //false选中航线，显示变色的航线
      } else {
        this.drawRouteLine();
      }
    },
    closeflag(val){
      if(val){
        this.close()
      }
    }
  },
  methods: {
    ...mapMutations({
      setRouteAlgorithmInfo: "menuBar/setRouteAlgorithmInfo",
      setTitleList: "routeInfo/setTitleList",
      setDataList: "routeInfo/setDataList",
      setRouteInfoShow: "routeInfo/setRouteInfoShow",
      setCloseflag: "routeInfo/setCloseflag",
    }),
    //点击打开评估页面，默认显示按区域评估
    detailAssessMentInfo(row,pointIndex) {
      console.log(row, `detailAssessMentInfo`);
      this.setCloseflag(false)
      this.clearRectangle();
      this.clearRouteLine();
      this.setRouteInfoShow(false);
      this.riskArr = []
      //默认显示风险评估区域
      //获取风险评估区域，绘制
      this.$get("api/assessment/evaluation-conclusion", {
        assessmentId: row.id, //评估id
        courseTime: "", //航线的时间节点
        index: pointIndex, //航线第几个时间点
      }).then((res) => {
        console.log(res, "评估数据");
        this.riskArr = res.data.data;
        this.drawRectangle();
        // //循环构建数组
        // this.reArr = [];
        // let color = "";
        // this.riskArr.forEach((item) => {
        //   item.forEach((item1) => {
        //     if (parseInt(Number(item1.value) * 10) != 10) {
        //       color = this.colorArr[parseInt(Number(item1.value) * 10)];
        //     } else {
        //       color = this.colorArr[this.colorArr.length - 1];
        //     }
        //     this.reArr.push({
        //       corner1: [Number(item1.lat), Number(item1.lon)],
        //       corner2: [
        //         Number(item1.lat) - Number(item1.grid),
        //         Number(item1.lon) + Number(item1.grid),
        //       ],
        //       color: color,
        //     });
        //   });
        // });
        // console.log(this.reArr, "画风险评估区域---------");
        // this.reArr.forEach((item) => {
        //   let bounds = [item.corner1, item.corner2];
        //   let rectangle = L.rectangle(bounds, {
        //     fillColor: item.color,
        //     color: "#000000",
        //     weight: 1,
        //     fillOpacity: 0.5,
        //   }).addTo(map);
        //   this.rectangle.push(rectangle);
        // });

        this.$get("api/course/one", {
          id: row.courseId,
        }).then((res) => {
          this.lineData = res.data.data.courseItemList;
          //请求航线详细信息数据，构造显示下方列表
          this.$get("api/assessment/line-conclusion", {
            assessmentId: row.id,
          }).then((res) => {
            console.log(res.data.data, "航线评估数据-----------");
            let obj = res.data.data;
            let titleList = ["风险等级"];
            let dataList = [];
            for (let key in obj) {
              if (key != "conclusion") {
                titleList.push(key);
              }
            }
            for (let i = 0; i < obj.conclusion.length; i++) {
              let arr = [obj.conclusion[i].dateTime,obj.conclusion[i].value];
              for (let key in obj) {
                if(key != "conclusion"){
                  arr.push(obj[key][i].value);
                }
              }
              dataList.push(arr);
            }
            // console.log(titleList);
            // console.log(dataList);
            this.setTitleList(titleList);
            this.setDataList(dataList);
            this.setRouteInfoShow(true);
          });
        });

        //显示航线
        // let latlngs = []
        // this.$get("api/course/one", {
        //   id: row.courseId,
        // }).then((res) => {
        //   console.log(res.data.data, "航线数据");
        //   let arr = res.data.data.courseItemList;
        //   arr.forEach((item) => {
        //     latlngs.push([Number(item.latitude), Number(item.longitude)]);
        //   });
        //   // L.polyline(latlngs, { color: "blue" }).addTo(map);
        //   console.log(latlngs,"航线点-------------");

        //   let allPoint = [];
        //   for (let i = 0; i < latlngs.length - 1; i++) {
        //     let lineArr = this.cutLine(latlngs[i], latlngs[i + 1]);

        //     allPoint = [...allPoint, ...lineArr];
        //     console.log("lineArr--------------", lineArr);
        //     for (let i = 0; i < lineArr.length - 1; i++) {
        //       let line = [lineArr[i].position, lineArr[i + 1].position];
        //       L.polyline(line, { color: lineArr[i].color }).addTo(map);
        //     }
        //   }
        //   console.log(allPoint, "所有点----------------");
        //   allPoint[allPoint.length - 1].color =
        //     allPoint[allPoint.length - 2].color;
        //   allPoint.forEach((item, index) => {
        //     if (item.color == "") {
        //       allPoint.splice(index, 1);
        //     }
        //   });
        //   console.log("处理之后的所有点------", allPoint);
        //   let pointArr = [];
        //   allPoint.forEach((item) => {
        //     latlngs.forEach((item1) => {
        //       if (
        //         item.position[0] == item1[0] &&
        //         item.position[1] == item1[1]
        //       ) {
        //         pointArr.push(item);
        //       }
        //     });
        //   });
        //   console.log(pointArr);
        //   pointArr.forEach((item) => {
        //     L.circleMarker(item.position, {
        //       radius: 6,
        //       fillOpacity: 1,
        //       fillColor: item.color,
        //       weight: 0,
        //     }).addTo(map);
        //   });
        // });
      });
      this.setRouteAlgorithmInfo([0, {}]);
    },
    // 搜索重置
    resetSearch() {
      this.queryParams = {
        warshipName: null,
      };
      this.search();
    },
    // 搜索
    search() {
      this.fetch({
        ...this.queryParams,
      });
    },
    // 获取表格数据
    fetch(params = {}) {
      params.pageSize = this.pagination.size;
      params.pageNum = this.pagination.num;
      // params.courseId = this.assessMentInfo.id;
      this.$get("/api/assessment", {
        ...params
      }).then((res) => {
        if (res.data.data) {
          console.log(res.data.data, `assessment`);
          this.total = res.data.data.length;
          this.tableData = res.data.data;
        }
      });
    },
    closeManager() {
      this.assessManagerShow = false;
      this.setRouteAlgorithmInfo([0, {}]);
    },

    //清除风险区域
    clearRectangle() {
      this.rectangle.forEach((item) => {
        map.removeLayer(item);
      });
      this.rectangle = [];
    },

    //传两个端点,根据风险评估区域给这段线段划分区域，进行变色(point1为这一段的起始点，point2为这一段的结束点)
    cutLine(point1, point2) {
      let latArr = [];
      let lonArr = [];
      this.riskArr.forEach((item) => {
        latArr.push(Number(item[0].lat));
      });
      // latArr.push(latArr[latArr.length - 1] - this.arr[0][0].grid);
      latArr.sort((a, b) => {
        return a - b;
      });
      this.riskArr[0].forEach((item) => {
        lonArr.push(Number(item.lon));
      });
      // lonArr.push(lonArr[lonArr.length - 1] + this.arr[0][0].grid);
      lonArr.sort((a, b) => {
        return a - b;
      });
      console.log(latArr, lonArr);
      //特殊情况  航线为垂直竖线时，即两点经度相等
      if (point1[1] === point2[1]) {
        console.log("垂直竖线");
        //找跟纬度的交叉点
        let pointArr = [];
        latArr.forEach((item) => {
          if (
            item >= Math.min(point1[0], point2[0]) &&
            item <= Math.max(point1[0], point2[0])
          ) {
            pointArr.push([item, point1[1]]);
          }
        });
        pointArr.push(point1, point2);
        let newArr = [];
        //去除重复的点
        if (point1[0] > point2[0]) {
          //纬度从高到低排序
          newArr = this.removeRepeat(pointArr, "y-");
        } else if (point1[0] < point2[0]) {
          //纬度从低到高排序
          newArr = this.removeRepeat(pointArr, "y+");
        }
        console.log(newArr);
        let fArr = [];
        for (let i = 0; i < newArr.length - 1; i++) {
          let middleY = (newArr[i][0] + newArr[i + 1][0]) / 2;
          let middleX = (newArr[i][1] + newArr[i + 1][1]) / 2;
          for (let j = 0; j < latArr.length - 1; j++) {
            if (middleY > latArr[j] && middleY < latArr[j + 1]) {
              console.log(this.reArr);
              let index = this.reArr.findIndex((item) => {
                return (
                  item.corner1[0] == latArr[j + 1] &&
                  middleX > item.corner1[1] &&
                  middleX <= item.corner2[1]
                );
              });
              if (index != -1) {
                fArr.push({
                  position: newArr[i],
                  color: this.reArr[index].color,
                });
              } else {
                let index1 = this.reArr.findIndex((item) => {
                  return (
                    item.corner1[0] == latArr[j + 1] &&
                    middleX >= item.corner1[1] &&
                    middleX < item.corner2[1]
                  );
                });
                fArr.push({
                  position: newArr[i],
                  color: this.reArr[index1].color,
                });
              }
            }
          }
        }
        fArr.push({
          position: newArr[newArr.length - 1],
          color: "",
        });
        console.log("最终---------", fArr);
        return fArr;

        //航线为横着的横线时，即两点纬度相等
      } else if (point1[0] === point2[0]) {
        console.log("横线");
        //找跟经度的交叉点
        let pointArr = [];
        lonArr.forEach((item) => {
          if (
            item >= Math.min(point1[1], point2[1]) &&
            item <= Math.max(point1[1], point2[1])
          ) {
            pointArr.push([point1[0], item]);
          }
        });
        pointArr.push(point1, point2);
        let newArr = [];
        //去除重复的点
        if (point1[1] > point2[1]) {
          //经度从高到低排序
          newArr = this.removeRepeat(pointArr, "x-");
        } else if (point1[1] < point2[1]) {
          //纬度从低到高排序
          newArr = this.removeRepeat(pointArr, "x+");
        }
        console.log(newArr);
        //构建位置，颜色数组，用于循环绘制变色线
        let fArr = [];
        for (let i = 0; i < newArr.length - 1; i++) {
          let middleY = (newArr[i][0] + newArr[i + 1][0]) / 2;
          let middleX = (newArr[i][1] + newArr[i + 1][1]) / 2;
          for (let j = 0; j < lonArr.length - 1; j++) {
            if (middleX > lonArr[j] && middleX < lonArr[j + 1]) {
              console.log(this.reArr);
              let index = this.reArr.findIndex((item) => {
                return (
                  item.corner2[1] == lonArr[j + 1] &&
                  middleY >= item.corner2[0] &&
                  middleY < item.corner1[0]
                );
              });
              if (index != -1) {
                fArr.push({
                  position: newArr[i],
                  color: this.reArr[index].color,
                });
              } else {
                let index1 = this.reArr.findIndex((item) => {
                  return (
                    item.corner2[1] == lonArr[j + 1] &&
                    middleY > item.corner2[0] &&
                    middleY <= item.corner1[0]
                  );
                });
                fArr.push({
                  position: newArr[i],
                  color: this.reArr[index1].color,
                });
              }
            }
          }
        }
        fArr.push({
          position: newArr[newArr.length - 1],
          color: "",
        });
        console.log("最终---------", fArr);
        return fArr;
      } else {
        console.log("斜线-----------");
        //首先根据这两点构建一个函数
        let a = (point2[0] - point1[0]) / (point2[1] - point1[1]); //根据两点确定直线函数解析式的斜率
        let b = point1[0] - a * point1[1]; //确定函数解析式偏移量
        console.log("斜率", a, "偏移量", b);

        let pointArr = [];
        //循环纬度，找交叉点
        latArr.forEach((item) => {
          if (
            item >= Math.min(point1[0], point2[0]) &&
            item <= Math.max(point1[0], point2[0])
          ) {
            pointArr.push([item, (item - b) / a]);
          }
        });
        lonArr.forEach((item) => {
          if (
            item >= Math.min(point1[1], point2[1]) &&
            item <= Math.max(point1[1], point2[1])
          ) {
            pointArr.push([a * item + b, item]);
          }
        });
        pointArr.push(point1, point2);
        console.log("去重之前的交点数组-------", pointArr);
        let newArr = [];
        //去除重复的点,并排序
        if (point1[1] > point2[1]) {
          //经度从高到低排序
          newArr = this.removeRepeat(pointArr, "x-");
        } else if (point1[1] < point2[1]) {
          //纬度从低到高排序
          newArr = this.removeRepeat(pointArr, "x+");
        }
        console.log("去重排序之后的数组-----------", newArr);
        let index = newArr.findIndex((item) => {
          return (
            ((item[0] == point1[0] || item[1] == point1[1]) &&
              !(item[0] == point1[0] && item[1] == point1[1])) ||
            ((item[0] == point2[0] || item[1] == point2[1]) &&
              !(item[0] == point2[0] && item[1] == point2[1]))
          );
        });
        if (index != -1) {
          newArr.splice(index, 1);
        }

        //构建位置，颜色数组，用于循环绘制变色线
        let fArr = [];
        for (let i = 0; i < newArr.length - 1; i++) {
          //每两个点计算一下中点位置
          let middleY = (newArr[i][0] + newArr[i + 1][0]) / 2;
          let middleX = (newArr[i][1] + newArr[i + 1][1]) / 2;
          let index = this.reArr.findIndex((item) => {
            return (
              middleX > item.corner1[1] &&
              middleX < item.corner2[1] &&
              middleY > item.corner2[0] &&
              middleY < item.corner1[0]
            );
          });
          if (index != -1) {
            fArr.push({
              position: newArr[i],
              color: this.reArr[index].color,
            });
          }
        }
        fArr.push({
          position: newArr[newArr.length - 1],
          color: "",
        });
        console.log("最终---------", fArr);
        return fArr;
      }
    },

    //点的二维数组去重排序,K表示排序的方式（x+:经度递增排序，x-:经度递减排序，y+:纬度递增排序，y-:纬度递减排序）
    removeRepeat(pointArr, k) {
      //先数组去重
      let newArr = [];
      pointArr.forEach((item) => {
        if (newArr.length == 0) {
          newArr.push(item);
        } else {
          let i = newArr.findIndex((item1) => {
            return item1[0] === item[0] && item1[1] === item[1];
          });
          if (i == -1) {
            newArr.push(item);
          }
        }
      });
      console.log("排序前-------", newArr);
      //排序
      if (k == "x+") {
        // console.log(newArr.sort(this.compare(1,"+")));
        return newArr.sort(this.compare(1, "+"));
      } else if (k == "x-") {
        // console.log(newArr.sort(this.compare(1,"-")));
        return newArr.sort(this.compare(1, "-"));
      } else if (k == "y+") {
        // console.log(newArr.sort(this.compare(0,"+")));
        return newArr.sort(this.compare(0, "+"));
      } else if (k == "y-") {
        // console.log(newArr.sort(this.compare(0,"-")));
        return newArr.sort(this.compare(0, "-"));
      }
    },
    compare(property, m) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (m == "+") {
          return value1 - value2;
        } else if (m == "-") {
          return value2 - value1;
        }
      };
    },

    //绘制风险等级区域
    drawRectangle() {
      //循环构建数组
      this.reArr = [];
      let color = "";
      this.riskArr.forEach((item) => {
        item.forEach((item1) => {
          if (parseInt(Number(item1.value) * 10) != 10) {
            color = this.colorArr[parseInt(Number(item1.value) * 10)];
          } else {
            color = this.colorArr[this.colorArr.length - 1];
          }
          this.reArr.push({
            corner1: [Number(item1.lat), Number(item1.lon)],
            corner2: [
              Number(item1.lat) - Number(item1.grid),
              Number(item1.lon) + Number(item1.grid),
            ],
            color: color,
          });
        });
      });
      console.log(this.reArr, "画风险评估区域---------");
      this.reArr.forEach((item) => {
        let bounds = [item.corner1, item.corner2];
        let rectangle = L.rectangle(bounds, {
          fillColor: item.color,
          color: "#000000",
          weight: 1,
          fillOpacity: 0.5,
        }).addTo(map);
        this.rectangle.push(rectangle);
      });
    },

    //绘制风险等级航线
    drawRouteLine() {
      let latlngs = [];
      this.lineData.forEach((item) => {
        latlngs.push([Number(item.latitude), Number(item.longitude)]);
      });
      // L.polyline(latlngs, { color: "blue" }).addTo(map);
      console.log(latlngs, "航线点-------------");

      let allPoint = [];
      for (let i = 0; i < latlngs.length - 1; i++) {
        let lineArr = this.cutLine(latlngs[i], latlngs[i + 1]);
        allPoint = [...allPoint, ...lineArr];
        console.log("lineArr--------------", lineArr);
        for (let i = 0; i < lineArr.length - 1; i++) {
          let line = [lineArr[i].position, lineArr[i + 1].position];
          let lines = L.polyline(line, { color: lineArr[i].color }).addTo(map);
          this.linesArr.push(lines);
        }
      }
      console.log(allPoint, "所有点----------------");
      allPoint[allPoint.length - 1].color = allPoint[allPoint.length - 2].color;
      allPoint.forEach((item, index) => {
        if (item.color == "") {
          allPoint.splice(index, 1);
        }
      });
      console.log("处理之后的所有点------", allPoint);
      let pointArr = [];
      allPoint.forEach((item) => {
        latlngs.forEach((item1) => {
          if (item.position[0] == item1[0] && item.position[1] == item1[1]) {
            pointArr.push(item);
          }
        });
      });
      console.log(pointArr);
      pointArr.forEach((item) => {
        let circle = L.circleMarker(item.position, {
          radius: 6,
          fillOpacity: 1,
          fillColor: item.color,
          weight: 0,
        }).addTo(map);

        this.linesArr.push(circle);
      });
    },

    clearRouteLine() {
      this.linesArr.forEach((item) => {
        map.removeLayer(item);
      });
      this.linesArr = [];
    },

    //关闭评估页面，清除绘制的评估区域或航线
    close(){
      this.setRouteInfoShow(false);
      this.clearRectangle()
      this.clearRouteLine()
    }
  },
};
</script>

<style lang="scss" scoped></style>
