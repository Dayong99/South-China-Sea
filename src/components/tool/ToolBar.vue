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
import { mapState, mapMutations } from "vuex";
import toolBar from "@/utils/toolBar.js";
import "@/utils/leaflet.latlng-graticule.js";
export default {
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
    };
  },
  computed: {
    nowtime() {
      return this.$store.state.time.time;
    },
    ...mapState({
      menuItemList: (state) => state.sideBar.menuItemList,
    }),
  },
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
      map.off("click")
      window.tool.clearTool();
    },
    loadGraticule() {
      this.latlngGraticuleLayer = L.latlngGraticule({
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
