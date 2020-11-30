<template>
  <el-dialog
    :title="title"
    width="1180px"
    top="80px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="routeManagerShow"
    append-to-body
    @close="closeManager"
  >
    <div class="dialog_map_wrapper">
      <div class="route_map_wrapper">
        <div id="routeMap" class="routeMap" />
      </div>
      <div class="timeLine_wrapper">
        <div class="slider_wrapper">
          <div class="slider"></div>
          <div class="time_points">
            <div
              class="slider-items"
              v-for="(item, index) in routeCollect.length"
              :key="`routeCollect${index}`"
              @click="activeRoutePoint = index"
            >
              <span
                class="item"
                :class="{ active: activeRoutePoint === index }"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div class="routeInfo_wrapper">
        <div class="routeInfo_item">
          <div class="item">
            航线名称：<el-input
              class="input_wrapper"
              size="mini"
              v-model="routeInfoList.name"
              placeholder="请输入名称"
            ></el-input>
          </div>
          <div class="item">
            经度：<el-input
              class="input_wrapper"
              size="mini"
              v-model="routePointInfo.lon"
              placeholder="请输入经度"
            ></el-input>
          </div>
          <div class="item">
            纬度：<el-input
              class="input_wrapper"
              size="mini"
              v-model="routePointInfo.lat"
              placeholder="请输入纬度"
            ></el-input>
          </div>
          <div class="item">
            港口名：<el-input
              class="input_wrapper"
              size="mini"
              v-model="routePointInfo.port"
              placeholder="请输入港口名"
            ></el-input>
          </div>
          <div class="item">
            时间：
            <el-date-picker
              class="date_wrapper"
              v-model="routePointInfo.time"
              type="datetime"
              size="mini"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div
        class="button_wrapper"
        :class="{ active: routeEditShow }"
        @click="routeEditClick"
      >
        {{ this.title }}
      </div>
      <div
        class="hand_wrapper"
        :class="{ active: routeCustomActive }"
        @click="routeCustomClick"
      >
        手动绘制
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import "@/utils/leaflet.ChineseTmsProviders.js";
export default {
  components: {},
  data() {
    return {
      routeInfoList: {
        name: null,
        routePoint: [],
      },
      routePointInfo: {
        lon: null,
        lat: null,
        port: null,
        time: null,
      },
      routeCustomActive: false,
      title: "添加任务",
      routeManagerShow: false,
      routeEditShow: false,

      activeRoutePoint: 0,
      routeCollect: [], //  航线点集合
      geometry: [], // 航线全部信息
      routeLineLayer: [], // 航线线段
      pointPro: {
        color: "#ffffff",
        fillColor: "#2F4F4F",
        fillOpacity: 0.6,
        radius: 5000,
        weight: 2,
      }, // 画点属性信息
      linePro: {
        color: "#BDB76B",
      }, // 画线属性
      routeArr: [],
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      routeDialogOptions: (state) => state.menuBar.routeDialogOptions,
    }),
  },
  watch: {
    routeDialogOptions: {
      handler: function (val) {
        if (val[0] === 1) {
          this.title = "添加航线";
        }
        if (val[0] === 2) {
          this.title = "修改航线";
        }
        this.routeManagerShow = val[0];
        this.$nextTick(() => {
          this.initMap();
        });
      },
    },
  },
  methods: {
    ...mapMutations({
      setRouteDialogOptions: "menuBar/setRouteDialogOptions",
    }),
    changeTimeSteap() {},
    routeCustomClick() {
      this.routeCustomActive = !this.routeCustomActive;
      if (this.routeCustomActive) {
        this.removeRoute();
        this.routeCollect = [];
        this.draw();
      } else {
      }
    },
    closeManager() {
      this.routeManagerShow = false;
      this.setRouteDialogOptions([0, {}]);
      window.routeMap.remove();
    },
    draw() {
      var geometry = [];
      var points = []; // 点
      var lines = new L.polyline(points, this.linePro); // 画线
      var tempLines = new L.polyline([], this.linePro); // 移动画线
      window.routeMap.on("click", onClick); //点击地图
      window.routeMap.on("contextmenu", onRightClick);
      const that = this;
      // 点击事件
      function onClick(e) {
        points.push([e.latlng.lat, e.latlng.lng]); // 存储点击点
        lines.addLatLng(e.latlng); // 创建线对象
        window.routeMap.addLayer(lines); // 画线 d第一次只有一个所以只显示一个
        const node = L.circle(e.latlng, that.pointPro);
        window.routeMap.addLayer(node); // 将点显示在地图上
        geometry.push(node); // 存储图层
        that.routeCollect.push(node); // 存储点图层
        that.activeRoutePoint = that.routeCollect.length - 1; // 当前激活的航线点
        window.routeMap.on("mousemove", onMove); // 开启移动监听事件
      }
      // 移动事件
      function onMove(e) {
        if (points.length > 0) {
          // 如果points中有值 即已经左击
          var ls = [points[points.length - 1], [e.latlng.lat, e.latlng.lng]]; // 最后一个存储点数据和移动的点位置 动态画线
          tempLines.setLatLngs(ls);
          window.routeMap.addLayer(tempLines);
        }
      }
      // 右击事件
      function onRightClick(e) {
        geometry.push(L.polyline(points, that.linePro).addTo(window.routeMap)); // 存储线信息 geometry存储全部航线信息
        points = [];
        lines.remove(); // 移除之前点击的线信息
        tempLines.remove(); // 移除最后一条为左击的动态线
        geometry.forEach((e, i) => {
          e.remove();
        });
        window.routeMap.off("mousemove"); // 关闭鼠标移动事件
        window.routeMap.off("click"); // 关闭鼠标左击事件
        window.routeMap.off("contextmenu"); // 关闭鼠标右击事件
        that.routeCustomActive = false; // 手动绘制按钮取消高亮
        that.drawRouteCompute();
      }
    },
    drawRouteCompute() {
      this.routeArr = [];
      let pointArr = [];
      this.routeCollect.forEach((e, i) => {
        this.routeArr.push([e._latlng.lat, e._latlng.lng]);
        // pop内容
        const content = `<p>纬度：${e._latlng.lat.toFixed(
          2
        )}</p><p>纬度：${e._latlng.lng.toFixed(2)}</p>`;
        const point = L.circle([e._latlng.lat, e._latlng.lng], {
          id: i,
          color: "#ffffff",
          fillColor: "#2F4F4F",
          fillOpacity: 0.6,
          radius: 5000,
          weight: 2,
        })
          .addTo(window.routeMap)
          .bindPopup(content)
          .on("mouseover", function () {
            this.openPopup();
          })
          .on("mouseout", function () {
            this.closePopup();
          })
          .on("click", clickPoint); // 航线点
        pointArr.push(point);
      });
      this.routeLineLayer = L.polyline(this.routeArr, this.linePro).addTo(
        window.routeMap
      ); // 线
      this.routeCollect = pointArr;
      pointArr.push(this.routeLineLayer);
      this.geometry = pointArr;
      const that = this;
      function clickPoint(e) {
        console.log(e.target.options.id, `clickPoint`);
        console.log(pointArr, `pointArrpointArrpointArr`);
        that.routeCollect[e.target.options.id].on("mousemove", movePoint);
        console.log(that.routeCollect[e.target.options.id]._latlng);
      }

      function movePoint(e) {
        that.routeCollect[e.target.options.id].setLatLngs = L.latLng(
          e.latlng.lat,
          e.latlng.lng
        );
        that.routeCollect[e.target.options.id].redraw();
      }
    },
    routeEditClick() {
      this.routeEditShow = !this.routeEditShow;
      if (this.routeEditShow) {
        this.routeCustomActive = false;
        this.editRoute();
      }
    },
    removeRoute() {
      this.geometry.forEach((e, i) => {
        e.remove();
      });
    },
    // 重置
    reset() {
      this.routeEditShow = false;
      this.routeCollect = [];
      this.routeCustomActive = false;
    },

    // 编辑 新增 航线
    editRoute() {
      if (this.routeCollect.length) {
        let dataArr = [];
        this.routeCollect.forEach((e, i) => {
          let obj = {
            arrivalTime: null,
            latitude: null,
            longitude: null,
            itemIndex: null,
            itemName: null,
            lineName: null,
          };
          let timeArr = [
            "2020-09-01 03:00:00",
            "2020-09-01 05:00:00",
            "2020-09-01 07:00:00",
            "2020-09-01 09:00:00",
            "2020-09-01 11:00:00",
            "2020-09-02 05:00:00",
            "2020-09-02 09:00:00",
            "2020-09-03 11:00:00",
            "2020-09-03 20:00:00",
            "2020-09-04 09:00:00",
            "2020-09-05 01:00:00",
            "2020-09-05 11:00:00",
          ];
          obj["itemIndex"] = i;
          obj["itemName"] = "港口";
          obj["longitude"] = e._latlng.lng;
          obj["latitude"] = e._latlng.lat;

          obj["arrivalTime"] = timeArr[i];
          dataArr.push(obj);
        });
        let params = {
          courseItemList: dataArr,
          ctype: 0,
          plan_Id: this.routeDialogOptions[1].id,
          lineName: "航线",
        };
        this.$jsonPost(`/api/course`, {
          ...params,
        })
          .then(() => {
            this.$message({
              message: "航线添加成功",
              type: "success",
            });
          })
          .then(() => {
            this.setRouteDialogOptions([0, {}]);
            this.reset();
          })
          .catch(() => {
            this.$message({
              message: "航线添加失败",
              type: "error",
            });
          });
      }
      this.routeCollect = [];
    },

    // 航线初始化
    initMap() {
      window.routeMap = L.map("routeMap", {
        attributionControl: false,
        crs: L.CRS.EPSG3857,
        minZoom: 2,
        maxZoom: 13,
        worldCopyJump: true,
        zoomControl: false,
      });
      L.tileLayer
        .chinaProvider("Geoq.Normal.PurplishBlue", { maxZoom: 13, minZoom: 2 })
        .addTo(window.routeMap);
      window.routeMap.setView([35.09, 102.21], 4);
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog_map_wrapper {
  width: 1250px;
  height: 500px;
  .route_map_wrapper {
    width: 1160px;
    height: 400px;
    #routeMap {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
  }
  .routeInfo_wrapper {
    width: 1100px;
    height: 50px;
    border-radius: 5px;
    padding: 5px;
    margin-left: 20px;

    .routeInfo_item {
      height: 100%;
      display: flex;
      padding-top: 5px;
      padding-left: 4px;
      .item {
        flex: 1;
        .date_wrapper {
          width: 170px;
          height: 30px;
        }
        .input_wrapper {
          width: 120px;
          height: 30px;
        }
      }
    }
  }
  .timeLine_wrapper {
    margin-top: 15px;
    width: 1160px;
    height: 50px;
    border-radius: 5px;
    padding: 5px;
    .slider_wrapper {
      width: 1150px;
      .slider {
        background: rgba(185, 184, 167, 1);
        width: 100%;
        height: 3px;
        top: 9px;
        position: relative;
        z-index: 1;
      }
      .time_points {
        height: 20px;
        width: 100%;
        display: flex;
        .slider-items {
          flex: 1;
          .item {
            z-index: 99999;
            display: inline-block;
            border: 2px solid #1c1581;
            border-radius: 100%;
            width: 10px;
            height: 10px;
            position: relative;
            cursor: pointer;
          }
          .active {
            background: #1c1581;
          }
        }
      }
    }
  }
  .button_wrapper {
    width: 64px;
    height: 24px;
    position: absolute;
    top: 75px;
    left: 18px;
    cursor: pointer;
    z-index: 10000;
    background: #ffffff;
    text-align: center;
    border-radius: 5px;
    color: rgba(117, 109, 109, 1);
    box-shadow: 0px 0px 10px #000;
  }
  .hand_wrapper {
    width: 64px;
    height: 24px;
    position: absolute;
    top: 110px;
    left: 18px;
    cursor: pointer;
    z-index: 10000;
    background: #ffffff;
    text-align: center;
    border-radius: 5px;
    color: rgba(117, 109, 109, 1);
    box-shadow: 0px 0px 10px #000;
  }
  .active {
    background: #981a00;
    color: #ffffff;
  }
}
</style>