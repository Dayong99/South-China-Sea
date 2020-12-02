<template>
  <!-- eslint-disable -->
  <div id="markBox" v-show="markShow" ref="markBox">
    <div class="shapes">
      <img
        :class="{ active: toolClicked === index }"
        @click="tool(item, index)"
        v-for="(item, index) in markToolsList"
        :src="item.src"
        :key="index + 'tools'"
      />
      <img
        :class="{ active: controlClicked === index }"
        @click="control(item, index)"
        v-for="(item, index) in controlList"
        :src="item.src"
        :key="index + 'control'"
      />
    </div>
    <div class="styles">
      <ul>
        <li
          v-for="(item, index) in sizeList"
          :key="index + 'size'"
          @click="size(item, index)"
        >
          <span
            :class="[item.class, sizeClicked === index ? 'active_round' : '']"
          ></span>
        </li>
        <li
          v-for="(item, index) in colorList"
          :key="index + 'color'"
          @click="color(item, index)"
        >
          <span
            class="color_box"
            :style="{ background: item.color }"
            :class="{ active_color: colorClicked === index }"
          ></span>
        </li>
        <li>
          <el-color-picker
            v-model="bindColor"
            size="mini"
            color-format="rgb"
          ></el-color-picker>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";
import "@/styles/markBox.scss";
export default {
  props: ["markShow"],
  data() {
    return {
      toolClicked: -1,
      sizeClicked: 0,
      colorClicked: 0,
      controlClicked: -1,
      bindColor: "rgb(20, 41, 62)",
      options: {
        type: null,
        color: "rgb(25,186,0,1)",
        width: 1.5,
        id: "002",
      },
      drawData: {
        data: [],
        type: "",
        color: "",
        width: "",
      },
      drawDataArr: [],
      status: true, // 0 绘制 1 读写

      tip: '暂无备注',
      controlPanel: true,
      tipPanel: false,
      markerShow: true,
      record: null,
      selectChange: 'allTypes',
      searchContent: null,
      markerAdd: null,
      tipLocation: null,
      allMarkerData: [],
      showMarkerData: [],

    };
  },
  computed: {
    ...mapState({
      markToolsList: (s) => s.tool.markToolsList,
      controlList: (s) => s.tool.controlList,
      colorList: (s) => s.tool.colorList,
      sizeList: (s) => s.tool.sizeList,
      echoId: (s) => s.tool.echoId,
    }),
  },
  watch: {
    bindColor: {
      handler: function (val) {
        this.options.color = val;
      },
      deep: true,
    },
    drawData: {
      handler: function (val) {
        this.$getArr(`/radar/radar-mark/RadarMarkList`, {
          caseId: JSON.parse(localStorage.getItem("activeCase")).id,
          echoId: this.echoId,
        })
          .then((res) => {
            if (res.data.data.length) {
              this.drawDataArr = res.data.data;
            }
          })
          .then(() => {
            this.pushDrawData(val);
          });
      },
      deep: true,
    },
    options: {
      handler: function (val) {
        console.log(val);
        this.markTools(
          window.makeEarth,
          this.options.type,
          this.options,
          status
        );
      },
      deep: true,
    },
    drawDataArr: {
      handler: function (val) {},
      deep: true,
    },
    markShow(val) {},
  },
  mounted() {
    console.log(111);
  },
  methods: {
    control(item, index) {
      // this.controlClicked = index;
      // this.toolClicked = -1;
      // item.events === "close"
      //   ? this.$store.commit("tool/setMarkShow", false)
      //   : "";
      // item.events === "yes" ? console.log("确定") : "";

      this.$emit("closeDraw");
      //  this.$refs.markBox.style.right = "75px";
      //   this.$refs.markBox.style.top = "180px";
    },
    tool(item, index) {
      this.toolClicked = index;
      this.options.type = item.type;
    },
    size(item, index) {
      this.sizeClicked = index;
      index = 0 ? (this.options.width = 1) : "";
      index = 1 ? (this.options.width = 2) : "";
      index = 2 ? (this.options.width = 3) : "";
    },
    color(item, index) {
      this.colorClicked = index;
      this.options.color = item.color;
    },

    markTools(viewer, type, options, status) {
      if (!status) {
      }
      function createPoint(worldPosition) {}

      function drawShape(positionData) {
        var shape;
        var point;
        if (drawingMode === "line") {
        } else if (drawingMode === "polygon") {
        } else if (drawingMode === "circle") {
        } else if (drawingMode === "rectangle") {
        }
        return [shape, point];
      }

      function terminateShape() {
        viewer.entities.remove(floatingPoint);
        activeShape.forEach((e, i) => {
          viewer.entities.remove(e);
        });
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
        handler.destroy();
        handler = null;
      }
    },

    // 添加线符号
    lineMarker(e) {
      this.cancleMarkerListener();

      this.poly_points = [];
      this.poly_line = new L.Polyline([], {
        color: "#237CC9",
        // opacity:0.6,
        weight: 2,
      }); // 折线
      this.dashLine = new L.Polyline([], {
        color: "#237CC9",
        // opacity:0.6,
        dashArray: [10, 10],
        weight: 2,
      });

      this.clickFunction = this.addLineLatlng;
      this.map.on("click", this.clickFunction, this);

      this.dblclickFunction = this.addLineMarker;
      this.map.on("dblclick", this.dblclickFunction, this);

      this.moveFunction = this.addDashLine;
      this.map.on("mousemove", this.moveFunction, this);

      this.rightClickFunction = this.cancleMarkerListener;
      this.map.on("contextmenu", this.rightClickFunction, this);

      e.stopPropagation();
    },
     // 添加线绘制点
    addLineLatlng (e) {
      this.poly_points.push([e.latlng.lat, e.latlng.lng])
    },
    // 添加线绘制结束点
    addLineMarker (e) {
      this.cancleMarkerListener()
      this.map.removeLayer(this.dashLine)
      if (this.poly_points.length > 2) {
        this.poly_line.setLatLngs(this.poly_points).addTo(this.markersLayer)
        return this.addTip(this.poly_line, this.poly_points[this.poly_points.length - 1])
      }
    },
    // 在绘制线鼠标移动时显示虚线效果
    addDashLine (e) {
      this.map.getContainer().style.cursor = 'pointer'
      this.moveIcon.addTo(this.currentMarkerGroup)
      if (this.poly_points.length > 0) {
        this.dashLine.setLatLngs(this.poly_points)
        this.dashLine.addLatLng([e.latlng.lat, e.latlng.lng]).addTo(this.currentMarkerGroup)
        this.moveIcon.setIcon(L.divIcon({ html: "<div class='leaflet-marker-markerTooltip'>双击添加备注</div>", className: 'leaflet-marker-noDefaultDivIcon' }))
      } else {
        this.moveIcon.setIcon(L.divIcon({ html: "<div class='leaflet-marker-markerTooltip'>点击开始绘制，双击结束</div>", className: 'leaflet-marker-noDefaultDivIcon' }))
      }
      this.moveIcon.setLatLng(e.latlng)
      this.moveIcon.setZIndexOffset(this.marker_zindex + 20)
    },
     // 添加备注信息时备注框确定按钮
    tipOk () {
      this.tipPanel = false
      // 判读是新建符号，还是修改符号
      if (this.markerAdd._popup) {
        this.bindPopupToMarker(this.markerAdd, this.tip, this.tipLocation)
        this.record.remark = this.tip
        this.record.marker.openPopup()
      } else {
        this.bindPopupToMarker(this.markerAdd, this.tip, this.tipLocation)
 
        var newMarkerData = {}
        newMarkerData.geometry = JSON.stringify(this.markerAdd.toGeoJSON().geometry)
        newMarkerData.geometryObject = this.markerAdd.toGeoJSON().geometry
        newMarkerData.marker = this.markerAdd
        newMarkerData.projectNo = this.uuid()
        newMarkerData.remark = this.tip
        if (this.tipLocation) {
          // 把点对象转化为字符串---存数据库
          // newMarkerData.tipLocation = this.tipLocation.toString()
          newMarkerData.tipLocation = this.tipLocation
        }
        this.allMarkerData.push(newMarkerData)
        this.showMarkerData.push(newMarkerData)
      }
    },
    // 备注框取消按钮
    tipCancel () {
      // 判断是新增取消还是新增取消
      if (!this.markerAdd._popup) {
        this.markerAdd.removeFrom(this.markersLayer)
      }
      this.tipPanel = false
    },
    // 绑定弹出标记---弹出框
    bindPopupToMarker (theMarker, theTip, tipLocation) {
      if (tipLocation != null) {
        theMarker.bindPopup(theTip, {
          autoPan: false,
          autoClose: false,
          className: 'leaflet-marker-markerTip',
          keepInView: false
        }).openPopup(L.latLng(tipLocation[0], tipLocation[1]))
        // 使备注显示在线或面的结束点位置
        // theMarker.off('click')
        // theMarker.on('click', function () {
        //   theMarker.openPopup(L.latLng(tipLocation[0], tipLocation[1]))
        // })
      } else {
        theMarker.bindPopup(theTip, {
          autoClose: false,
          className: 'leaflet-marker-markerTip'
        }).openPopup()
      }},

// 取消标记侦听器
    cancleMarkerListener () {
      if (this.clickFunction) {
        this.map.off('click', this.clickFunction, this)
      }
      if (this.dblclickFunction) {
        this.map.off('dblclick', this.dblclickFunction, this)
      }
      if (this.moveFunction) {
        this.map.off('mousemove', this.moveFunction, this)
      }
      if (this.rightClickFunction) {
        this.map.off('contextmenu', this.rightClickFunction, this)
      }
      if (this.map.hasLayer(this.currentMarkerGroup)) {
        this.currentMarkerGroup.clearLayers()
      }
    },

  },
  mounted() {},
};
</script>
