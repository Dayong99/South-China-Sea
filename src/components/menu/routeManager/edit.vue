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
              v-for="(item, index) in routeInfo.length"
              :key="`routeInfo${index}`"
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
      <div class="routeInfo_wrapper" v-if="routeInfo.length">
        <div class="routeInfo_item">
          <div class="item">
            航线名称：<el-input
              class="input_wrapper"
              size="mini"
              v-model="routeInfoName"
              placeholder="请输入名称"
            ></el-input>
          </div>
          <div class="item">
            经度：<el-input
              class="input_wrapper"
              size="mini"
              v-model="routeInfo[activeRoutePoint].lng"
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
              value-format="yyyy-MM-dd HH:mm:ss"
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
        <!-- {{ this.title }} -->
        保存
      </div>
      <div
        class="hand_wrapper"
        :class="{ active: routeCustomActive }"
        @click="routeCustomClick"
        v-show="isDrawFlag"
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
      routeInfoName: null, // 航线名
      routeCustomActive: false,
      title: "添加任务",
      routeManagerShow: false,
      routeEditShow: false,

      activeRoutePoint: 0,
      routeCollect: [], // 航线点集合
      routeInfo: [], // 航线信息集合
      geometry: [], // 航线全部信息
      lastLine: null, // 添加航线时可编辑线
      // 手动绘制显隐,修改航线false不显示
      isDrawFlag: false,
      editLine: null, // 修改航线时编辑
      markArr: [],
      moveIcon: null,
      currentMarkerGroup: null,
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      routeDialogOptions: (state) => state.menuBar.routeDialogOptions,
      showList: (state) => state.menuBar.showList,
      nowIndex: (state) => state.menuBar.nowIndex,
    }),
  },
  watch: {
    routeDialogOptions: {
      handler: function(val) {
        this.routeManagerShow = val[0] ? true : false;
        this.$nextTick(() => {
          this.initMap();
        });
        console.log(val, `航线新增`);
        if (val[0] === 1) {
          this.title = "添加航线";
          this.isDrawFlag = true;
        }
        if (val[0] === 2) {
          this.title = "修改航线";
          this.isDrawFlag = false;
          this.routeInfoName = val[1].lineName;
          let courseList = val[1].courseItemList;
          this.routeInfo = [];
          courseList.forEach((item) => {
            let obj = {
              lat: item.latitude,
              lng: item.longitude,
              port: item.itemName,
              time: item.arrivalTime,
              vertexId: null,
            };
            this.routeInfo.push(obj);
          });
          this.$nextTick(() => {
            this.editRouteInfo();
          });
          console.log("routeInfo", this.routeInfo);
        }
      },
    },
    routeInfo: {
      handler(val) {
        console.log(val, "航线信息");
        this.drawNum(val);
      },
      deep: true,
    },
    activeRoutePoint(val) {
      this.drawNum(this.routeInfo);
    },
  },
  methods: {
    ...mapMutations({
      setRouteDialogOptions: "menuBar/setRouteDialogOptions",
      setShowEdit: "menuBar/setShowEdit",
    }),
    routeCustomClick() {
      this.routeCustomActive = !this.routeCustomActive;
      if (this.routeCustomActive) {
        this.reset();
        // 关闭编辑，并清除
        // console.log(this.lastLine);
        if (this.lastLine) {
          this.lastLine.off("editable:vertex:new");
          this.lastLine.off("editable:vertex:drag");
          this.lastLine.off("editable:vertex:deleted");
          this.lastLine.disableEdit();
          this.lastLine.remove();
          this.lastLine = null;
        }
        console.log(this.lastLine);
        this.draw();
      }
      console.log(this.routeCustomActive, `this.routeCustomActive draw`);
    },
    closeManager() {
      this.routeManagerShow = false;
      this.routeDialogOptions[0] == 2 ? this.setShowEdit(this.nowIndex) : ""; //航线列表子项操作显隐
      this.setRouteDialogOptions([
        0,
        this.routeDialogOptions[1],
        this.routeDialogOptions[2],
        false,
      ]);
      this.reset();
      if (this.lastLine) {
        this.lastLine.disableEdit();
        this.lastLine.remove();
        this.lastLine = null;
      }
      window.routeMap.remove();
    },
    draw() {
      // 开启航线绘制
      this.lastLine = window.routeMap.editTools.startPolyline();
      this.currentMarkerGroup = L.layerGroup([]).addTo(window.routeMap);
      this.moveIcon = L.marker([0, 0]);
      // startPolyline: function (latlng, options) {
      //       var line = this.createPolyline([], options);
      //       line.enableEdit(this.map).newShape(latlng);
      //       return line;
      //   },
      //开启鼠标移动监听
      window.routeMap.on("mousemove", this.moveFunction, this);

      // 添加航线点
      this.lastLine.on("editable:vertex:new", (e) => {
        let i = e.vertex.getIndex();
        let obj = {
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6),
          port: null,
          time: null,
          vertexId: e.vertex._leaflet_id,
        };
        this.routeInfo.splice(i, 0, obj);
        this.activeRoutePoint = i;
      });
      // 拖动航线点
      this.lastLine.on("editable:vertex:drag", (e) => {
        console.log("edit------------", e);
        let i = e.vertex.getIndex();
        this.activeRoutePoint = i;
        let obj = {
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6),
          port: this.routeInfo[i].port,
          time: this.routeInfo[i].time,
          vertexId: e.vertex._leaflet_id,
        };
        this.routeInfo.splice(i, 1, obj);
      });
      // 删除航线点
      this.lastLine.on("editable:vertex:deleted", (e) => {
        console.log("-----------", e);
        console.log("-----------", this.lastLine);
        let i = this.routeInfo.findIndex((item) => {
          return item.vertexId == e.vertex._leaflet_id;
        });
        // 删除尾部点时
        if (i == this.routeInfo.length - 1) {
          this.activeRoutePoint = this.routeInfo.length - 2;
        }
        if(this.activeRoutePoint>=i&&this.activeRoutePoint!=0){
          this.activeRoutePoint--
        }
        this.routeInfo.splice(i, 1);
      });
      // 暂停编辑
      this.lastLine
        .on("dblclick", L.DomEvent.stop)
        .on("dblclick", this.lastLine.toggleEdit);

      // 右键停止编辑
      window.routeMap.on("contextmenu", (e) => {
        window.routeMap.editTools.stopDrawing();
        //清除提示信息并关闭鼠标移动监听事件
        if (window.routeMap.hasLayer(this.currentMarkerGroup)) {
          this.currentMarkerGroup.clearLayers();
        }
        // this.currentMarkerGroup.clearLayers();
        window.routeMap.off("mousemove", this.moveFunction, this);
        this.routeCustomActive = false;
      });
    },

    moveFunction(e) {
      // console.log(e, "鼠标移动========");
      if (window.routeMap.hasLayer(this.currentMarkerGroup)) {
        this.currentMarkerGroup.clearLayers();
      }
      this.moveIcon.addTo(this.currentMarkerGroup);
      this.moveIcon.setIcon(
        L.divIcon({
          html:
            "<div class='leaflet-marker-markerTooltip'>点击开始绘制 右键结束</div>",
          className: "leaflet-marker-noDefaultDivIcon",
        })
      );
      this.moveIcon.setLatLng(e.latlng);
      // this.myIcon = L.divIcon({
      //   html: "<div>24小时警戒线</div>",
      //   className: "my-div-icon",
      //   iconSize: 50,
      // });
      // let mark1 = L.marker([e.latlng.lat, e.latlng.lng], {
      //   icon: myIcon,
      // }).addTo(window.routeMap);
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
      this.routeInfo = [];
      this.activeRoutePoint = 0;
      this.routeInfoName = null;
    },

    // 编辑 新增 航线
    editRoute() {
      if (this.routeInfo.length) {
        let dataArr = [];
        this.routeInfo.forEach((e, i) => {
          let obj = {
            arrivalTime: null,
            latitude: null,
            longitude: null,
            itemIndex: null,
            itemName: null,
            lineName: null,
          };
          obj["lineName"] = this.routeInfoName;
          obj["itemIndex"] = i;
          obj["itemName"] = e.port;
          obj["longitude"] = e.lng;
          obj["latitude"] = e.lat;
          obj["arrivalTime"] = e.time;
          dataArr.push(obj);
        });
        if (this.routeDialogOptions[0] == 1) {
          let params = {
            courseItemList: dataArr,
            ctype: 0,
            plan_Id: this.routeDialogOptions[1].id,
            lineName: this.routeInfoName,
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
              this.setRouteDialogOptions([
                0,
                this.routeDialogOptions[1],
                this.routeDialogOptions[2],
                true,
              ]);
              this.reset();
            })
            .catch(() => {
              this.$message({
                message: "航线添加失败",
                type: "error",
              });
            });
        } else if (this.routeDialogOptions[0] == 2) {
          let params = {
            courseItemList: dataArr,
            ctype: 0,
            id: this.routeDialogOptions[1].id,
            plan_Id: this.routeDialogOptions[1].plan_Id,
            lineName: this.routeInfoName,
          };
          this.$jsonPut("/api/course", {
            ...params,
          })
            .then((res) => {
              this.$message({
                message: "航线修改成功",
                type: "success",
              });

              this.setRouteDialogOptions([
                0,
                this.routeDialogOptions[1],
                this.routeDialogOptions[2],
                true,
              ]);
              this.reset();
            })
            .catch(() => {
              this.$message({
                message: "航线修改失败",
                type: "error",
              });
            });
        }
      }
      this.routeInfo = [];
    },

    // 修改航线
    editRouteInfo() {
      let routeArr = [];
      this.routeInfo.forEach((item) => {
        let arr = [];
        arr.push(Number(item.lat));
        arr.push(Number(item.lng));
        routeArr.push(arr);
      });
      this.editLine = L.polyline(routeArr).addTo(window.routeMap);
      this.editLine.enableEdit();
      console.log(this.editLine);
      this.editLine._latlngs.forEach((item, index) => {
        this.routeInfo[index].vertexId = item.__vertex._leaflet_id;
      });
      console.log(this.routeInfo);
      // 添加航线点
      this.editLine.on("editable:vertex:new", (e) => {
        let i = e.vertex.getIndex();
        let obj = {
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6),
          port: null,
          time: null,
          vertexId: e.vertex._leaflet_id,
        };
        this.routeInfo.splice(i, 0, obj);
        this.activeRoutePoint = i;
      });
      // 拖动航线点
      this.editLine.on("editable:vertex:drag", (e) => {
        console.log("edit------------", e);
        let i = e.vertex.getIndex();
        this.activeRoutePoint = i;
        let obj = {
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6),
          port: this.routeInfo[i].port,
          time: this.routeInfo[i].time,
          vertexId: e.vertex._leaflet_id,
        };
        this.routeInfo.splice(i, 1, obj);
      });
      // 删除航线点
      this.editLine.on("editable:vertex:deleted", (e) => {
        let i = this.routeInfo.findIndex((item) => {
          return item.vertexId == e.vertex._leaflet_id;
        });
        // 删除尾部点时
        if (i == this.routeInfo.length - 1) {
          this.activeRoutePoint = this.routeInfo.length - 2;
        }
        if(this.activeRoutePoint>=i&&this.activeRoutePoint!=0){
          this.activeRoutePoint--
        }
        this.routeInfo.splice(i, 1);
      });
      // 暂停编辑
      this.editLine
        .on("dblclick", L.DomEvent.stop)
        .on("dblclick", this.editLine.toggleEdit);

      // 右键停止编辑
      window.routeMap.on("contextmenu", (e) => {
        window.routeMap.editTools.stopDrawing();
      });
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
        // 开启编辑线插件
        editable: true,
      });
      L.tileLayer
        .chinaProvider("Geoq.Normal.PurplishBlue", { maxZoom: 13, minZoom: 2 })
        .addTo(window.routeMap);
      window.routeMap.setView([35.09, 102.21], 4);
    },
    //给航线上每个点添加序号
    drawNum(data) {
      this.deleteNum();
      data.forEach((item, index) => {
        if (this.activeRoutePoint == index) {
          let myIcon = L.divIcon({
            html: `<div>${index + 1}</div>`,
            className: "my-div-icon-red",
            iconSize: 50,
          });
          let mark = L.marker([item.lat, item.lng], { icon: myIcon }).addTo(
            window.routeMap
          );
          this.markArr.push(mark);
        } else {
          let myIcon = L.divIcon({
            html: `<div>${index + 1}</div>`,
            className: "my-div-icon-blue",
            iconSize: 50,
          });
          let mark = L.marker([item.lat, item.lng], { icon: myIcon }).addTo(
            window.routeMap
          );
          this.markArr.push(mark);
        }
      });
    },
    //删除序号
    deleteNum() {
      this.markArr.forEach((item) => {
        window.routeMap.removeLayer(item);
      });
      this.markArr = [];
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
    // margin-left: 20px;

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
    // top: 75px;
    // left: 18px;
    bottom: 9px;
    right: 12px;
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
    top: 80px;
    // top: 110px;
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
<style lang="scss">
.my-div-icon-blue {
  color: #3388ff;
  // writing-mode: vertical-rl;
  width: 20px !important;
  margin-left: 10px !important;
  margin: 0 auto;
  line-height: 24px;
  font-size: 16px;
  font-weight: 700;
}
.my-div-icon-red {
  color: red;
  // writing-mode: vertical-rl;
  width: 20px !important;
  margin-left: 10px !important;
  margin: 0 auto;
  line-height: 24px;
  font-size: 16px;
  font-weight: 700;
}
</style>
