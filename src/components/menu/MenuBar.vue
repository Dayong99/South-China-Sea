<template>
  <div id="menuBar" class="menuBar">
    <div class="search">
      <div
        :class="{ search_bgcolor: searchFlag, search_icon: true }"
        @click.stop="changeSearch"
      >
        <img :src="searchIcon" />
      </div>
      <div class="search_input">
        <div class="input_left">
          <img src="@/assets/images/menu/search.png" />
        </div>
        <div class="input_content">
          <el-input
            v-model="searchValue"
            placeholder="请输入位置（lat, lng）"
            clearable
            class="search_content"
            @keyup.enter.native="location"
          ></el-input>
        </div>
        <div class="input_right">
          <img src="@/assets/images/menu/heart.png" />
        </div>
      </div>
    </div>

    <div class="menu_list" v-show="searchFlag">
      <ul class="list_ul">
        <li v-for="(item, index) in menuList" :key="index" class="list_ul_li">
          <div class="title_box">
            <img :src="item.icon" />
            <div class="title">
              <span
                @click.stop="openTask(index)"
                :class="{ title_bg: item.flag }"
                >{{ item.name }}</span
              >
              <img
                src="@/assets/images/menu/add.png"
                v-if="index == 2"
                @click.stop="addTask(index)"
              />
            </div>
            <img
              :src="iconList[0]"
              v-if="index == 2"
              class="down"
              @click.stop="openTask(index)"
            />
            <img
              :src="iconList[1]"
              v-if="index == 3"
              class="down"
              @click.stop="openTask(index)"
            />
            <img
              :src="iconList[2]"
              v-if="index == 4"
              class="down"
              @click.stop="openTask(index)"
            />
          </div>

          <!-- 任务管理 -->
          <ul class="list_task_ul" v-show="item.flag && flagList[0]">
            <li v-for="(item, index) in taskList" :key="index">
              <div class="task_list">
                <div class="task_name" @click="switchTask(item, index)">
                  <div class="task_dot" :class="{ active: item.checked }"></div>
                  <span class="task_desc">{{ item.name }}</span>
                </div>
                <div class="task_operation" style="margin-left: 0">
                  <el-button
                    icon="el-icon-edit-outline"
                    class="table_column_icon green"
                    type="text"
                    @click="editTaskItem(item)"
                  ></el-button>
                  <el-button
                    icon="el-icon-delete"
                    class="table_column_icon red"
                    type="text"
                    @click="deleteTaskItem(item)"
                  ></el-button>
                  <el-button
                    icon="el-icon-plus"
                    class="table_column_icon blueDeep"
                    type="text"
                    @click="addTaskItem(item, index)"
                  ></el-button>
                </div>
              </div>

              <!-- 航线列表 -->
              <div
                class="task_content_wrapper"
                v-if="item.routeList.length && item.checked"
              >
                <div
                  class="task_content"
                  v-for="(itemRoute, indexRoute) in item.routeList"
                  :key="`route${indexRoute}`"
                >
                  <!-- 航线列表 -->
                  <div class="task_content_desc">
                    <div class="task_content_name">
                      {{ itemRoute.lineName }}
                    </div>
                    <div class="control_wrapper">
                      <img
                        src="@/assets/images/menu/info.png"
                        @click="algorithm(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/edit.svg"
                        @click="algorithm(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/bin.svg"
                        @click="deleteRoute(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/tree.svg"
                        @click="algorithm(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/down.png"
                        @click.stop="
                          getAssessItem(itemRoute, indexRoute, item, index)
                        "
                      />
                    </div>
                  </div>

                  <!-- 评估列表 -->
                  <div class="assess_wrapper">
                    <div
                      class="assess_items"
                      v-for="(itemAssess, indexAssess) in itemRoute.assessList"
                      :key="`assess${indexAssess}`"
                    >
                      <div class="assess_desc">
                        {{ itemAssess.assesstime | filterTime }}
                      </div>
                      <div class="assess_control">
                        <img
                          src="@/assets/images/menu/bin.svg"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                        <img
                          src="@/assets/images/menu/treeInfo.svg"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                        <img
                          src="@/assets/images/menu/area.svg"
                          class="control_items"
                          @click="
                            showAssessArea(itemAssess, indexAssess, itemRoute)
                          "
                        />
                        <img
                          src="@/assets/images/menu/line.svg"
                          class="control_items"
                          @click="
                            showAssessLine(itemAssess, indexAssess, itemRoute)
                          "
                        />
                        <img
                          src="@/assets/images/menu/table.svg"
                          class="control_items"
                          @click="
                            showAssessInfo(itemAssess)
                          "
                        />
                        <img
                          src="@/assets/images/menu/next.svg"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- 系统设置 -->
          <ul
            class="list_system_ul"
            v-show="item.flag && flagList[1]"
            style="height: auto; overflow-y: hidden"
          >
            <li v-for="(item, index) in systemList" :key="index">
              <div class="task_list">
                <div class="task_name" @click="openSystem(index)">
                  <span>{{ item.name }}</span>
                </div>
                <div class="task_operation">
                  <el-button
                    icon="el-icon-s-operation"
                    class="table_column_icon purple"
                    type="text"
                    @click="openSystem(index)"
                  ></el-button>
                </div>
              </div>
            </li>
          </ul>

          <!-- 数据管理 -->
          <ul
            class="list_system_ul"
            v-show="item.flag && flagList[2]"
            style="height: auto; overflow-y: hidden"
          >
            <li v-for="(item, index) in dataList" :key="index">
              <div class="task_list">
                <div class="task_name" @click="openData(index)">
                  <span>{{ item.name }}</span>
                </div>
                <div class="task_operation">
                  <el-button
                    icon="el-icon-s-operation"
                    class="table_column_icon purple"
                    type="text"
                    @click="openData(index)"
                  ></el-button>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      // 任务列表
      taskList: [],
      // 任务航线列表
      routeList: [],
      // 评估列表
      assessList: [],

      searchFlag: false,
      searchIcon: require("@/assets/images/menu/unselect.png"),
      searchValue: "",
      downIcon: require("@/assets/images/menu/down.png"),
      upIcon: require("@/assets/images/menu/up.png"),
      iconList: [
        require("@/assets/images/menu/down.png"),
        require("@/assets/images/menu/down.png"),
        require("@/assets/images/menu/down.png"),
      ],
      flagList: [false, false, false],
      nowMenuList: [],
      //风险评估区域集合，用于删除
      rectangle: [],
      //风险评估航线集合，用于删除
      routeLine: [],
      //风险等级
      colorArr: ["#00ff00", "#ffff00", "#ff8000", "#9919e5", "#ff0000"],
    };
  },
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
      systemList: (state) => state.menuBar.systemList,
      dataList: (state) => state.menuBar.dataList,
      TaskManagerOptions: (state) => state.menuBar.TaskManagerOptions,
      routeDialogOptions: (s) => s.menuBar.routeDialogOptions,
      algorithmOptions: (s) => s.menuBar.algorithmOptions,
    }),
  },
  watch: {
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex((item) => {
          return item.flag == true;
        });
      },
      deep: true,
    },
    flagList(newval, oldval) {
      this.iconList = new Array(3).fill(this.downIcon);
      let index = this.flagList.indexOf(true);
      if (index !== -1) {
        this.iconList[index] = this.upIcon;
      }
    },
    // 任务变化
    TaskManagerOptions() {
      this.loadTaskList();
    },
    // 航线变化
    routeDialogOptions() {
      console.log("更新航线信息");
    },
  },
  filters: {
    filterTime(val) {
      return val.slice(0, -6);
    },
  },
  methods: {
    ...mapMutations({
      setAlgorithm: "menuBar/setAlgorithm",
      setMenuList: "menuBar/setMenuList",
      setTaskManagerOptions: "menuBar/setTaskManagerOptions",
      setSystem: "menuBar/setSystem",
      setData: "menuBar/setData",
      setRouteDialogOptions: "menuBar/setRouteDialogOptions",
      setRouteAlgorithmInfo: "menuBar/setRouteAlgorithmInfo",
      setTitleList: "routeInfo/setTitleList",
      setDataList: "routeInfo/setDataList",
      setRouteInfoShow: "routeInfo/setRouteInfoShow",
    }),
    routeAlgorithmInfo(item, index) {
      this.setRouteAlgorithmInfo([1, item]);
    },
    changeAssessTime(
      itemAssess,
      indexAssess,
      itemRoute,
      indexRoute,
      item,
      index
    ) {
      console.log(
        itemAssess,
        indexAssess,
        itemRoute,
        indexRoute,
        item,
        index,
        `changeAssessTime`,
        this.taskList
      );
    },
    deleteRoute(item, index) {
      console.log(item, index, `delete`);
      this.$delete(`/api/course`, {
        id: item.id,
      })
        .then(() => {
          this.$message({
            message: "航线删除成功",
            type: "success",
          });
        })
        .then(() => {
          this.loadRouteList(plan_Id);
        });
    },
    algorithm(item, index) {
      this.setAlgorithm([1, item]);
    },
    loadRouteList(item, index) {
      this.taskList[index].routeList = []; // 清空任务点击之前 航线的内容
      this.$get(`/api/course`, {
        plan_Id: item.id,
      })
        .then((res) => {
          if (res.status === 200) {
            this.taskList[index].routeList = res.data.data.rows.map((e, i) => {
              return {
                ...e,
                checked: false,
                assessList: [],
              };
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "航线列表加载失败",
            type: "error",
          });
        });
    },
    // 添加航线
    addTaskItem(item, index) {
      console.log(item, index, `item`);
      this.setRouteDialogOptions([1, item]);
    },
    switchTask(item, index) {
      if (item.checked) {
        this.taskList[index].checked = false;
      } else {
        this.taskList = this.taskList.map((e, i) => {
          let obj = e;
          obj.checked = false;
          return obj;
        });
        this.loadRouteList(item, index);
        this.taskList[index].checked = true;
      }
    },
    editTaskItem(item) {
      this.setTaskManagerOptions([2, item]);
    },
    deleteTaskItem(item) {
      console.log(item, `item`);
      this.$confirm("确认删除该任务么")
        .then(() => {
          this.$delete(`/api/plan`, {
            id: item.id,
          })
            .then(() => {
              this.$message({
                message: "任务删除成功",
                type: "success",
              });
            })
            .then(() => {
              this.loadTaskList();
            })
            .catch(() => {
              this.$message({
                message: "任务删除失败",
                type: "error",
              });
            });
        })
        .catch((_) => {
          this.$message({
            message: "取消删除",
            type: "information",
          });
        });
    },
    // 任务列表
    loadTaskList() {
      let params = {
        pageSize: 1000000,
      };
      this.$get(`/api/plan`, {
        ...params,
      }).then((res) => {
        if (res.data.data) {
          this.taskList = res.data.data.rows.map((e, i) => {
            return {
              ...e,
              checked: false,
              routeList: [],
            };
          });
          console.log(this.taskList, `this.taskList`);
        }
      });
    },
    // 定位
    location() {
      let i = this.searchValue.indexOf(",");
      let j = this.searchValue.indexOf("，");
      if (i != -1 || j != -1) {
        let latlon = null;
        if (i != -1) {
          latlon = this.searchValue.split(",");
          window.map.flyTo(L.latLng(latlon[0], latlon[1]));
        } else if (j != -1) {
          latlon = this.searchValue.split("，");
          window.map.flyTo(L.latLng(latlon[0], latlon[1]));
        }
      } else {
        this.$message.warning("位置格式不正确");
      }
    },

    // 点击航线 获取评估结果
    getAssessItem(itemRoute, indexRoute, item, index) {
      console.log(itemRoute, indexRoute, item, index, `getAssessItem`);
      // 获取该航线评估结果
      this.loadAssessInfo(itemRoute, indexRoute, item, index);
    },

    // 载入评估结果
    loadAssessInfo(itemRoute, indexRoute, item, index) {
      console.log(
        itemRoute,
        indexRoute,
        item,
        index,
        `loadAssessInfo`,
        this.taskList[index].routeList[indexRoute].assessList
      );
      this.$get(`/api/assessment`, {
        courseId: itemRoute.id,
      }).then((res) => {
        if (res.status === 200) {
          this.taskList[index].routeList[
            indexRoute
          ].assessList = res.data.data.map((e, i) => {
            return {
              ...e,
              line: false,
              area: false,
              table: false,
              timeIndex: 0,
              alorithm: false,
            };
          });
        }
      });
    },
    //------------start搜索框--------------
    // 改变搜索图标，并显示菜单栏
    changeSearch() {
      this.searchFlag = !this.searchFlag;
      if (this.searchFlag) {
        this.searchIcon = require("@/assets/images/menu/select.png");
      } else {
        this.searchIcon = require("@/assets/images/menu/unselect.png");
        this.menuList.forEach((item) => {
          item.flag = false;
        });
        this.setMenuList(this.menuList);
        this.iconList = new Array(3).fill(this.downIcon);
        this.flagList = new Array(3).fill(false);
      }
    },
    //------------end搜索框--------------

    //------------start任务管理--------------
    // 添加任务
    addTask(index) {
      this.setTaskManagerOptions([1, {}]);
    },
    // 打开任务管理
    openTask(index) {
      console.log(index, `openTask`);
      // 重置
      this.menuList.forEach((item) => {
        item.flag = false;
      });
      // 任务管理器
      if (index == 2) {
        this.loadTaskList();
      }

      if (index == 2 || index == 3 || index == 4) {
        this.menuList[index].flag = !this.flagList[index - 2];
        this.flagList = new Array(3).fill(false);
        if (this.menuList[index].flag) {
          this.flagList[index - 2] = true;
        }
      } else {
        this.menuList[index].flag = true;
        this.iconList = new Array(3).fill(this.downIcon);
        this.flagList = new Array(3).fill(false);
      }
      this.setMenuList(this.menuList);
    },
    //------------end任务管理--------------

    // 系统配置
    openSystem(index) {
      this.setSystem({ index: index, val: true });
    },

    // 数据管理
    openData(index) {
      this.setData({ index: index, val: true });
    },

    //显示评估区域
    showAssessArea(itemAssess, indexAssess, itemRoute) {
      console.log(itemAssess, itemRoute, "点击风险评估区域");
      //单个评估区域和航线互斥
      itemAssess.line = false;
      //清除风险等级航线
      this.clearRouteById(itemAssess.id);
      //单条航线多个评估互斥
      itemRoute.assessList.forEach((item) => {
        if (item.id != itemAssess.id) {
          item.area = false;
          item.line = false;
          this.clearRectangleById(item.id);
          this.clearRouteById(item.id);
        }
      });

      itemAssess.area = !itemAssess.area;
      //绘制风险等级区域
      if (itemAssess.area) {
        this.clearRectangleById(itemAssess.id);
        this.drawRectangle(
          itemAssess.id,
          itemAssess.timeIndex,
          itemAssess.courseId
        );
      } else {
        //清除该评估的风险区域
        this.clearRectangleById(itemAssess.id);
      }
    },

    //显示评估航线
    showAssessLine(itemAssess, indexAssess, itemRoute) {
      console.log(itemAssess, itemRoute, "点击风险评估航线");
      //单个评估区域和航线互斥
      itemAssess.area = false;
      //清除风险等级区域
      this.clearRectangleById(itemAssess.id);
      //单条航线多个评估互斥
      itemRoute.assessList.forEach((item) => {
        if (item.id != itemAssess.id) {
          item.area = false;
          item.line = false;
          this.clearRectangleById(item.id);
          this.clearRouteById(item.id);
        }
      });

      itemAssess.line = !itemAssess.line;
      //绘制风险等级航线
      if (itemAssess.line) {
        this.clearRouteById(itemAssess.id);
        this.drawRouteLine(
          itemAssess.id,
          itemAssess.timeIndex,
          itemAssess.courseId
        );
      } else {
        //清除该评估的风险航线
        this.clearRouteById(itemAssess.id);
      }
    },

    //获取风险等级航线详细信息列表
    showAssessInfo(itemAssess) {
      //互斥，表格只能显示一个
      console.log(this.taskList,"任务列表----------");
      this.taskList.forEach(item=>{
        if(item.routeList.length!=0){
          item.routeList.forEach(item1=>{
            if(item1.assessList.length!=0){
              item1.assessList.forEach(item2=>{
                if(item2.id!=itemAssess.id){
                  item2.table = false
                  this.setRouteInfoShow(false)
                }
              })
            }
          })
        }
      })

      itemAssess.table = !itemAssess.table;
      if(itemAssess.table){
        //请求航线详细信息数据，构造显示下方列表
        this.$get("api/assessment/line-conclusion", {
          assessmentId: itemAssess.id,
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
            let arr = [obj.conclusion[i].dateTime, obj.conclusion[i].value];
            for (let key in obj) {
              if (key != "conclusion") {
                arr.push(obj[key][i].value);
              }
            }
            dataList.push(arr);
          }
          this.setTitleList(titleList);
          this.setDataList(dataList);
          this.setRouteInfoShow(true);
        });
      }else{
        this.setRouteInfoShow(false);
      }
    },

    //绘制风险等级区域
    drawRectangle(assessmentId, timeIndex, courseId) {
      let riskArr = [];
      //获取风险评估区域，绘制
      this.$get("api/assessment/evaluation-conclusion", {
        assessmentId: assessmentId, //评估id
        courseTime: "", //航线的时间节点
        index: timeIndex, //航线第几个时间点
      }).then((res) => {
        console.log(res, "评估数据");
        riskArr = res.data.data;

        let reArr = [];
        let color = "";
        riskArr.forEach((item) => {
          item.forEach((item1) => {
            if (parseInt(Number(item1.value) * 10) != 10) {
              color = this.colorArr[parseInt((Number(item1.value) * 10) / 2)];
            } else {
              color = this.colorArr[this.colorArr.length - 1];
            }
            reArr.push({
              corner1: [Number(item1.lat), Number(item1.lon)],
              corner2: [
                Number(item1.lat) - Number(item1.grid),
                Number(item1.lon) + Number(item1.grid),
              ],
              color: color,
            });
          });
        });
        console.log(reArr, "画风险评估区域---------");
        reArr.forEach((item) => {
          let bounds = [item.corner1, item.corner2];
          let rectangle = L.rectangle(bounds, {
            fillColor: item.color,
            color: "#000000",
            weight: 1,
            fillOpacity: 0.5,
          }).addTo(map);
          rectangle.assessmentId = assessmentId;
          rectangle.courseId = courseId;
          this.rectangle.push(rectangle);
        });
      });
    },

    //绘制风险等级航线
    drawRouteLine(assessmentId, timeIndex, courseId) {
      let riskArr = [];
      //获取风险评估区域，绘制
      this.$get("api/assessment/evaluation-conclusion", {
        assessmentId: assessmentId, //评估id
        courseTime: "", //航线的时间节点
        index: timeIndex, //航线第几个时间点
      }).then((res) => {
        // console.log(res, "评估数据");
        riskArr = res.data.data;

        let reArr = [];
        let color = "";
        riskArr.forEach((item) => {
          item.forEach((item1) => {
            if (parseInt(Number(item1.value) * 10) != 10) {
              color = this.colorArr[parseInt((Number(item1.value) * 10) / 2)];
            } else {
              color = this.colorArr[this.colorArr.length - 1];
            }
            reArr.push({
              corner1: [Number(item1.lat), Number(item1.lon)],
              corner2: [
                Number(item1.lat) - Number(item1.grid),
                Number(item1.lon) + Number(item1.grid),
              ],
              color: color,
            });
          });
        });
        console.log(reArr, "画风险评估区域---------");
        //获取单个航线数据
        this.$get("api/course/one", {
          id: courseId,
        }).then((res) => {
          let lineData = res.data.data.courseItemList;
          let latlngs = [];
          lineData.forEach((item) => {
            latlngs.push([Number(item.latitude), Number(item.longitude)]);
          });
          // L.polyline(latlngs, { color: "blue" }).addTo(map);
          console.log(latlngs, "航线点-------------");

          let allPoint = [];
          for (let i = 0; i < latlngs.length - 1; i++) {
            let lineArr = this.cutLine(
              latlngs[i],
              latlngs[i + 1],
              riskArr,
              reArr
            );
            allPoint = [...allPoint, ...lineArr];
            console.log("lineArr--------------", lineArr);
            for (let i = 0; i < lineArr.length - 1; i++) {
              let line = [lineArr[i].position, lineArr[i + 1].position];
              let lines = L.polyline(line, { color: lineArr[i].color }).addTo(
                map
              );
              lines.assessmentId = assessmentId;
              lines.courseId = courseId;
              this.routeLine.push(lines);
            }
          }
          console.log(allPoint, "所有点----------------");
          allPoint[allPoint.length - 1].color =
            allPoint[allPoint.length - 2].color;
          allPoint.forEach((item, index) => {
            if (item.color == "") {
              allPoint.splice(index, 1);
            }
          });
          console.log("处理之后的所有点------", allPoint);
          let pointArr = [];
          allPoint.forEach((item) => {
            latlngs.forEach((item1) => {
              if (
                item.position[0] == item1[0] &&
                item.position[1] == item1[1]
              ) {
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
            circle.assessmentId = assessmentId;
            circle.courseId = courseId;
            this.routeLine.push(circle);
          });
        });
      });
    },

    //根据评估id清除图上的风险评估区域
    clearRectangleById(id) {
      console.log(this.rectangle, "保存的风险区域----------");
      for (let i = 0; i < this.rectangle.length; i++) {
        if (this.rectangle[i].assessmentId == id) {
          map.removeLayer(this.rectangle[i]);
          this.rectangle.splice(i, 1);
          i--;
        }
      }
    },
    //根据航线id清除图上的风险评估区
    //根据评估id清除图上的风险评估航线
    clearRouteById(id) {
      console.log(this.routeLine, "保存的风险区域----------");
      for (let i = 0; i < this.routeLine.length; i++) {
        if (this.routeLine[i].assessmentId == id) {
          map.removeLayer(this.routeLine[i]);
          this.routeLine.splice(i, 1);
          i--;
        }
      }
    },

    //传两个端点,根据风险评估区域给这段线段划分区域，进行变色(point1为这一段的起始点，point2为这一段的结束点)
    cutLine(point1, point2, riskArr, reArr) {
      let latArr = [];
      let lonArr = [];
      riskArr.forEach((item) => {
        latArr.push(Number(item[0].lat));
      });
      // latArr.push(latArr[latArr.length - 1] - this.arr[0][0].grid);
      latArr.sort((a, b) => {
        return a - b;
      });
      riskArr[0].forEach((item) => {
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
              console.log(reArr);
              let index = reArr.findIndex((item) => {
                return (
                  item.corner1[0] == latArr[j + 1] &&
                  middleX > item.corner1[1] &&
                  middleX <= item.corner2[1]
                );
              });
              if (index != -1) {
                fArr.push({
                  position: newArr[i],
                  color: reArr[index].color,
                });
              } else {
                let index1 = reArr.findIndex((item) => {
                  return (
                    item.corner1[0] == latArr[j + 1] &&
                    middleX >= item.corner1[1] &&
                    middleX < item.corner2[1]
                  );
                });
                fArr.push({
                  position: newArr[i],
                  color: reArr[index1].color,
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
              console.log(reArr);
              let index = reArr.findIndex((item) => {
                return (
                  item.corner2[1] == lonArr[j + 1] &&
                  middleY >= item.corner2[0] &&
                  middleY < item.corner1[0]
                );
              });
              if (index != -1) {
                fArr.push({
                  position: newArr[i],
                  color: reArr[index].color,
                });
              } else {
                let index1 = reArr.findIndex((item) => {
                  return (
                    item.corner2[1] == lonArr[j + 1] &&
                    middleY > item.corner2[0] &&
                    middleY <= item.corner1[0]
                  );
                });
                fArr.push({
                  position: newArr[i],
                  color: reArr[index1].color,
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
          let index = reArr.findIndex((item) => {
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
              color: reArr[index].color,
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
  },
};
</script>

<style lang="scss" scoped></style>
