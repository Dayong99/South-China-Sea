
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
    <div class="tool_item tool_right">
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

export default {
  data() {
    return {};
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

    // 清除要素
    clear() {
      window.tool.clearTool();
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
