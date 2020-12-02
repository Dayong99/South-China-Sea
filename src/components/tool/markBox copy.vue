<template>
  <!-- eslint-disable -->
  <div id="markBox">
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
      markToolsList:[
        {
          src:require('../../assets/toolList/shape/line.png')
        },
        {
          src:require('../../assets/toolList/shape/rect.png')
        },
        {
          src:require('../../assets/toolList/shape/polygon.png')
        },
        {
          src:require('../../assets/toolList/shape/circle.png')
        },
        {
          src:require('../../assets/toolList/shape/close.png')
        },
      ]
    };
  },
  computed: {
    ...mapState({
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
        }).then(res => {
          if(res.data.data.length) {
            this.drawDataArr = res.data.data
          }
        }).then(() => {
          this.pushDrawData(val);
        })
          
        
      },
      deep: true,
    },
    options: {
      handler: function (val) {
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
  },
  mounted(){
    console.log(111)
  },
  methods: {
    pushDrawData(data) {
      this.$postArr(`/radar/radar-mark/add`, {
        caseId: JSON.parse(localStorage.getItem("activeCase")).id,
        echoId: this.echoId,
        markFigure: JSON.stringify(data),
        markTitle: "test",
        remark: "暂无",
      }).then((res) => {
        this.$store.commit("make/setMarkChanged", "");
      });
    },
    tool(item, index) {
      this.toolClicked = index;
      this.options.type = item.type;
    },
    control(item, index) {
      this.controlClicked = index;
      this.toolClicked = -1;
      item.events === "close"
        ? this.$store.commit("tool/setMarkShow", false)
        : "";
      item.events === "yes" ? console.log("确定") : "";
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
      const drawingMode = type;
      const camera = viewer.camera;
      const scene = viewer.scene;
      const that = this;
      let earthPosition = null;
      let handler = null;
      let activeShapePoints = [];
      let floatingPoint = [];
      let activeShape = [];
      let text = String(that.drawDataArr.length);
      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      if (!status) {
        handler.setInputAction(function (event) {
          const ray = camera.getPickRay(event.position);
          earthPosition = scene.globe.pick(ray, scene);
          if (Cesium.defined(earthPosition)) {
            if (activeShapePoints.length === 0) {
              floatingPoint = createPoint(earthPosition);
              activeShapePoints.push(earthPosition);
              var dynamicPositions = new Cesium.CallbackProperty(function () {
                if (drawingMode === "polygon") {
                  return new Cesium.PolygonHierarchy(activeShapePoints);
                }
                return activeShapePoints;
              }, false);
              activeShape = drawShape(dynamicPositions);
            }
            activeShapePoints.push(earthPosition);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (event) {
          if (Cesium.defined(floatingPoint)) {
            var newPosition = viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
              floatingPoint.position.setValue(newPosition);
              activeShapePoints.pop();
              activeShapePoints.push(newPosition);
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (event) {
          that.drawData.data = activeShapePoints;
          that.drawData.width = options.width;
          that.drawData.color = options.color;
          that.drawData.type = options.type;
          terminateShape();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      }
      function createPoint(worldPosition) {
        var point = viewer.entities.add({
          position: worldPosition,
          point: {
            color: Cesium.Color.WHITE,
            pixelSize: 5,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });
        return point;
      }

      function drawShape(positionData) {
        var shape;
        var point;
        if (drawingMode === "line") {
          shape = viewer.entities.add({
            polyline: {
              positions: positionData,
              clampToGround: true,
              width: options.width,
              material: Cesium.Color.fromCssColorString(options.color),
            },
          });
          point = viewer.entities.add({
            position: positionData[0],
            point: {
              pixelSize: 1,
              color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
            },
            label: {
              text: text,
              font: "15px Sans-Serif",
              fillColor: Cesium.Color.fromCssColorString(options.color),
              outlineColor: Cesium.Color.GOLD,
              style: Cesium.LabelStyle.CENTER_LABEL,
              verticalOrigin: Cesium.VerticalOrigin.BUTTON,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
              showBackground: true,
              scale: 0.8,
            },
          });
        } else if (drawingMode === "polygon") {
          shape = viewer.entities.add({
            polygon: {
              hierarchy: positionData,
              fill: false,
              outline: true,
              outlineColor: Cesium.Color.fromCssColorString(options.color),
              outlineWidth: options.width,
            },
          });
          point = viewer.entities.add({
            position: positionData[0],
            point: {
              pixelSize: 1,
              color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
            },
            label: {
              text: text,
              font: "15px Sans-Serif",
              fillColor: Cesium.Color.fromCssColorString(options.color),
              outlineColor: Cesium.Color.GOLD,
              style: Cesium.LabelStyle.CENTER_LABEL,
              verticalOrigin: Cesium.VerticalOrigin.BUTTON,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
              showBackground: true,
              scale: 0.8,
            },
          });
        } else if (drawingMode === "circle") {
          var value =
            typeof positionData.getValue === "function"
              ? positionData.getValue(0)
              : positionData;
          shape = viewer.entities.add({
            position: activeShapePoints[0],
            name:
              "Blue translucent, rotated, and extruded ellipse with outline",
            type: "Selection tool",
            ellipse: {
              semiMinorAxis: new Cesium.CallbackProperty(function () {
                var r =
                  2.05 *
                  Math.sqrt(
                    Math.pow(value[0].x - value[value.length - 1].x, 2) +
                      Math.pow(value[0].y - value[value.length - 1].y, 2)
                  );
                return r ? r : r + 1;
              }, false),
              semiMajorAxis: new Cesium.CallbackProperty(function () {
                var r =
                  2.05 *
                  Math.sqrt(
                    Math.pow(value[0].x - value[value.length - 1].x, 2) +
                      Math.pow(value[0].y - value[value.length - 1].y, 2)
                  );
                return r ? r : r + 1;
              }, false),
              fill: false,
              outline: true,
              outlineColor: Cesium.Color.fromCssColorString(options.color),
              outlineWidth: options.width,
            },
          });
          point = viewer.entities.add({
            position: positionData[0],
            point: {
              pixelSize: 1,
              color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
            },
            label: {
              text: text,
              font: "15px Sans-Serif",
              fillColor: Cesium.Color.fromCssColorString(options.color),
              outlineColor: Cesium.Color.GOLD,
              style: Cesium.LabelStyle.CENTER_LABEL,
              verticalOrigin: Cesium.VerticalOrigin.BUTTON,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
              showBackground: true,
              scale: 0.8,
            },
          });
        } else if (drawingMode === "rectangle") {
          var arr =
            typeof positionData.getValue === "function"
              ? positionData.getValue(0)
              : positionData;
          shape = viewer.entities.add({
            name:
              "Blue translucent, rotated, and extruded ellipse with outline",
            rectangle: {
              coordinates: new Cesium.CallbackProperty(function () {
                var obj = Cesium.Rectangle.fromCartesianArray(arr);
                return obj;
              }, false),
              fill: false,
              outline: true,
              outlineColor: Cesium.Color.fromCssColorString(options.color),
              outlineWidth: options.width,
            },
          });
          point = viewer.entities.add({
            position: positionData[0],
            point: {
              pixelSize: 1,
              color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
            },
            label: {
              text: text,
              font: "15px Sans-Serif",
              fillColor: Cesium.Color.fromCssColorString(options.color),
              outlineColor: Cesium.Color.GOLD,
              style: Cesium.LabelStyle.CENTER_LABEL,
              verticalOrigin: Cesium.VerticalOrigin.BUTTON,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              backgroundColor: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
              showBackground: true,
              scale: 0.8,
            },
          });
        }
        return [shape, point];
      }

      function terminateShape() {
        viewer.entities.remove(floatingPoint);
        activeShape.forEach((e,i)=> {
          viewer.entities.remove(e);
        })
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
        handler.destroy();
        handler = null;
      }
    },
  },
  mounted() {},
};
</script>
