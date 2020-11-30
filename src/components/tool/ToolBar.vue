
<template>
  <div class="right-top-container" id="toolBar">
    <div class="tool_item zoom" @click.stop="zoomIn">
      <el-tooltip class="item" effect="light" content="放大" placement="bottom">
        <img src="@/assets/toolList/add.png" />
      </el-tooltip>
    </div>
    <div class="tool_item tool_right zoom" @click.stop="measurearea">
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
    <!-- <div class="tool_item tool_right">
      <el-tooltip class="item" effect="light" content="坐标定位" placement="bottom">
        <img src="@/assets/toolList/location.png">
      </el-tooltip>
    </div> -->
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
  </div>
</template>
<script>
import toolBar from "@/utils/toolBar.js";
import "@/utils/leaflet.latlng-graticule.js";
export default {
  data() {
    return {
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
      latlngGraticuleLayer: null
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
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
      window.tool = new toolBar(window.earth, obj);
    },
    // 地图放大
    zoomIn() {
      window.map.zoomIn(1);
    },
    // 地图缩小
    zoomOut() {
      window.map.zoomOut(1);
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
      if(this.latlngGraticuleLayer) {
        this.latlngGraticuleLayer.remove()
        this.latlngGraticuleLayer = null
      } else {
        this.loadGraticule();
      }
    },
    // 清除要素
    clear() {
      window.tool.clearTool();
    },
    loadGraticule() {
      this.latlngGraticuleLayer =L.latlngGraticule({
        showLabel: true,
        dashArray: [4, 4],
        fontColor: "#999999",
        zoomInterval: this.graticule_zoom,
      }).addTo(window.map);
    },
  },
};
</script>
<style scoped lang="scss">
#toolBar {
  z-index: 999;
}
.right-top-container {
  position: absolute;
  right: 40px;
  top: 26px;
  display: flex;
  // flex-flow: column nowrap;
  align-items: center;
  padding: 2px 10px;
  border-radius: 15px;
  background: rgba(109, 109, 109, 0.7);

  div:hover {
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
