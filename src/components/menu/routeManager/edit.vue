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
              v-model="routeInfo[activeRoutePoint].lon"
              placeholder="请输入经度"
            ></el-input>
          </div>
          <div class="item">
            纬度：<el-input
              class="input_wrapper"
              size="mini"
              v-model="routeInfo[activeRoutePoint].lat"
              placeholder="请输入纬度"
            ></el-input>
          </div>
          <div class="item">
            港口名：<el-input
              class="input_wrapper"
              size="mini"
              v-model="routeInfo[activeRoutePoint].port"
              placeholder="请输入港口名"
            ></el-input>
          </div>
          <div class="item">
            时间：
            <el-date-picker
              class="date_wrapper"
              v-model="routeInfo[activeRoutePoint].time"
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
      routePointCollect: [],
      routeInfoList: {
        name: null,
        routePoint: [],
      },
      routeCustomActive: false,
      title: "添加任务",
      routeManagerShow: false,
      routeEditShow: false,

      activeRoutePoint: 0,
      routeCollect: [], // 航线点集合
      routeInfo: [
        {
          lon: null,
          lat: null,
          port: null,
          time: null,
        },
      ], // 航线信息集合
      geometry: [], // 航线全部信息
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
        // this.routeCollect.forEach((e, i) => {
        //   e.remove();
        // });
        this.geometry.forEach((e, i) => {
          e.remove();
        });
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
      this.routePointCollect = [];
      const nodeStyleOptions = {
        color: "#ff0000",
        fillColor: "ff0000",
        fillOpacity: 1,
        radius: 300,
      };
      var lines = new L.polyline(this.routePointCollect); // 画线
      var tempLines = new L.polyline([]); // 暂存线
      window.routeMap.on("click", (e) => {
        this.routePointCollect.push([e.latlng.lat, e.latlng.lng]); // 储存点信息
        window.routeMap.addLayer(lines.addLatLng(e.latlng)); // 暂存线绘制
        const node = L.circle(e.latlng, nodeStyleOptions);
        window.routeMap.addLayer(node); // 点
        this.geometry.push(node);
        this.routeCollect.push(node);
        this.routeInfo.push({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          port: null,
          time: null,
        });
        this.activeRoutePoint = this.routeCollect.length - 1;
        window.routeMap.on("mousemove", (e) => {
          if (this.routePointCollect.length > 0) {
            var ls = [
              this.routePointCollect[this.routePointCollect.length - 1],
              [e.latlng.lat, e.latlng.lng],
            ];
            tempLines.setLatLngs(ls);
            window.routeMap.addLayer(tempLines);
          }
        }); //双击地图
      }); //点击地图

      window.routeMap.on("contextmenu", (e) => {
        this.geometry.push(
          L.polyline(this.routePointCollect).addTo(window.routeMap)
        );
        this.routePointCollect = [];
        lines.remove();
        window.routeMap.off("mousemove");
        window.routeMap.off("click");
        window.routeMap.off("contextmenu");
        this.routeCustomActive = false;
        tempLines.remove();
      });
    },

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
          lineName: this.routeInfoList.name,
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