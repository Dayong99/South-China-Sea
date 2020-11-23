<template>
  <div>
    <div id="mapContainer" class="map" />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Tool from '@/utils/tool'
import eventBus from '@/utils/eventBus.js'
import { mapState, mapMutations } from 'vuex'
import "@/utils/leaflet.ChineseTmsProviders.js";

var tileLayer1 = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var tileLayer2 = 'http://192.168.1.152:8081/num/getOffLine?name={z}/{y}/{x}.png'
var tileLayer3 = globalConfig.baseURL + '/api/maps/GeoQ_colors/{z}/{y}/{x}'


var tileLayer1 = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

var tileLayer2 =
  "http://192.168.1.152:8081/num/getOffLine?name={z}/{y}/{x}.png";

export default {
  name: "Earth",
  components: {},
  data() {
    return {};
  },
  computed: {
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
      setExtent: 'earth/setExtent'
    }),
    initMap() {
      // 底图切换
      window.map = L.map("mapContainer", {
        attributionControl: false,
        crs: L.CRS.EPSG4326,
        minZoom: 2,
        maxZoom: 13,
        worldCopyJump: true,
        zoomControl: false,
      });
      this.createTileLayer(tileLayer2, {
        zoomOffset: 1,
      })
      // L.tileLayer
      //   .chinaProvider("Geoq.Normal.PurplishBlue", { maxZoom: 13, minZoom: 2 })
      //   .addTo(window.map);
      window.map.on('load', ev => {
        this.getExtent()
      })
      window.map.setView([35.09, 102.21], 4);
      this.changeZoom();
      this.changeMove();
    },
    createTileLayer(url, options) {
      let tileLayer = L.tileLayer(url, options);
      tileLayer.addTo(window.map);
    },
    // 层级发生变化
    changeZoom() {
      window.map.on('zoomend', ev => {
        this.getExtent()
      })
    },
    changeMove() {
      window.map.on('moveend', ev => {
        this.getExtent()
      })
    },
    // 获取范围
    getExtent() {
      let zoom = window.map.getZoom()
      console.log('zoom', zoom)
      let bounds = window.map.getBounds()
      // let min = bounds.getSouthWest()
      // let max = bounds.getNorthEast()
      // let extent = {
      //   xMin: null,
      //   xMax: null,
      //   yMin: min.lat,
      //   yMax: max.lat
      // }
      // if(Math.abs(max.lng - min.lng) >= 360) {
      //   extent.xMin = 0
      //   extent.xMax = 360
      // } else {
      //   extent.xMin = min.lng
      //   extent.xMax = max.lng
      //   extent.yMin = min.lat
      //   extent.yMax = max.lat
      // }

      let min = bounds.getSouthWest().wrap()
      let max = bounds.getNorthEast().wrap()
      let extent = {
        xMin: null,
        xMax: null,
        yMin: min.lat,
        yMax: max.lat
      }
      if(zoom <= 2) {
        extent.xMin = -180
        extent.xMax = 180
      } else {
        extent.xMin = min.lng
        extent.xMax = max.lng
      }
      console.log('min', min)
      console.log('max', max)
      
      this.setExtent(extent)
    }
  }
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
