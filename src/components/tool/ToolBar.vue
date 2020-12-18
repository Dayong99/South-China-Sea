<template>
  <div class="right-top-container" id="toolBar">
    <div class="tool_item zoom" @click.stop="zoomIn">
      <el-tooltip class="item" effect="light" content="放大" placement="bottom">
        <img src="@/assets/toolList/add.svg" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right zoom" @click.stop="zoomOut">
      <el-tooltip class="item" effect="light" content="缩小" placement="bottom">
        <img src="@/assets/toolList/minus.svg" />
      </el-tooltip>
    </div>
    <div
      class="tool_item tool_right"
      :class="{ bg: flagObj.measureflag }"
      @click.stop="measure"
    >
      <el-tooltip
        class="item"
        effect="light"
        content="距离量算"
        placement="bottom"
      >
        <img src="@/assets/toolList/ruler.svg" />
      </el-tooltip>
    </div>
    <div
      class="tool_item tool_right"
      :class="{ bg: flagObj.measureareaflag }"
      @click.stop="measurearea"
    >
      <el-tooltip
        class="item"
        effect="light"
        content="面积量算"
        placement="bottom"
      >
        <img src="@/assets/toolList/area.svg" />
      </el-tooltip>
    </div>
    <div
      class="tool_item tool_right"
      :class="{ bg: flagObj.locationflag }"
      @click.stop="locationDialog"
    >
      <el-tooltip
        class="item"
        effect="light"
        content="坐标定位"
        placement="bottom"
      >
        <img src="@/assets/toolList/location.svg" />
      </el-tooltip>
    </div>
    <div
      class="tool_item tool_right"
      :class="{ bg: flagObj.tileflag }"
      @click.stop="changeTileLayer"
    >
      <el-tooltip
        class="item"
        effect="light"
        content="底图切换"
        placement="bottom"
      >
        <img src="@/assets/toolList/product.svg" />
      </el-tooltip>
    </div>
    <div
      class="tool_item tool_right"
      :class="{ bg: flagObj.graticuleflag }"
      @click.stop="graticule"
    >
      <el-tooltip
        class="item"
        effect="light"
        content="经纬显示"
        placement="bottom"
      >
        <img src="@/assets/toolList/line.svg" />
      </el-tooltip>
    </div>
    <div
      class="tool_item tool_right"
      :class="{ bg: flagObj.getValueflag }"
      @click.stop="getValue"
    >
      <el-tooltip
        class="item"
        effect="light"
        content="区域取值"
        placement="bottom"
      >
        <img src="@/assets/toolList/getValue.svg" />
      </el-tooltip>
    </div>
    <div
      class="tool_item tool_right"
      :class="{ bg: flagObj.getPointValueflag }"
      @click.stop="getPointValue"
    >
      <el-tooltip
        class="item"
        effect="light"
        content="单点取值"
        placement="bottom"
      >
        <img src="@/assets/toolList/point.svg" />
      </el-tooltip>
    </div>

    <div
      id="screenShot"
      class="tool_item tool_right"
      @click.stop="screenShot"
    >
      <el-tooltip class="item" effect="light" content="截图" placement="bottom">
        <img src="@/assets/toolList/jietu.svg" />
      </el-tooltip>
    </div>

    <div class="tool_item tool_right" @click.stop="clear">
      <el-tooltip
        class="item"
        effect="light"
        content="清除要素"
        placement="bottom"
      >
        <img src="@/assets/toolList/clear.svg" />
      </el-tooltip>
    </div>
    <!-- <div
      class="tool_item tool_right"
      :class="{ bg: flagObj.drawflag }"
      @click.stop="draw"
    >
      <el-tooltip
        class="item"
        effect="light"
        content="绘制图形"
        placement="bottom"
      >
        <img src="@/assets/toolList/draw.png" />
      </el-tooltip>
    </div> -->

    <!-- 经纬度坐标定位框 -->
    <div class="location_dialog" v-show="locationShow">
      <div class="location_top">
        <div class="top_left">
          <img src="@/assets/images/toolbar/location.png" />
          <span>坐标定位</span>
        </div>
        <div class="top_right" @click.stop="closeLocation">
          <img src="@/assets/images/legendbar/close.png" />
        </div>
      </div>
      <div class="location_content">
        <div class="content_top">
          <div class="content_lat">
            <span>纬度:</span>
            <div>
              <input type="text" v-model="lat1" />
              <span>°</span>
            </div>
            <div>
              <input type="text" v-model="lat2" />
              <span>'</span>
            </div>
            <div class="lat">
              <div
                :class="{ lat_n: true, lat_active: latflag }"
                @click.stop="changeLatLng(1, true)"
              >
                N
              </div>
              <div
                :class="{ lat_s: true, lat_active: !latflag }"
                @click.stop="changeLatLng(1, false)"
              >
                S
              </div>
            </div>
          </div>
          <div class="content_lon">
            <span>经度:</span>
            <div>
              <input type="text" v-model="lon1" />
              <span>°</span>
            </div>
            <div>
              <input type="text" v-model="lon2" />
              <span>'</span>
            </div>
            <div class="lon">
              <div
                :class="{ lon_w: true, lon_active: !lonflag }"
                @click.stop="changeLatLng(2, false)"
              >
                W
              </div>
              <div
                :class="{ lon_e: true, lon_active: lonflag }"
                @click.stop="changeLatLng(2, true)"
              >
                E
              </div>
            </div>
          </div>
        </div>
        <div class="content_bottom">
          <div
            class="content_sure"
            :class="{ btn_active: true }"
            @click.stop="checkLocation"
          >
            确定
          </div>
          <div
            class="content_cancle"
            :class="{ btn_active: false }"
            @click.stop="closeLocation"
          >
            取消
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
// import { drawRect } from "../../../public/js/drawRect.js";
import toolBar from "@/utils/toolBar.js";
import "@/utils/leaflet.latlng-graticule.js";

export default {
  components: {},
  data() {
    return {
      rectangle: undefined,
      graticule_zoom: [
        {
          start: 2,
          end: 2,
          interval: 32,
        },
        {
          start: 3,
          end: 3,
          interval: 16,
        },
        {
          start: 4,
          end: 4,
          interval: 8,
        },
        {
          start: 5,
          end: 5,
          interval: 4,
        },
        {
          start: 6,
          end: 6,
          interval: 2,
        },
        {
          start: 7,
          end: 7,
          interval: 1,
        },
        {
          start: 8,
          end: 8,
          interval: 0.5,
        },
        {
          start: 9,
          end: 9,
          interval: 0.25,
        },
        {
          start: 10,
          end: 10,
          interval: 0.125,
        },
        {
          start: 11,
          end: 18,
          interval: 0.0625,
        },
      ],
      latlngGraticuleLayer: null,
      // 定位对话框
      locationShow: false,
      lat1: null,
      lat2: null,
      lon1: null,
      lon2: null,
      latflag: true,
      lonflag: false,
      locationPoint: null,
      flagObj: {
        measureflag: false,
        measureareaflag: false,
        locationflag: false,
        tileflag: false,
        graticuleflag: false,
        getValueflag: false,
        getPointValueflag: false,
        drawflag: false,
        screenShotflag: false,
      },
    };
  },
  computed: {
    nowtime() {
      return this.$store.state.time.time;
    },
    ...mapState({
      menuItemList: (state) => state.sideBar.menuItemList,
      tileLayer: (state) => state.earth.tileLayer,
    }),
  },
  watch: {},
  mounted() {},
  methods: {
    ...mapMutations({
      setInfoData: "clickup/setInfoData",
      setInfoLocation: "clickup/setInfoLocation",
      setInfoShow: "clickup/setInfoShow",
      setTileLayer: "earth/setTileLayer",
    }),
    getViewer() {
      const obj = {
        unit: this.unit,
        latDirection: this.latDirection,
        lngDirection: this.lngDirection,
        lngminute: this.lngminute,
        lngdegree: this.lngdegree,
        latminute: this.latminute,
        latdegree: this.latdegree,
      };
      window.tool = new toolBar(window.map, obj);
    },
    // 地图放大
    zoomIn() {
      window.map.zoomIn(1);
    },
    // 地图缩小
    zoomOut() {
      window.map.zoomOut(1);
    },
    getValue() {
      this.flagObj.getValueflag = !this.flagObj.getValueflag;
      console.log("动态绘制矩形区域");
      // let rectangle;
      let tmprec;
      let latlngs = [];
      let that = this;
      if (this.flagObj.getValueflag) {
        this.resetflag("getValueflag");
        this.clearEvent();
        // this.clear()
        //点击地图
        map.on("click", onClick);
        // map.on(
        //   "click",
        //   (window.mapClick_area = function(e) {
        //     if (typeof tmprec != "undefined") {
        //       // tmprec.remove();
        //       map.removeLayer(tmprec);
        //     }
        //     if (typeof that.rectangle != "undefined") {
        //       // that.rectangle.remove();
        //       map.removeLayer(that.rectangle);
        //     }
        //     //左上角坐标
        //     latlngs[0] = [e.latlng.lat, e.latlng.lng];
        //     //开始绘制，监听鼠标移动事件 //鼠标移动事件
        //     map.on("mousemove",onMove);
        //     // map.on(
        //     //   "mousemove",
        //     //   (window.mapMove_area = function(e) {
        //     //     latlngs[1] = [e.latlng.lat, e.latlng.lng];
        //     //     //删除临时矩形
        //     //     if (typeof tmprec != "undefined") {
        //     //       // tmprec.remove();
        //     //       map.removeLayer(tmprec);
        //     //     }
        //     //     //添加临时矩形
        //     //     tmprec = L.rectangle(latlngs, { dashArray: 5 }).addTo(map);
        //     //   })
        //     // );
        //     //右击事件
        //     map.on("contextmenu",rightClick)
        //     // map.on(
        //     //   "contextmenu",
        //     //   (window.mapRightClick_area = function(e) {
        //     //     //矩形绘制完成，移除临时矩形，并停止监听鼠标移动事件
        //     //     // tmprec.remove();
        //     //     map.removeLayer(tmprec);
        //     //     map.off("mousemove", window.mapMove_area);
        //     //     //右下角坐标
        //     //     latlngs[1] = [e.latlng.lat, e.latlng.lng];

        //     //     console.log("最后一级-------------", latlngs);
        //     //     console.log("当前时间轴时间-----", that.nowtime);
        //     //     console.log("当前选中的要素列表-----", that.menuItemList);

        //     //     let minX = Math.min(latlngs[0][1], latlngs[1][1]);
        //     //     let maxX = Math.max(latlngs[0][1], latlngs[1][1]);
        //     //     let minY = Math.min(latlngs[0][0], latlngs[1][0]);
        //     //     let maxY = Math.max(latlngs[0][0], latlngs[1][0]);
        //     //     console.log(minX, maxX, minY, maxY);
        //     //     let menuItem = that.menuItemList[that.menuItemList.length - 1];
        //     //     //获取区域信息
        //     //     that
        //     //       .$get("api/numerical-forecast/regionalSummary", {
        //     //         day: that.nowtime.substring(0, 10), //日期
        //     //         time: that.nowtime.substring(11, 13), //时间
        //     //         type: menuItem.id, //要素id
        //     //         level: menuItem.currentLevel, //当前选中的层级
        //     //         minX: minX,
        //     //         minY: minY,
        //     //         maxX: maxX,
        //     //         maxY: maxY,
        //     //       })
        //     //       .then((res) => {
        //     //         console.log(res.data.data);
        //     //         let obj = res.data.data;
        //     //         const content = `<p>名称: ${menuItem.name}</p>
        //     //         <p>层级: ${menuItem.currentLevel}</p>
        //     //         <p>时间: ${that.nowtime}</p>
        //     //         <p>minX: ${minX.toFixed(3)}</p>
        //     //         <p>minY: ${minY.toFixed(3)}</p>
        //     //         <p>maxX: ${maxX.toFixed(3)}</p>
        //     //         <p>maxY: ${maxY.toFixed(3)}</p>
        //     //         <p>最小值: ${obj.min.toFixed(3)}</p>
        //     //         <p>最大值: ${obj.max.toFixed(3)}</p>
        //     //         <p>平均值: ${obj.average.toFixed(3)}</p>`;

        //     //         that.rectangle = L.rectangle(latlngs, {
        //     //           color: "#1E90FF",
        //     //           fillOpacity: 0.2,
        //     //           weight: 2,
        //     //         })
        //     //           .addTo(map)
        //     //           .bindPopup(content);
        //     //         that.rectangle.openPopup();
        //     //         // map.off("click")
        //     //         map.off("contextmenu", window.mapRightClick_area);
        //     //       });
        //     //   })
        //     // );
        //   })
        // );
        function onClick(e) {
          if (typeof tmprec != "undefined") {
            // tmprec.remove();
            map.removeLayer(tmprec);
          }
          if (typeof that.rectangle != "undefined") {
            // that.rectangle.remove();
            map.removeLayer(that.rectangle);
          }
          //左上角坐标
          latlngs[0] = [e.latlng.lat, e.latlng.lng];
          //开始绘制，监听鼠标移动事件
          map.on("mousemove", onMove); //鼠标移动事件
          map.on("contextmenu", rightClick); //右击事件
        }

        function onMove(e) {
          latlngs[1] = [e.latlng.lat, e.latlng.lng];
          //删除临时矩形
          if (typeof tmprec != "undefined") {
            // tmprec.remove();
            map.removeLayer(tmprec);
          }
          //添加临时矩形
          tmprec = L.rectangle(latlngs, { dashArray: 5 }).addTo(map);
        }

        function rightClick(e) {
          //矩形绘制完成，移除临时矩形，并停止监听鼠标移动事件
          // tmprec.remove();
          map.removeLayer(tmprec);
          map.off("mousemove");
          //右下角坐标
          latlngs[1] = [e.latlng.lat, e.latlng.lng];

          console.log("最后一级-------------", latlngs);
          console.log("当前时间轴时间-----", that.nowtime);
          console.log("当前选中的要素列表-----", that.menuItemList);

          let minX = Math.min(latlngs[0][1], latlngs[1][1]);
          let maxX = Math.max(latlngs[0][1], latlngs[1][1]);
          let minY = Math.min(latlngs[0][0], latlngs[1][0]);
          let maxY = Math.max(latlngs[0][0], latlngs[1][0]);
          console.log(minX, maxX, minY, maxY);
          let menuItem = that.menuItemList[that.menuItemList.length - 1];
          let index = menuItem.parseIntLevel.findIndex((item) => {
            return item == menuItem.currentLevel;
          });
          let level = menuItem.level[index];
          //获取区域信息
          that
            .$get("api/numerical-forecast/regionalSummary", {
              day: that.nowtime.substring(0, 10), //日期
              time: that.nowtime.substring(11, 13), //时间
              type: menuItem.id, //要素id
              level: level, //当前选中的层级
              minX: minX,
              minY: minY,
              maxX: maxX,
              maxY: maxY,
            })
            .then((res) => {
              console.log(res.data.data);
              let obj = res.data.data;
              let content;
              if (menuItem.name == "温度" || menuItem.name == "2米温度") {
                content = `<p>名称: ${menuItem.name}</p>
                  <p>层级: ${menuItem.currentLevel}</p>
                  <p>时间: ${that.nowtime}</p>
                  <p>西: ${minX.toFixed(3)}</p>
                  <p>南: ${minY.toFixed(3)}</p>
                  <p>东: ${maxX.toFixed(3)}</p>
                  <p>北: ${maxY.toFixed(3)}</p>
                  <p>最小值: ${(obj.min - 273.15).toFixed(3)}</p>
                  <p>最大值: ${(obj.max - 273.15).toFixed(3)}</p>
                  <p>平均值: ${(obj.average - 273.15).toFixed(3)}</p>`;
              } else {
                content = `<p>名称: ${menuItem.name}</p>
                  <p>层级: ${menuItem.currentLevel}</p>
                  <p>时间: ${that.nowtime}</p>
                  <p>西: ${minX.toFixed(3)}</p>
                  <p>南: ${minY.toFixed(3)}</p>
                  <p>东: ${maxX.toFixed(3)}</p>
                  <p>北: ${maxY.toFixed(3)}</p>
                  <p>最小值: ${obj.min.toFixed(3)}</p>
                  <p>最大值: ${obj.max.toFixed(3)}</p>
                  <p>平均值: ${obj.average.toFixed(3)}</p>`;
              }

              that.rectangle = L.rectangle(latlngs, {
                color: "#1E90FF",
                fillOpacity: 0.2,
                weight: 2,
              })
                .addTo(map)
                .bindPopup(content);
              that.rectangle.openPopup();
              // map.off("click")
              map.off("contextmenu");
            });
        }
      } else {
        //清除矩形区域
        map.removeLayer(that.rectangle);
        //清除事件
        map.off("click", onclick);
      }
    },
    getPointValue() {
      let that = this;
      this.flagObj.getPointValueflag = !this.flagObj.getPointValueflag;
      if (this.flagObj.getPointValueflag) {
        this.resetflag("getPointValueflag");
        // this.clear()
        this.clearEvent();
        map.on(
          "click",
          (window.mapClick_p = function(e) {
            console.log(e, "点击地图---------------");
            console.log(that.menuItemList, "侧边栏选择");
            let level = "";
            let type = "";
            that.menuItemList.forEach((item) => {
              let index = item.parseIntLevel.findIndex((item1) => {
                return item1 == item.currentLevel;
              });
              let clevel = item.level[index];
              level += clevel + ",";
              type += item.id + ",";
            });
            console.log(
              level.substring(0, level.length - 1),
              type.substring(0, type.length - 1)
            );
            that
              .$get("api/numerical-forecast/summary-info", {
                day: that.nowtime.substring(0, 10), //日期
                time: that.nowtime.substring(11, 13), //时间
                type: type.substring(0, type.length - 1), //要素id
                level: level.substring(0, level.length - 1), //当前选中的层级
                lon: e.latlng.lng,
                lat: e.latlng.lat,
              })
              .then((res) => {
                let dataArr = res.data.data;
                let infoData = [
                  {
                    name: "时间",
                    value: that.nowtime,
                  },
                  {
                    name: "经度",
                    value: Number(e.latlng.lng).toFixed(3),
                  },
                  {
                    name: "纬度",
                    value: Number(e.latlng.lat).toFixed(3),
                  },
                ];
                dataArr.forEach((item) => {
                  if (item.name == "温度" || item.name == "2米温度") {
                    infoData.push({
                      name: item.name,
                      value: (item.value1 - 273.15).toFixed(3),
                    });
                  } else {
                    infoData.push({
                      name: item.name,
                      value: item.value1,
                    });
                  }
                });
                console.log(infoData, "单点数据信息--------");
                that.setInfoData(infoData);
                that.setInfoLocation(e.containerPoint);
                that.setInfoShow(true);
                let marker = e;
                map.on("move", (e) => {
                  let p = map.latLngToContainerPoint(
                    L.latLng(marker.latlng.lat, marker.latlng.lng)
                  );
                  console.log(p);
                  that.setInfoLocation(p);
                });
              });
          })
        );
      } else {
        //关闭事件，关闭弹框
        map.off("click", window.mapClick_p);
        this.setInfoShow(false);
      }
    },
    // 距离量算
    measure() {
      this.flagObj.measureflag = !this.flagObj.measureflag;
      if (this.flagObj.measureflag) {
        this.getViewer();
        this.resetflag("measureflag");
        window.tool.clearAreaMeasure();
        // this.clear()
        window.tool.measure();
      } else {
        window.tool.clearTool();
      }
    },

    // 面积量算
    measurearea() {
      this.flagObj.measureareaflag = !this.flagObj.measureareaflag;
      if (this.flagObj.measureareaflag) {
        this.getViewer();
        this.resetflag("measureareaflag");
        window.tool.clearMeasure();
        // this.clear()
        window.tool.measurearea();
      } else {
        window.tool.clearTool();
      }
    },
    graticule() {
      this.flagObj.graticuleflag = !this.flagObj.graticuleflag;
      if (this.flagObj.graticuleflag) {
        this.getViewer();
        this.loadGraticule();
        // if (this.latlngGraticuleLayer) {
        //   this.latlngGraticuleLayer.remove();
        //   this.latlngGraticuleLayer = null;
        // } else {
        //   this.loadGraticule();
        // }
      } else {
        this.latlngGraticuleLayer.remove();
        this.latlngGraticuleLayer = null;
      }
    },

    screenShot() {
      // this.flagObj.screenShotflag = !this.flagObj.screenShotflag;
      document.getElementById("screenShot").style.background = "#981a00";
      drawRect("backCanvas");
    },


    // 清除要素
    clear() {
      // //清除区域取值的矩形区域和点击事件
      // if (this.rectangle) {
      //   map.removeLayer(this.rectangle);
      //   map.off("click", onclick);
      // }
      // //清除单点取值的点击事件
      // map.off("click", window.mapClick_p);
      // this.setInfoShow(false);

      // // window.tool.clearTool();
      // this.getViewer()
      // //清除测量距离
      // window.tool.clearMeasure()
      // //清除测量面积
      // window.tool.clearAreaMeasure()
      this.clearEvent();
      this.resetflag("");
      //关闭经纬度
      this.flagObj.graticuleflag = false;
      this.latlngGraticuleLayer.remove();
      this.latlngGraticuleLayer = null;
      //关闭定位
      this.closeLocation();
      //清除图层切换
      this.setTileLayer(false);
    },
    clearEvent() {
      //清除区域取值的矩形区域和点击事件
      if (this.rectangle) {
        map.removeLayer(this.rectangle);
        map.off("click", onclick);
      }
      //清除单点取值的点击事件
      map.off("click", window.mapClick_p);
      this.setInfoShow(false);

      // window.tool.clearTool();
      this.getViewer();
      //清除测量距离
      window.tool.clearMeasure();
      //清除测量面积
      window.tool.clearAreaMeasure();
    },
    //将选中的其余状态置为false
    resetflag(flagName) {
      for (let key in this.flagObj) {
        if (key != flagName && key != "graticuleflag") {
          this.flagObj[key] = false;
        }
      }
    },
    // 经纬线
    loadGraticule() {
      this.latlngGraticuleLayer = L.latlngGraticule({
        showLabel: true,
        dashArray: [4, 4],
        fontColor: "#999999",
        zoomInterval: this.graticule_zoom,
      }).addTo(window.map);
    },
    // 定位窗口
    locationDialog() {
      // flag==false 清除数据
      this.flagObj.locationflag = !this.flagObj.locationflag;
      if (this.flagObj.locationflag) {
        this.locationShow = true;
      } else {
        this.closeLocation();
      }
    },
    closeLocation() {
      this.lat1 = null;
      this.lat2 = null;
      this.lon1 = null;
      this.lon2 = null;
      this.latflag = true;
      this.lonflag = false;
      if (this.locationPoint) {
        window.map.removeLayer(this.locationPoint);
      }
      this.locationShow = false;
    },
    // 定位方法
    checkLocation() {
      if (this.locationPoint) {
        window.map.removeLayer(this.locationPoint);
      }
      // latflag --- N(true) S(false)   lonflag --- W(false) E(true)
      let lat = this.changeToDu(this.lat1, this.lat2);
      let lon = this.changeToDu(this.lon1, this.lon2);
      if (!this.latflag && !this.lonflag) {
        // S W
        this.locationPoint = L.circleMarker([0 - lat, 0 - lon], {
          weight: 5,
          opacity: 0.7,
          color: "#981a00",
          radius: 7,
          fillColor: "#fff",
          fillOpacity: 0.9,
        }).addTo(map);
        window.map.flyTo(L.latLng(0 - lat, 0 - lon));
      } else if (!this.latflag) {
        // S E
        this.locationPoint = L.circleMarker([0 - lat, lon], {
          weight: 5,
          opacity: 0.7,
          color: "#981a00",
          radius: 7,
          fillColor: "#fff",
          fillOpacity: 0.9,
        }).addTo(map);
        window.map.flyTo(L.latLng(0 - lat, lon));
      } else if (!this.lonflag) {
        // N W
        window.map.flyTo(L.latLng(lat, 0 - lon));
        this.locationPoint = L.circleMarker([lat, 0 - lon], {
          weight: 5,
          opacity: 0.7,
          color: "#981a00",
          radius: 7,
          fillColor: "#fff",
          fillOpacity: 0.9,
        }).addTo(map);
      } else {
        // N E
        window.map.flyTo(L.latLng(lat, lon));
        this.locationPoint = L.circleMarker([lat, lon], {
          weight: 5,
          opacity: 0.7,
          color: "#981a00",
          radius: 7,
          fillColor: "#fff",
          fillOpacity: 0.9,
        }).addTo(map);
      }
    },
    changeToDu(latLng1, latLng2) {
      let d = latLng1;
      let f = latLng2 || 0;
      let du = parseFloat(f / 60) + parseFloat(d);
      return du;
    },
    // 切换NS、WE
    changeLatLng(num, flag) {
      if (num === 1) {
        this.latflag = flag;
      } else if (num === 2) {
        this.lonflag = flag;
      }
    },
    // 切换底图
    changeTileLayer() {
      this.flagObj.tileflag = !this.flagObj.tileflag;
      if (this.flagObj.tileflag) {
        this.setTileLayer(true);
      } else {
        this.setTileLayer(false);
      }
      // this.setTileLayer(!this.tileLayer);
    },
  },
};
</script>
<style scoped lang="scss">
#toolBar {
  z-index: 9999;
}
.right-top-container {
  position: absolute;
  right: 28px;
  top: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 6px;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.6);

  .tool_item:hover {
    background: #971a00;
  }

  .bg {
    background: #981a00;
  }

  .tool_item {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    text-align: center;
    padding-top: 1px;
    cursor: pointer;

    // }
  }

  .tool_right {
    // width: 30px;
    // height: 29px;
    // line-height: 29px;
    margin-left: 6px;
    img {
      width: 22px;
      vertical-align: middle;
    }
  }

  // zoom 样式独立
  .zoom {
    img {
      width: 70%;
      vertical-align: middle;
    }
  }

  // 定位框
  .location_dialog {
    position: fixed;
    width: 340px;
    height: 200px;
    right: 180px;
    bottom: 200px;
    border-radius: 8px;
    background: rgba(76, 75, 70, 0.7);
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    &:hover {
      background: rgba(76, 75, 70, 0.7);
    }

    .location_top {
      flex: 1;
      width: 100%;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      color: #fff;
      background: rgba(163, 163, 163, 0.7);
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        width: 20px;
        height: 20px;
      }

      .top_left {
        margin-left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin-left: 5px;
        }
      }

      .top_right {
        margin-right: 8px;

        img {
          width: 16px;
          height: 16px;
        }

        &:hover {
          cursor: pointer;
        }
      }
    }

    .location_content {
      flex: 5;
      width: 100%;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      .content_top {
        flex: 3;
        width: 90%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        color: #fff;

        input {
          width: 45px;
          height: 30px;
          background: #100f0f;
          border-radius: 4px;
          opacity: 0.7;
          border: none;
          color: #fff;
          outline: none;
          text-align: center;
        }

        .content_lat {
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .lat {
            display: flex;
            justify-content: center;
            align-items: center;
            // border: 1px solid #FFBCBC;
            border-radius: 8px;

            div {
              width: 30px;
              height: 30px;
              line-height: 30px;
              text-align: center;

              &:hover {
                cursor: pointer;
              }
            }

            .lat_n {
              border: 1px solid #ffbcbc;
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
            .lat_s {
              border: 1px solid #ffbcbc;
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }

            .lat_active {
              border: none;
              background: rgba(132, 13, 2, 0.9);
            }
          }
        }

        .content_lon {
          width: 100%;
          margin-top: 15px;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .lon {
            display: flex;
            justify-content: center;
            align-items: center;
            // border: 1px solid #FFBCBC;
            border-radius: 8px;

            div {
              width: 30px;
              height: 30px;
              line-height: 30px;
              text-align: center;

              &:hover {
                cursor: pointer;
              }
            }

            .lon_w {
              border: 1px solid #ffbcbc;
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
            .lon_e {
              border: 1px solid #ffbcbc;
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }

            .lon_active {
              border: none;
              background: rgba(132, 13, 2, 0.9);
            }
          }
        }
      }

      .content_bottom {
        flex: 1;
        width: 50%;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        color: #ffbcbc;

        div {
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #ffbcbc;
          border-radius: 5px;

          &:hover {
            cursor: pointer;
          }
        }

        .btn_active {
          // background: rgba(152, 26, 0, 0.7);
          background: rgba(132, 13, 2, 0.9);
          border: none;
        }
      }
    }
  }
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 4px;
  background-color: rgba(0, 0, 0, 0.5);
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(240, 240, 240, 0.6);
}
</style>
<style lang="scss">
#backCanvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  border: 2px solid #ff9c00;
}
</style>
