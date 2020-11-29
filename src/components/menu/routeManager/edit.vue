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
          <el-slider
            v-model="value2"
            :step="timeLineStep"
            show-stops
            @input="changeTimeSteap"
          ></el-slider>
        </div>
      </div>
      <div
        class="routeInfo_wrapper"
      >
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
      // 航线信息
      routeInfoList: {
        name: null,
        routePoint: []
      },
      // 当前航线点信息
      routePointInfo: {
        lon: null,
        lat: null,
        port: null,
        time: null
      },
      input: "",
      value1: "",
      value2: 0,
      timeLineStep: 100,
      routeCustomActive: false,
      title: "添加任务",
      routeManagerShow: false,
      routeEditShow: false,
      routeCollect: [], //  航线点集合
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
        console.log(val[1], `val[0]`);
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
    changeTimeSteap() {
      console.log(this.value2, `this.value2`);
    },
    routeCustomClick() {
      this.routeCustomActive = !this.routeCustomActive;
      if (this.routeCustomActive) {
        this.routeCollect.forEach((e, i) => {
          e.remove();
        });
        this.routeCollect = [];
        this.draw();
        this.timeLineStep = 100;
      } else {
      }
    },
    closeManager() {
      this.routeManagerShow = false;
      this.setRouteDialogOptions([0, {}]);
      window.routeMap.remove();
    },
    draw() {
      var points = [], // 点
        geometry = []; // 线段
      var lines = new L.polyline(points); // 画线
      var tempLines = new L.polyline([]); // 移动画线
      window.routeMap.on("click", onClick); //点击地图
      window.routeMap.on("contextmenu", onRightClick);
      const that = this;
      // 点击事件
      function onClick(e) {
        points.push([e.latlng.lat, e.latlng.lng]);
        lines.addLatLng(e.latlng);
        window.routeMap.addLayer(lines);
        const node = L.circle(e.latlng, {
          color: "#ff0000",
          fillColor: "ff0000",
          fillOpacity: 1,
          radius: 300,
        });
        window.routeMap.addLayer(node);
        geometry.push(node);
        that.routeCollect.push(node);
        that.timeLineStep = (100 / geometry.length).toFixed(2);
        window.routeMap.on("mousemove", onMove); //双击地图
      }
      // 移动事件
      function onMove(e) {
        if (points.length > 0) {
          var ls = [points[points.length - 1], [e.latlng.lat, e.latlng.lng]];
          tempLines.setLatLngs(ls);
          window.routeMap.addLayer(tempLines);
        }
      }
      // 右击事件
      function onRightClick(e) {
        geometry.push(L.polyline(points).addTo(window.routeMap));
        points = [];
        lines.remove();
        window.routeMap.off("mousemove");
        window.routeMap.off("click");
        window.routeMap.off("contextmenu");
        that.routeCustomActive = false;
        tempLines.remove();
      }
    },

    // 
    routeEditClick() {
      this.routeEditShow = !this.routeEditShow;
      if (this.routeEditShow) {
        this.routeCustomActive = false;
        this.editRoute();
      }
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
          console.log(e._latlng.lng, e._latlng.lat, `e._latlng.lat`);
          let obj = {
            arrivealTime: null,
            latitude: null,
            longitude: null,
            itemIndex: null,
            itemName: null,
            lineName: null
          };
          let timeArr = ["2020-09-01 03:00:00","2020-09-02 04:00:00","2020-09-03 05:00:00"]
          obj["itemIndex"] = i;
          obj["itemName"] = "hahah";
          obj["longitude"] = e._latlng.lng;
          obj["latitude"] = e._latlng.lat;

          obj["arrivalTime"] = timeArr[i];
          dataArr.push(obj);
        });
        let params = {
          courseItemList: dataArr,
          ctype: 0,
          plan_Id: this.routeDialogOptions[1].id,
          lineName: '航线'
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
    }
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
    margin-top: 5px;
    width: 1160px;
    height: 50px;
    border-radius: 5px;
    padding: 5px;
    .slider_wrapper {
      width: 1150px;
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