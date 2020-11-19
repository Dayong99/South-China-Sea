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

var tileLayer1 = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

var tileLayer2 = 'http://192.168.1.152:8081/num/getOffLine?name={z}/{y}/{x}.png'



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
    initMap() {
      // 底图切换
      window.map = L.map('mapContainer', {
        attributionControl: false,
        crs: L.CRS.EPSG4326,
        minZoom: 2,
        maxZoom: 13,
        // zoom: 4,
        // center: [30.2, 119.7],
        worldCopyJump: true,
        zoomControl: false,
      });
      // this.createTileLayer(tileLayer1, {})
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
    changeZoom() {
      window.map.on('zoomend', ev => {
        console.log('zoomend', window.map.getZoom())
        console.log(ev)
      })
    },
    changeMove() {
      window.map.on('moveend', ev => {
        console.log('moveend', window.map.getZoom())
        console.log(ev)
      })
    },
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
