<template>
  <div class="right-top-container" id="toolBar">
    <div class="tool_item zoom" @click.stop="zoomIn">
      <el-tooltip class="item" effect="light" content="放大" placement="bottom">
        <img src="@/assets/toolList/add.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right zoom" @click.stop="zoomOut">
      <el-tooltip class="item" effect="light" content="缩小" placement="bottom">
        <img src="@/assets/toolList/minus.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="measure">
      <el-tooltip
        class="item"
        effect="light"
        content="距离量算"
        placement="bottom"
      >
        <img src="@/assets/toolList/ruler.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="measurearea">
      <el-tooltip
        class="item"
        effect="light"
        content="面积量算"
        placement="bottom"
      >
        <img src="@/assets/toolList/area.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="locationDialog(true)">
      <el-tooltip
        class="item"
        effect="light"
        content="坐标定位"
        placement="bottom"
      >
        <img src="@/assets/toolList/location.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="changeTileLayer">
      <el-tooltip class="item" effect="light" content="底图切换" placement="bottom">
        <img src="@/assets/images/toolbar/product.png">
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="graticule">
      <el-tooltip
        class="item"
        effect="light"
        content="经纬显示"
        placement="bottom"
      >
        <img src="@/assets/toolList/line.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="getValue">
      <el-tooltip
        class="item"
        effect="light"
        content="区域取值"
        placement="bottom"
      >
        <img src="@/assets/toolList/getValue.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="getPointValue">
      <el-tooltip
        class="item"
        effect="light"
        content="单点取值"
        placement="bottom"
      >
        <img src="@/assets/toolList/point.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="clear">
      <el-tooltip
        class="item"
        effect="light"
        content="清除要素"
        placement="bottom"
      >
        <img src="@/assets/toolList/clear.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right" @click.stop="draw">
      <el-tooltip
        class="item"
        effect="light"
        content="绘制图形"
        placement="bottom"
      >
        <img src="@/assets/toolList/draw.png" />
      </el-tooltip>
    </div>

    <!-- 经纬度坐标定位框 -->
    <div class="location_dialog" v-show="locationShow">
      <div class="location_top">
        <div class="top_left">
          <img src="@/assets/images/toolbar/location.png" />
          <span>坐标定位</span>
        </div>
        <div class="top_right" @click.stop="locationDialog(false)">
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
                :class="{ lon_w: true, lon_active: lonflag }"
                @click.stop="changeLatLng(2, true)"
              >
                W
              </div>
              <div
                :class="{ lon_e: true, lon_active: !lonflag }"
                @click.stop="changeLatLng(2, false)"
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
            @click.stop="locationDialog(false)"
          >
            取消
          </div>
        </div>
      </div>
    </div>

    <!-- 绘图工具 -->
    <mark-box :markShow="markShow" @closeDraw="closeDraw"></mark-box>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import toolBar from "@/utils/toolBar.js";
import "@/utils/leaflet.latlng-graticule.js";
import MarkBox from "./markBox"
export default {
  components:{
      MarkBox:MarkBox
  },
  data() {
    return {
      markShow:false,
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
      lonflag: true,
    };
  },
  computed: {
    nowtime() {
      return this.$store.state.time.time;
    },
    ...mapState({
      menuItemList: (state) => state.sideBar.menuItemList,
      tileLayer: state => state.earth.tileLayer
    }),
  },
  watch: {},
  mounted() {},
  methods: {
    ...mapMutations({
      setInfoData:"clickup/setInfoData",
      setInfoLocation:"clickup/setInfoLocation",
      setInfoShow:"clickup/setInfoShow",
      setTileLayer: 'earth/setTileLayer'
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
      console.log("动态绘制矩形区域");
      // let rectangle;
      let tmprec;
      let latlngs = [];
      let that = this;
      map.on("click", onClick); //点击地图

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
        //获取区域信息
        that
          .$get("api/numerical-forecast/regionalSummary", {
            day: that.nowtime.substring(0, 10), //日期
            time: that.nowtime.substring(11, 13), //时间
            type: menuItem.id, //要素id
            level: menuItem.currentLevel, //当前选中的层级
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
          })
          .then((res) => {
            console.log(res.data.data);
            let obj = res.data.data;
            const content = `<p>名称: ${menuItem.name}</p>
          <p>层级: ${menuItem.currentLevel}</p>
          <p>时间: ${that.nowtime}</p>
          <p>minX: ${minX.toFixed(3)}</p>
          <p>minY: ${minY.toFixed(3)}</p>
          <p>maxX: ${maxX.toFixed(3)}</p>
          <p>maxY: ${maxY.toFixed(3)}</p>
          <p>最小值: ${obj.min.toFixed(3)}</p>
          <p>最大值: ${obj.max.toFixed(3)}</p>
          <p>平均值: ${obj.average.toFixed(3)}</p>`;

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
    },
    getPointValue() {
      map.on("click", (e) => {
        console.log(e, "点击地图---------------");
        console.log(this.menuItemList, "侧边栏选择");
        let level = "";
        let type = "";
        this.menuItemList.forEach((item) => {
          level += item.currentLevel + ",";
          type += item.id + ",";
        });
        console.log(
          level.substring(0, level.length - 1),
          type.substring(0, type.length - 1)
        );
        this.$get("api/numerical-forecast/summary-info", {
          day: this.nowtime.substring(0, 10), //日期
          time: this.nowtime.substring(11, 13), //时间
          type: type.substring(0, type.length - 1), //要素id
          level: level.substring(0, level.length - 1), //当前选中的层级
          lon: e.latlng.lng,
          lat: e.latlng.lat,
        }).then((res) => {
          let dataArr = res.data.data;
          let infoData = [
            {
              name: "时间",
              value: this.nowtime,
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
            infoData.push({
              name: item.name,
              value: item.value1,
            });
          });
          console.log(infoData,"单点数据信息--------");
          this.setInfoData(infoData)
          this.setInfoLocation(e.containerPoint)
          this.setInfoShow(true)
        });
      });
    },
    // 距离量算
    measure() {
      this.getViewer();
      window.tool.measure();
    },

    // 面积量算
    measurearea() {
      this.getViewer();
      window.tool.measurearea();
    },
    graticule() {
      this.getViewer();
      if (this.latlngGraticuleLayer) {
        this.latlngGraticuleLayer.remove();
        this.latlngGraticuleLayer = null;
      } else {
        this.loadGraticule();
      }
    },
    // 清除要素
    clear() {
      map.removeLayer(this.rectangle);
      map.off("click");
      window.tool.clearTool();
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
    locationDialog(flag) {
      // flag==false 清除数据
      if (!flag) {
        this.lat1 = null;
        this.lat2 = null;
        this.lon1 = null;
        this.lon2 = null;
        this.latflag = true;
        this.lonflag = true;
      }
      this.locationShow = flag;
    },
    // 定位方法
    checkLocation() {
      let lat = this.changeToDu(this.lat1, this.lat2);
      let lon = this.changeToDu(this.lon1, this.lon2);
      if (!this.latflag && !this.lonflag) {
        window.map.flyTo(L.latLng(0 - lat, 0 - lon));
      } else if (!this.latflag) {
        window.map.flyTo(L.latLng(0 - lat, lon));
      } else if (!this.lonflag) {
        window.map.flyTo(L.latLng(lat, 0 - lon));
      } else {
        window.map.flyTo(L.latLng(lat, lon));
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
      this.setTileLayer(!this.tileLayer)
    },


    // 绘图
    draw(){
      this.markShow = true
    },
    closeDraw(){
      this.markShow = false;
    }
  },
};
</script>
<style scoped lang="scss">
#toolBar {
  z-index: 9999;
}
.right-top-container {
  position: absolute;
  right: 155px;
  top: 26px;
  display: flex;
  // flex-flow: column nowrap;
  align-items: center;
  padding: 2px 10px;
  border-radius: 15px;
  background: rgba(109, 109, 109, 0.7);

  .tool_item:hover {
    background: rgba(109, 109, 109, 0.9);
  }

  .tool_item {
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;

    // img {
    //   width: 90%;
    //   height: 90%;
    //   vertical-align: middle;
    // }
  }

  .tool_right {
    // width: 30px;
    // height: 29px;
    // line-height: 29px;
    margin-left: 5px;

    img {
      width: 80%;
      height: 80%;
      vertical-align: middle;
    }
  }

  // zoom 样式独立
  .zoom {
    img {
      width: 90%;
      height: 90%;
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
