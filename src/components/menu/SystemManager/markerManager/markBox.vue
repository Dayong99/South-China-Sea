<template>
  <!-- eslint-disable -->
  <div>
    <div id="markBox" v-show="markShow" ref="markBox">
      <div class="shapes">
        <button
          class="btn"
          v-for="(item, index) in markToolsList"
          :key="index + 'tools'"
          :disabled="disabled"
          @click="tool(item, index)"
        >
          <!-- <img :class="{ active: toolClicked === index }" :src="item.src" /> -->
          <img :class="{ active: toolClicked === index }" :src="item.src" />
        </button>

        <button
          class="btn"
          v-for="(item, index) in controlList"
          :key="index + 'control'"
          @click="control()"
        >
          <img :class="{ active: controlClicked === index }" :src="item.src" />
        </button>
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

    <!-- 备注信息 -->
    <div class="add-tip" ref="tipModal" v-show="tipPanel">
      <div class="title">
        {{ formData.drawType == 1 ? "警戒线" : "任务区" }}
      </div>
      <!-- <el-input
        placeholder="请输入标志区名称"
        clearable
        v-model="formData.placeName"
      /> -->
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="70px"
        style="line-height: 100%"
      >
        <!-- 名称 -->

        <el-form-item label="名称" prop="placeName">
          <el-input
            placeholder="请输入名称"
            v-model="formData.placeName"
          ></el-input>
        </el-form-item>

        <!-- 经纬度 -->

        <el-form-item label="是否显示" prop="isShow">
          <el-radio v-model="formData.isShow" label="1">显示</el-radio>
          <el-radio v-model="formData.isShow" label="0">不显示</el-radio>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button class="ok" type="primary" plain @click="tipOk" size="mini"
          >确定</el-button
        >
        <el-button @click="tipCancel" size="mini">取消</el-button>
      </div>
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
      disabled: false,
      toolClicked: -1,
      sizeClicked: 0,
      colorClicked: 0,
      controlClicked: -1,
      bindColor: "rgb(20, 41, 62)",
      options: {
        type: null,
        color: "rgb(25,186,0,1)",
        width: 1.5,
      },
      drawData: {
        data: [],
        type: "",
        color: "",
        width: "",
      },
      drawDataArr: [],
      status: true, // 0 绘制 1 读写

      tip: "标志区名称",
      controlPanel: true,
      tipPanel: false,
      markerShow: true,
      record: null,
      markerAdd: null,
      tipLocation: null,
      allMarkerData: [],
      showMarkerData: [],

      //折线
      poly_line: null,
      dashLine:null,

      // 圆形
      circleCenter: null,
      radius: 0,
      poly_circle: null,
      poly_nowCircle: null,

      // 多边形
      poly_area: null,
      poly_now: null,

      // 矩形
      startPoint: null,
      endPoint: null,
      poly_rect: null,
      poly_nowRect: null,
      rectPoints: [],

      nowObj: null,

      formData: this.initForm(),

      rules: {
        placeName: {
          required: true,
          message: "名称不能为空",
          trigger: "blur",
        },
      },
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
        if (val.type) {
          this.markTools(val);
        }
      },
      deep: true,
    },

    markShow(val) {
      if (val) {
        this.resetMarker();
        this.resetToolBar();
        this.cancleMarkerListener();

        this.options = {
          type: null,
          color: "rgb(25,186,0,1)",
          width: 1.5,
        };

        this.nowObj = null;
      }
    },
    tipPanel(val) {
      this.formData.placeName = "";
      this.formData.isShow = "1";
      this.$refs["form"].clearValidate();
    },
  },
  created() {},
  mounted() {},
  methods: {
    initForm() {
      return {
        placeName: "",
        isShow: "1",
        longitude: "",
        latitude: "",
        coordinates: null,
        drawType: null,
        other1: null,
        other2: null,
      };
    },
    // 重置绘图工具栏
    resetToolBar() {
      this.toolClicked = -1;
      this.sizeClicked = 0;
      this.colorClicked = 0;
      this.controlClicked = -1;
      this.disabled = false;
      this.bindColor = "rgb(20, 41, 62)";
    },
    // 重置标志信息框
    resetTipPanel() {
      if (map.hasLayer(this.nowObj)) {
        map.removeLayer(this.nowObj);
      }
      if (Number(this.formData.isShow) == 0) {
        map.removeLayer(this.nowObj);
      }
      this.tipPanel = false;
      this.initForm();
    },
    // 重置绘图符号属性
    resetMarker() {
      this.cancleMarkerListener();
      map.dragging.enabled();

      // 初始化一些符号属性
      this.markersLayer = L.geoJSON([], {
        style: function (feature) {
          return {
            color: "#237CC9",
            weight: 2,
            fillColor: "#237CC9",
            fillOpacity: 0.2,
          };
        },
      }).addTo(map);
      this.currentMarkerGroup = L.layerGroup([]).addTo(map);
      this.marker_zindex = 2000;
      this.moveMarker = L.marker([0, 0], {
        zIndexOffset: this.marker_zindex,
      });
      this.moveIcon = L.marker([0, 0], {
        zIndexOffset: this.marker_zindex,
      });
    },
    // 删除所有绘图
    clearAllLayer(){
      if(map.hasLayer(this.poly_line)){
        map.removeLayer(this.poly_line)
      }
      if(map.hasLayer(this.dashLine)){
        map.removeLayer(this.dashLine)
      }
      if(map.hasLayer(this.poly_circle)){
        map.removeLayer(this.poly_circle)
      }
      if(map.hasLayer(this.poly_nowCircle)){
        map.removeLayer(this.poly_nowCircle)
      }
      if(map.hasLayer(this.poly_area)){
        map.removeLayer(this.poly_area)
      }
      if(map.hasLayer(this.poly_now)){
        map.removeLayer(this.poly_now)
      }
      if(map.hasLayer(this.poly_rect)){
        map.removeLayer(this.poly_rect)
      }
      if(map.hasLayer(this.poly_nowRect)){
        map.removeLayer(this.poly_nowRect)
      }
    },
    // 退出绘画
    control(item, index) {
      this.cancleMarkerListener();
      if (this.disabled) {
        this.$message("已退出当前绘画");
      }
      this.resetToolBar();
      this.resetTipPanel();
      this.clearAllLayer()
      this.options.type = null;
      // this.$emit("closeDraw");
    },
    // 绘画
    tool(item, index) {
      this.toolClicked = index;
      this.options.type = item.type;
    },
    // 粗细
    size(item, index) {
      this.sizeClicked = index;
      index = 0 ? (this.options.width = 1) : "";
      index = 1 ? (this.options.width = 2) : "";
      index = 2 ? (this.options.width = 3) : "";
    },
    // 颜色
    color(item, index) {
      this.colorClicked = index;
      this.options.color = item.color;
    },

    // 画图
    markTools(option) {
      if (option.type == "line") {
        this.lineMarker();
      } else if (option.type == "rectangle") {
        this.rectangleMarker();
      } else if (option.type == "polygon") {
        this.polygonMarker();
      } else if (option.type == "circle") {
        this.circleMarker();
      }
    },

    // 绘制点
    pointMarker(e) {
      this.cancleMarkerListener();

      this.clickFunction = this.addClickMarker;
      map.on("click", this.clickFunction, this);

      this.moveFunction = this.addMoveMarker;
      map.on("mousemove", this.moveFunction, this);

      this.rightClickFunction = this.cancleMarkerListener;
      map.on("contextmenu", this.rightClickFunction, this);

      // e.stopPropagation();
    },
    // 绘制点符号添加到图层中
    addClickMarker: function (e) {
      const clickLocation = [e.latlng.lat, e.latlng.lng];
      this.cancleMarkerListener();
      const pointMarker = L.marker(clickLocation).addTo(this.markersLayer);
      this.toolClicked = -1;
      this.options.type = null;
      this.nowObj = this.pointMarker;
      this.addTip(pointMarker);
    },
    // 添加移动符号事件
    addMoveMarker: function (e) {
      map.getContainer().style.cursor = "pointer";
      this.moveMarker.addTo(this.currentMarkerGroup);
      this.moveMarker.setLatLng(e.latlng);
      this.moveMarker.setZIndexOffset(this.marker_zindex);
    },

    // 添加线符号
    lineMarker(e) {
      this.cancleMarkerListener();
      this.disabled = true;
      this.poly_points = [];
      this.poly_line = new L.Polyline([], {
        color: this.options.color,
        // opacity:0.6,
        weight: this.options.width,
      }); // 折线
      this.dashLine = new L.Polyline([], {
        color: this.options.color,
        // opacity:0.6,
        dashArray: [10, 10],
        weight: this.options.width,
      });

      this.clickFunction = this.addLineLatlng;
      map.on("click", this.clickFunction, this);

      this.dblclickFunction = this.addLineMarker;
      map.on("dblclick", this.dblclickFunction, this);

      this.moveFunction = this.addDashLine;
      map.on("mousemove", this.moveFunction, this);

      this.rightClickFunction = this.cancleMarkerListener;
      map.on("contextmenu", this.rightClickFunction, this);

      // e.stopPropagation();
    },
    // 添加线绘制点
    addLineLatlng(e) {
      this.poly_points.push([e.latlng.lat, e.latlng.lng]);
    },
    // 添加线绘制结束点
    addLineMarker(e) {
      this.cancleMarkerListener();
      map.removeLayer(this.dashLine);
      if (this.poly_points.length > 2) {
        this.formData.other1 = {
          color: this.options.color,
          // opacity:0.6,
          weight: this.options.width,
        };
        this.poly_line = L.polyline(
          this.poly_points,
          this.formData.other1
        ).addTo(map);
        // this.poly_line.setLatLngs(this.poly_points).addTo(this.markersLayer);
        this.toolClicked = -1;
        this.options.type = null;
        this.nowObj = this.poly_line;
        this.formData.drawType = 1;

        return this.addTip(
          this.poly_line,
          this.poly_points[this.poly_points.length - 1]
        );
      }
    },
    // 在绘制线鼠标移动时显示虚线效果
    addDashLine(e) {
      map.getContainer().style.cursor = "pointer";
      this.moveIcon.addTo(this.currentMarkerGroup);
      if (this.poly_points.length > 0) {
        this.dashLine.setLatLngs(this.poly_points);
        this.dashLine
          .addLatLng([e.latlng.lat, e.latlng.lng])
          .addTo(this.currentMarkerGroup);
        this.moveIcon.setIcon(
          L.divIcon({
            html:
              "<div class='leaflet-marker-markerTooltip'>双击添加备注</div>",
            className: "leaflet-marker-noDefaultDivIcon",
          })
        );
      } else {
        this.moveIcon.setIcon(
          L.divIcon({
            html:
              "<div class='leaflet-marker-markerTooltip'>点击开始绘制，双击结束</div>",
            className: "leaflet-marker-noDefaultDivIcon",
          })
        );
      }
      this.moveIcon.setLatLng(e.latlng);
      this.moveIcon.setZIndexOffset(this.marker_zindex + 20);
    },

    // 绘制圆
    // 为绘制区域添加绘制事件
    circleMarker(e) {
      this.cancleMarkerListener();
      this.disabled = true;
      this.circleCenter = null;
      this.radius = 0;
      // this.poly_circle = new L.circle();
      this.poly_circle = new L.circle([], {
        color: this.options.color,
        // opacity:0.6,
        weight: this.options.width,
        fillColor: this.options.color,
        fillOpacity: 0.2,
      });

      this.poly_nowCircle = new L.circle([], {
        color: this.options.color,
        // opacity:0.6,
        weight: this.options.width,
        dashArray: [10, 10],
        fillColor: this.options.color,
        fillOpacity: 0.3,
      });
      map.dragging.disable(); // 将moousemove事件移动地图禁用

      this.downFunction = this.addCircleCenter;
      map.on("mousedown", this.downFunction, this);

      this.moveFunction = this.getRadius;
      map.on("mousemove", this.moveFunction, this);

      this.upFunction = this.confirmCircle;
      map.on("mouseup", this.upFunction, this);

      this.rightClickFunction = this.cancleMarkerListener;
      map.on("contextmenu", this.rightClickFunction, this);

      // e.stopPropagation();
    },
    // 确定圆心
    addCircleCenter(e) {
      this.circleCenter = e.latlng;
    },
    // 拖动改变圆半径
    getRadius(e) {
      if (this.circleCenter) {
        this.radius = L.latLng(e.latlng).distanceTo(this.circleCenter); //计算半径
        this.poly_nowCircle.setLatLng(this.circleCenter);
        this.poly_nowCircle.setRadius(this.radius);
        this.poly_nowCircle.setStyle({
          color: this.options.color,
          dashArray: [10, 10],
          fillColor: this.options.color,
          fillOpacity: 0.2,
        });
        this.poly_nowCircle.addTo(map);
      }
    },
    // 确定圆
    confirmCircle(e) {
      this.cancleMarkerListener();
      map.removeLayer(this.poly_nowCircle);
      this.formData.other1 = {
        weight: this.options.width,
        color: this.options.color,
        fillColor: this.options.color,
        fillOpacity: 0.2,
      };
      this.poly_circle = L.circle(
        this.circleCenter,
        this.radius,
        this.formData.other1
      ).addTo(map);

      map.dragging.enable();
      this.toolClicked = -1;
      this.options.type = null;
      this.nowObj = this.poly_circle;
      this.formData.drawType = 2;
      this.formData.other2 = this.radius;

      return this.addTip(this.poly_circle, this.circleCenter);
    },

    // 为绘制区域添加绘制事件
    polygonMarker(e) {
      this.cancleMarkerListener();
      this.disabled = true;
      this.poly_points = []; // 区域点
      this.poly_area = new L.Polygon([], {
        color: this.options.color,
        // opacity:0.6,
        weight: this.options.width,
        fillColor: this.options.color,
        fillOpacity: 0.2,
      });

      this.poly_now = new L.Polygon([], {
        color: this.options.color,
        // opacity:0.6,
        weight: this.options.width,
        dashArray: [10, 10],
        fillColor: this.options.color,
        fillOpacity: 0.3,
      });

      this.clickFunction = this.addPolyLatlng;
      map.on("click", this.clickFunction, this);

      this.dblclickFunction = this.addPloygonMarker;
      map.on("dblclick", this.dblclickFunction, this);

      this.moveFunction = this.addPolyNow;
      map.on("mousemove", this.moveFunction, this);

      this.rightClickFunction = this.cancleMarkerListener;
      map.on("contextmenu", this.rightClickFunction, this);

      // e.stopPropagation();
    },
    // 添加区域绘制点
    addPolyLatlng(e) {
      this.poly_points.push([e.latlng.lat, e.latlng.lng]);
    },
    // 添加区域绘制结束点
    addPloygonMarker(e) {
      this.cancleMarkerListener();
      map.removeLayer(this.poly_now);
      // if(this.poly_points.length==4&&(this.poly_points[1]==this.poly_points[2])&&(this.poly_points[2]==this.poly_points[3])){
      //   flag = false
      // }
      if (this.poly_points.length > 2) {
        // this.poly_area.setLatLngs(this.poly_points).addTo(this.markersLayer);
        this.formData.other1 = {
          color: this.options.color,
          // opacity:0.6,
          weight: this.options.width,
          fillColor: this.options.color,
          fillOpacity: 0.2,
        };
        this.poly_area = L.polygon(
          [this.poly_points],
          this.formData.other1
        ).addTo(map);
        var tipLocation = this.poly_points[this.poly_points.length - 1];
        this.toolClicked = -1;
        this.options.type = null;
        this.nowObj = this.poly_area;
        this.formData.drawType = 2;

        return this.addTip(this.poly_area, tipLocation);
      } else {
        this.$message.warning("绘制多边形需至少创建三点");
      }
    },
    // 在绘制区域鼠标移动时显示虚线效果
    addPolyNow(e) {
      map.getContainer().style.cursor = "pointer";
      this.moveIcon.addTo(this.currentMarkerGroup);
      if (this.poly_points.length > 0) {
        this.poly_now.setLatLngs(this.poly_points);
        this.poly_now
          .addLatLng([e.latlng.lat, e.latlng.lng])
          .addTo(this.currentMarkerGroup);
        this.moveIcon.setIcon(
          L.divIcon({
            html:
              "<div class='leaflet-marker-markerTooltip'>双击添加备注</div>",
            className: "leaflet-marker-noDefaultDivIcon",
          })
        );
      } else {
        this.moveIcon.setIcon(
          L.divIcon({
            html:
              "<div class='leaflet-marker-markerTooltip'>点击开始绘制，双击结束</div>",
            className: "leaflet-marker-noDefaultDivIcon",
          })
        );
      }
      this.moveIcon.setLatLng(e.latlng);
      this.moveIcon.setZIndexOffset(this.marker_zindex + 20);
    },

    // 为绘制区域添加绘制事件
    rectangleMarker(e) {
      this.cancleMarkerListener();
      this.disabled = true;
      this.rectPoints = [];
      this.startPoint = null;
      this.endPoint = null;

      this.downFunction = this.downRect;
      map.on("mousedown", this.downFunction, this);

      this.moveFunction = this.moveRect;
      map.on("mousemove", this.moveFunction, this);

      this.upFunction = this.confirmRect;
      map.on("mouseup", this.upFunction, this);

      this.rightClickFunction = this.cancleMarkerListener;
      map.on("contextmenu", this.rightClickFunction, this);

      // e.stopPropagation();
    },
    // 添加区域绘制点
    downRect(e) {
      this.startPoint = e.latlng;
      map.dragging.disable();
    },
    // 添加区域绘制结束点
    moveRect(e) {
      if (map.hasLayer(this.poly_nowRect)) {
        map.removeLayer(this.poly_nowRect);
      }
      this.endPoint = e.latlng;
      this.rectPoints = [this.startPoint, this.endPoint];

      this.poly_nowRect = L.rectangle(this.rectPoints, {
        color: this.options.color,
        // opacity:0.6,
        dashArray: [10, 10],
        weight: this.options.width,
        fillColor: this.options.color,
        fillOpacity: 0.2,
      });
      this.poly_nowRect.addTo(map);
    },
    // 在绘制区域鼠标移动时显示虚线效果
    confirmRect(e) {
      this.cancleMarkerListener();
      map.removeLayer(this.poly_nowRect);
      map.dragging.enable();
      this.formData.other1 = {
        color: this.options.color,
        // opacity:0.6,
        weight: this.options.width,
        fillColor: this.options.color,
        fillOpacity: 0.2,
      };
      this.poly_rect = L.rectangle(this.rectPoints, this.formData.other1);
      map.addLayer(this.poly_rect);
      this.toolClicked = -1;
      this.options.type = null;
      this.nowObj = this.poly_rect;
      this.formData.drawType = 2;

      this.addTip(this.poly_rect, this.endPoint);
    },

    // 备注信息
    // 添加绘制符号的备注信息
    addTip(markerAdd, tipLocation) {
      this.tipPanel = true;
      this.markerAdd = markerAdd;
      this.tipLocation = tipLocation;
      return this.$refs.tipModal;
    },
    // 添加备注信息时备注框确定按钮
    tipOk() {
      // 判读是新建符号，还是修改符号
      //   this.bindPopupToMarker(this.markerAdd, this.tip, this.tipLocation);
      //   this.record.remark = this.tip;
      //   this.record.marker.openPopup();
      // } else {
      //   this.bindPopupToMarker(this.markerAdd, this.tip, this.tipLocation);

      //   var newMarkerData = {};
      //   newMarkerData.geometry = JSON.stringify(
      //     this.markerAdd.toGeoJSON().geometry
      //   );
      //   newMarkerData.geometryObject = this.markerAdd.toGeoJSON().geometry;
      //   console.log(newMarkerData.geometry)
      //   newMarkerData.marker = this.markerAdd;
      //   newMarkerData.projectNo = this.uuid();
      //   newMarkerData.remark = this.tip;
      //   if (this.tipLocation) {
      //     // 把点对象转化为字符串---存数据库
      //     // newMarkerData.tipLocation = this.tipLocation.toString()
      //     newMarkerData.tipLocation = this.tipLocation;
      //   }
      //   this.allMarkerData.push(newMarkerData);
      //   this.showMarkerData.push(newMarkerData);
      // }
      this.disabled = false;

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formData.coordinates = JSON.stringify(
            this.markerAdd.toGeoJSON().geometry
          );
          this.formData.other1 = JSON.stringify(this.formData.other1);
          this.$post("/api/common-place", this.formData)
            .then(() => {
              this.$message({
                message:
                  (this.formData.drawType == 1 ? "警戒线" : "任务区") +
                  "添加成功",
                type: "success",
              });
              // this.bindPopupToMarker(
              //   this.markerAdd,
              //   this.formData.placeName,
              //   this.tipLocation
              // );
              this.resetTipPanel();

              this.$emit("updateTab");
            })
            .catch(() => {
              this.$message({
                message:
                  (this.formData.drawType == 1 ? "警戒线" : "任务区") +
                  "添加失败",
                type: "error",
              });
            });
        }
      });
    },
    // 备注框取消按钮
    tipCancel() {
      this.disabled = false;
      // 判断是新增取消还是新增取消
      if (!this.markerAdd._popup) {
        this.markerAdd.removeFrom(this.markersLayer);
      }
      this.tipPanel = false;
      this.clearAllLayer()
      this.reset
    },
    // 绑定弹出标记---弹出框
    bindPopupToMarker(theMarker, theTip, tipLocation) {
      if (tipLocation != null) {
        theMarker
          .bindPopup(theTip, {
            autoPan: false,
            autoClose: false,
            className: "leaflet-marker-markerTip",
            keepInView: false,
          })
          .openPopup(L.latLng(tipLocation[0], tipLocation[1]));
        // 使备注显示在线或面的结束点位置
        // theMarker.off('click')
        // theMarker.on('click', function () {
        //   theMarker.openPopup(L.latLng(tipLocation[0], tipLocation[1]))
        // })
      } else {
        theMarker
          .bindPopup(theTip, {
            autoClose: false,
            className: "leaflet-marker-markerTip",
          })
          .openPopup();
      }
    },

    // 取消标记侦听器
    cancleMarkerListener() {
      if (this.clickFunction) {
        map.off("click", this.clickFunction, this);
      }
      if (this.dblclickFunction) {
        map.off("dblclick", this.dblclickFunction, this);
      }
      if (this.moveFunction) {
        map.off("mousemove", this.moveFunction, this);
      }
      if (this.upFunction) {
        map.off("mouseup", this.upFunction, this);
      }
      if (this.downFunction) {
        map.off("mousedown", this.downFunction, this);
      }
      if (this.rightClickFunction) {
        map.off("contextmenu", this.rightClickFunction, this);
      }
      if (map.hasLayer(this.currentMarkerGroup)) {
        this.currentMarkerGroup.clearLayers();
      }
    },
    // 产生16位随机ID
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = "-";
      var uuid = s.join("");
      return uuid;
    },
  },
  mounted() {},
};
</script>
