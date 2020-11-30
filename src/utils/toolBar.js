import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


var deleteIcon = L.icon({
  iconUrl: "../assets/images/toolbar/shanchu.png",
  iconSize: [16, 16],
});

// 测量距离
var distanceMeasure = {
  points: [],
  //markers:[],
  color: "red",
  layers: L.layerGroup(),
  polyline: null,
  marker: null,
  init: function () {
    distanceMeasure.points = [];
    distanceMeasure.polyline = null;
    distanceMeasure.marker = null;
    map.on('click', distanceMeasure.click).on('dblclick', distanceMeasure.dblclick);
  },
  close: function (latlng) {
    distanceMeasure.marker = L.marker(latlng, { icon: deleteIcon }).addTo(map).on("click", function (e) {
      //console.log('marker',e); 
      if (distanceMeasure.polyline)
        map.removeLayer(distanceMeasure.polyline);

      if (distanceMeasure.marker)
        distanceMeasure.marker.remove();
    });


  },
  click: function (e) {
    map.doubleClickZoom.disable();
    // 添加点信息
    distanceMeasure.points.push(e.latlng);
    // 添加线
    map.on('mousemove', distanceMeasure.mousemove);
    console.log(distanceMeasure.polyline)

  },
  mousemove: function (e) {
    distanceMeasure.points.push(e.latlng);
    if (distanceMeasure.polyline)
      map.removeLayer(distanceMeasure.polyline);
    distanceMeasure.polyline = L.polyline(distanceMeasure.points, { showMeasurements: true, color: 'red' });
    distanceMeasure.polyline.addTo(distanceMeasure.layers);
    distanceMeasure.layers.addTo(map);
    distanceMeasure.points.pop();
  },
  dblclick: function (e) { // 双击结束
    console.log('双击结束', e);
    distanceMeasure.polyline.addTo(distanceMeasure.layers);
    distanceMeasure.close(e.latlng);
    //distanceMeasure.polygon.enableEdit();
    //map.on('editable:vertex:drag editable:vertex:deleted', distanceMeasure.polygon.updateMeasurements, distanceMeasure.polygon);
    map.off('click', distanceMeasure.click).off('mousemove', distanceMeasure.mousemove).off('dblclick', distanceMeasure.dblclick);
  },
  destory: function () {
    if (distanceMeasure.polyline)
      map.removeLayer(distanceMeasure.polyline);

    if (distanceMeasure.marker)
      distanceMeasure.marker.remove();
  }
}
// 测量面积
var areaMeasure = {
  points: [],
  //markers:[],
  color: "red",
  layers: L.layerGroup(),
  polygon: null,
  marker: null,
  init: function () {
    areaMeasure.points = [];
    areaMeasure.polygon = null;
    areaMeasure.marker = null;
    map.on('click', areaMeasure.click).on('dblclick', areaMeasure.dblclick);
  },
  close: function (latlng) {
    areaMeasure.marker = L.marker(latlng, { icon: deleteIcon }).addTo(map).on("click", function (e) {
      //console.log('marker',e); 
      if (areaMeasure.polygon)
        map.removeLayer(areaMeasure.polygon);

      if (areaMeasure.marker)
        areaMeasure.marker.remove();
    });
    //areaMeasure.markers.push(marker);

  },
  click: function (e) {
    map.doubleClickZoom.disable();
    // 添加点信息
    areaMeasure.points.push(e.latlng);
    // 添加面
    map.on('mousemove', areaMeasure.mousemove);
  },
  mousemove: function (e) {
    areaMeasure.points.push(e.latlng);
    if (areaMeasure.polygon)
      map.removeLayer(areaMeasure.polygon);
    areaMeasure.polygon = L.polygon(areaMeasure.points, { showMeasurements: true, color: 'red' });
    //areaMeasure.polygon.addTo(map);
    areaMeasure.polygon.addTo(areaMeasure.layers);
    areaMeasure.layers.addTo(map);
    areaMeasure.points.pop();
  },
  dblclick: function (e) { // 双击结束
    console.log('双击结束', e);
    areaMeasure.polygon.addTo(areaMeasure.layers);
    areaMeasure.close(e.latlng);
    //areaMeasure.polygon.enableEdit();
    //map.on('editable:vertex:drag editable:vertex:deleted', areaMeasure.polygon.updateMeasurements, areaMeasure.polygon);
    map.off('click', areaMeasure.click).off('mousemove', areaMeasure.mousemove).off('dblclick', areaMeasure.dblclick);
  },
  destory: function () {
    if (areaMeasure.polygon)
      map.removeLayer(areaMeasure.polygon);

    if (areaMeasure.marker)
      areaMeasure.marker.remove();
  }
}
class ToolBar {
  constructor(viewer, obj) {

  }
  // 测量距离
  measure() {
    distanceMeasure.destory();
    distanceMeasure.init();
  }

  // 测量面积
  measurearea() {

    areaMeasure.destory();
    areaMeasure.init();
  }

  // 根据输入的位置定位
  location() {
    // this.viewer.entities.removeAll()
    // 将输入的经纬度转为度数
    const lat =
      this.latDirection === 'S'
        ? -(parseFloat(this.latdegree) + parseFloat(this.latminute / 60))
        : parseFloat(this.latdegree) + parseFloat(this.latminute / 60)

    const lng =
      this.lngDirection === 'W'
        ? -(parseFloat(this.lngdegree) + parseFloat(this.lngminute / 60))
        : parseFloat(this.lngdegree) + parseFloat(this.lngminute / 60)

    var point = this.viewer.entities.add({
      name: 'point',
      position: Cesium.Cartesian3.fromDegrees(lng, lat),
      point: { // 点
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
    point.flag = 'toolbar'
    var heading = Cesium.Math.toRadians(0)
    // 镜头倾斜30度俯视
    var pitch = Cesium.Math.toRadians(-90)
    this.viewer
      .zoomTo(point, new Cesium.HeadingPitchRange(heading, pitch, 9000000))
      .then(result => {
        return result
      })
  }


  clearTool() {
    distanceMeasure.destory();
    areaMeasure.destory();
  }
}

export default ToolBar

