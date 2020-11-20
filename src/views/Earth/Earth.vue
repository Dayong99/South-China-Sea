<template>
  <div>
    <div id="mapContainer" class="map" />
  </div>
</template>

<script>
import Line from '@/utils/isoline'
import { parseTime } from '@/utils'
import Tool from '@/utils/tool'
import eventBus from '@/utils/eventBus.js'
import { mapState, mapMutations } from 'vuex'

var tileLayer1 = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var tileLayer2 = 'http://192.168.1.152:8081/num/getOffLine?name={z}/{y}/{x}.png'
var tileLayer3 = globalConfig.baseURL + '/api/maps/GeoQ_colors/{z}/{y}/{x}'



export default {
  name: 'Earth',
  components: {
    
  },
  data() {
    return {
      
    }
  },
  computed: {
    nowtime() {
      return this.$store.state.time.time
    }
  },
  watch: {
    
  },
  created() {
    
  },
  destroyed() {
    window.map = null
  },
  mounted() {
    this.initMap()
  },
  methods: {
    ...mapMutations({
      setExtent: 'earth/setExtent'
    }),
    initMap() {
      // 底图切换
      window.map = L.map('mapContainer', {
        attributionControl: false,
        crs: L.CRS.EPSG4326,
        minZoom: 2,
        maxZoom: 13,
        worldCopyJump: true,
        zoomControl: false,
      });
      window.map.on('load', ev => {
        this.getExtent()
      })
      this.createTileLayer(tileLayer2, {
        zoomOffset: 1,
      })
      window.map.setView([35.09, 102.21], 4);
      this.changeZoom()
      this.changeMove()
    },
    async createTileLayer(url, options) {
      let tileLayer = await L.tileLayer(url, options)
      tileLayer.addTo(window.map)
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
      let bounds = window.map.getBounds()
      let extent = {
        xMin: bounds._southWest.lng,
        xMax: bounds._northEast.lng,
        yMin: bounds._southWest.lat,
        yMax: bounds._northEast.lat
      }
      this.setExtent(extent)
    }
  }
}
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
