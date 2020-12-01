<template>
  <div>
    <div id="mapContainer" class="map" />
  </div>
</template>

<script>
import { parseTime, debounce } from "@/utils";
// import { debounce } from '@/utils'
import Tool from "@/utils/tool";
import eventBus from "@/utils/eventBus.js";
import { mapState, mapMutations } from "vuex";
import "@/utils/leaflet.ChineseTmsProviders.js";

var tileLayer1 = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var tileLayer2 =
  "http://192.168.1.152:8081/num/getOffLine?name={z}/{y}/{x}.png";
var tileLayer3 = globalConfig.baseURL + "/api/maps/GeoQ_colors/{z}/{y}/{x}";

var tileLayer1 = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

var tileLayer2 =
  "http://192.168.1.152:8081/num/getOffLine?name={z}/{y}/{x}.png";

export default {
  name: "Earth",
  components: {},
  data() {
    return {
      // 定时器，1秒只响应一次
      timer: null,
    };
  },
  computed: {
    ...mapState({
      imageLayerNum: (state) => state.earth.imageLayerNum,
    }),
    nowtime() {
      return this.$store.state.time.time;
    },
  },
  watch: {},
  created() {},
  destroyed() {
    window.map = null;
  },
  mounted() {
    this.initMap();
  },
  methods: {
    ...mapMutations({
      setExtent: "earth/setExtent",
      setImageLayerNum: "earth/setImageLayerNum",
    }),
    initMap() {
      // 底图切换
      window.map = L.map("mapContainer", {
        attributionControl: false,
        // crs: L.CRS.EPSG3857,
        minZoom: 2,
        maxZoom: 13,
        worldCopyJump: true,
        zoomControl: false,
      });
      // this.createTileLayer(tileLayer2, {
      //   zoomOffset: 1,
      // })
      L.tileLayer
        .chinaProvider("Geoq.Normal.PurplishBlue", { maxZoom: 13, minZoom: 2 })
        .addTo(window.map);
      window.map.on("load", (ev) => {
        this.getExtent();
      });
      window.map.setView([35.09, 102.21], 4);
      // this.changeZoom();
      this.changeMove();
    },
    async createTileLayer(url, options) {
      let tileLayer = await L.tileLayer(url, options);
      tileLayer.addTo(window.map);
    },
    // 层级发生变化
    // changeZoom() {
    //   window.map.on('zoomend', ev => {
    //     if(this.timer) {
    //       clearTimeout(this.timer)
    //     }
    //     this.timer = setTimeout(() => {
    //       this.getExtent()
    //     }, 1000)
    //   })
    // },
    changeMove() {
      window.map.on("moveend", (ev) => {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          console.log(this.imageLayerNum);
          let num = this.imageLayerNum;
          this.setImageLayerNum(++num);
          this.getExtent();
        }, 1000);
      });
    },
    // 获取范围
    getExtent() {
      let zoom = window.map.getZoom();
      console.log("zoom", zoom);
      let bounds = window.map.getBounds();

      let min = bounds.getSouthWest().wrap();
      let max = bounds.getNorthEast().wrap();
      console.log("min", min);
      console.log("max", max);
      let xMin = min.lng;
      let xMax = max.lng;
      let yMin = min.lat;
      let yMax = max.lat;
      yMin = yMin <= -85 ? -85 : yMin;
      yMax = yMax >= 85 ? 85 : yMax;

      let extent = {
        xMin: null,
        xMax: null,
        yMin: yMin,
        yMax: yMax,
      };
      let extentList = [];
      let ex1 = {};
      let ex2 = {};
      let ex3 = {};

      // 转为 0-360 然后再根据要素本身范围进行范围修正 sideBar中
      // 层级3不加载全部
      /*if(zoom <= 2) {
        ex1 = {
          xMin: 180,
          xMax: 360,
          yMin: -85,
          yMax: 85
        }
        ex2 = {
          xMin: 0,
          xMax: 180,
          yMin: -85,
          yMax: 85
        }
        extentList.push(ex1)
        extentList.push(ex2)
      } else if(zoom == 3) {
        if(xMin < 0 && xMax < 0) {
          ex1 = {
            xMin: xMin + 360,
            xMax: 360,
            yMin: yMin,
            yMax: yMax
          }
          ex2 = {
            xMin: 0,
            xMax: 180,
            yMin: yMin,
            yMax: yMax
          }
          ex3 = {
            xMin: 180,
            xMax: xMax + 360,
            yMin: yMin,
            yMax: yMax
          }
          extentList.push(ex1)
          extentList.push(ex2)
          extentList.push(ex3)
        } else if(xMin > 0 && xMax > 0) {
          ex1 = {
            xMin: xMin,
            xMax: 180,
            yMin: yMin,
            yMax: yMax
          }
          ex2 = {
            xMin: 180,
            xMax: 360,
            yMin: yMin,
            yMax: yMax
          }
          ex3 = {
            xMin: 0,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax
          }
          extentList.push(ex1)
          extentList.push(ex2)
          extentList.push(ex3)
        }
      } else {
        if(xMin < 0 && xMax > 0) {
          ex1 = {
            xMin: xMin + 360,
            xMax: 360,
            yMin: yMin,
            yMax: yMax
          }
          ex2 = {
            xMin: 0,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax
          }
          extentList.push(ex1)
          extentList.push(ex2)
        } else if(xMin > 0 && xMax < 0) {
          ex1 = {
            xMin: xMin,
            xMax: 180,
            yMin: yMin,
            yMax: yMax
          }
          ex2 = {
            xMin: 180,
            xMax: xMax + 360,
            yMin: yMin,
            yMax: yMax
          }
          extentList.push(ex1)
          extentList.push(ex2)
        } else if(xMin <= 0 && xMax <= 0) {
          extent.xMin = xMin + 360
          extent.xMax = xMax + 360
          extentList.push(extent)
        } else {
          extent.xMin = xMin
          extent.xMax = xMax
          extentList.push(extent)
        }
      }
      console.log('extentList', extentList)
      this.setExtent(extentList)*/

      if (zoom <= 3) {
        ex1 = {
          xMin: 180,
          xMax: 360,
          yMin: -85,
          yMax: 85,
        };
        ex2 = {
          xMin: 0,
          xMax: 180,
          yMin: -85,
          yMax: 85,
        };
        extentList.push(ex1);
        extentList.push(ex2);
      } else {
        if (xMin < 0 && xMax > 0) {
          ex1 = {
            xMin: xMin + 360,
            xMax: 360,
            yMin: yMin,
            yMax: yMax,
          };
          ex2 = {
            xMin: 0,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax,
          };
          extentList.push(ex1);
          extentList.push(ex2);
        } else if (xMin > 0 && xMax < 0) {
          ex1 = {
            xMin: xMin,
            xMax: 180,
            yMin: yMin,
            yMax: yMax,
          };
          ex2 = {
            xMin: 180,
            xMax: xMax + 360,
            yMin: yMin,
            yMax: yMax,
          };
          extentList.push(ex1);
          extentList.push(ex2);
        } else if (xMin <= 0 && xMax <= 0) {
          extent.xMin = xMin + 360;
          extent.xMax = xMax + 360;
          extentList.push(extent);
        } else {
          extent.xMin = xMin;
          extent.xMax = xMax;
          extentList.push(extent);
        }
      }
      console.log("extentList", extentList);
      this.setExtent(extentList);
    },
  },
};
</script>
<style lang="scss" scoped>
html,
body,
#mapContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
<style>
</style>
