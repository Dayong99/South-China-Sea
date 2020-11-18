import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
class ToolBar {
  constructor(viewer, obj) {
    this.viewer = viewer
    this.scene = this.viewer.scene
    this.camera = this.viewer.camera
    this.unit = obj.unit
    this.latDirection = obj.latDirection
    this.lngDirection = obj.lngDirection
    this.lngminute = obj.lngminute
    this.lngdegree = obj.lngdegree
    this.latminute = obj.latminute
    this.latdegree = obj.latdegree
    this.handler = null
  }
  // 测量距离
  measure() {
    const that = this
    // 测量距离
    // console.log('测量距离')
    // 取消双击事件-追踪该位置
    that.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    this.handler = new Cesium.ScreenSpaceEventHandler(that.scene.canvas)
    var positions = []
    var poly = null
    var distance = 0
    var cartesian = null
    var floatingPoint
    let pointArr = []

    this.handler.setInputAction(movement => {
      const ray = that.camera.getPickRay(movement.endPosition)
      cartesian = that.scene.globe.pick(ray, that.scene)
      if (positions.length >= 1) {
        if (!Cesium.defined(poly)) {
          poly = new PolyLinePrimitive(positions)
        } else {
          positions.pop()
          positions.push(cartesian)
        }
        distance = getSpaceDistance(positions)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.handler.setInputAction(movement => {
      const ray = that.camera.getPickRay(movement.position)
      cartesian = that.scene.globe.pick(ray, that.scene)
      if (positions.length == 0) {
        positions.push(cartesian.clone())
      }
      positions.push(cartesian)
      console.log(positions)
      // 在三维场景中添加Label
      // var textDisance
      // if (this.unit === 'km') {
      //   textDisance = (distance / 1000).toFixed(1) + 'km'
      // }
      // if (this.unit === 'nmi') {
      //   textDisance = (distance / 1852).toFixed(1) + 'n mile'
      // }
      var textDisance =
        that.unit === 'km'
          ? (distance / 1000).toFixed(1) + 'km'
          : (distance / 1852).toFixed(1) + '海里'
      floatingPoint = that.viewer.entities.add({
        name: '空间直线距离',
        position: positions[positions.length - 1],
        point: {
          pixelSize: 10,
          color: Cesium.Color.GOLD,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        },
        label: {
          text: textDisance,
          font: '18px sans-serif',
          fillColor: Cesium.Color.GOLD,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(20, -20)
        },
        flag: 'toolbar'
      })
      pointArr.push(floatingPoint)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handler.setInputAction(movement => {
      if (positions.length <= 2) {
        pointArr.forEach(item => {
          that.viewer.entities.remove(item)
        })

        // 这里pop可以取消实时绘制多边形
        positions.pop()
        Message.warning('距离测量需要至少选取两个点')
        positions = []
        poly = null
        cartesian = null
        distance = 0
        pointArr = []
        return
      }
      this.handler.destroy() // 关闭事件句柄
      this.handler = null
      positions.pop() // 最后一个点无效
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    var PolyLinePrimitive = (function() {
      function _(positions) {
        this.options = {
          name: '直线',
          polyline: {
            show: true,
            positions: [],
            material: Cesium.Color.CHARTREUSE,
            width: 5,
            clampToGround: true
          }
        }
        this.positions = positions
        this._init()
      }

      _.prototype._init = function() {
        var _self = this
        var _update = function() {
          return _self.positions
        }
        // 实时更新polyline.positions
        this.options.flag = 'toolbar'
        this.options.polyline.positions = new Cesium.CallbackProperty(_update, false)
        that.viewer.entities.add(this.options)
      }

      return _
    })()

    // 空间两点距离计算函数
    function getSpaceDistance(positions) {
      var distance = 0
      for (var i = 0; i < positions.length - 1; i++) {
        var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i])
        var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1])
        /** 根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic()
        geodesic.setEndPoints(point1cartographic, point2cartographic)
        var s = geodesic.surfaceDistance
        // console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        // 返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2))
        distance = distance + s
      }
      return distance.toFixed(2)
    }
  }

  // 测量面积
  measurearea() {
    const that = this
    console.log('测量面积')
    // 取消双击事件-追踪该位置
    that.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // 鼠标事件
    this.handler = new Cesium.ScreenSpaceEventHandler(that.scene.canvas)
    var positions = []
    var tempPoints = []
    var polygon = null
    var cartesian = null
    var floatingPoint// 浮动点
    let pointArr = []

    this.handler.setInputAction(movement => {
      const ray = that.camera.getPickRay(movement.endPosition)
      cartesian = that.scene.globe.pick(ray, that.scene)
      if (positions.length >= 2) {
        if (!Cesium.defined(polygon)) {
          polygon = new PolygonPrimitive(positions)
        } else {
          positions.pop()
          positions.push(cartesian)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.handler.setInputAction(movement => {
      const ray = that.camera.getPickRay(movement.position)
      cartesian = that.scene.globe.pick(ray, that.scene)
      if (positions.length == 0) {
        positions.push(cartesian.clone())
      }
      // positions.pop();
      positions.push(cartesian)
      // 在三维场景中添加点
      var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1])
      var longitudeString = Cesium.Math.toDegrees(cartographic.longitude)
      var latitudeString = Cesium.Math.toDegrees(cartographic.latitude)
      var heightString = cartographic.height
      tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString })
      floatingPoint = that.viewer.entities.add({
        name: '多边形面积',
        position: positions[positions.length - 1],
        point: {
          pixelSize: 8,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
          // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        flag: 'toolbar'
      })
      pointArr.push(floatingPoint)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handler.setInputAction(movement => {
      if (positions.length <= 3) {
        pointArr.forEach(item => {
          that.viewer.entities.remove(item)
        })

        // 这里pop可以取消实时绘制多边形
        positions.pop()
        Message.warning('面积测量需要至少选取三个点')
        positions = []
        tempPoints = []
        polygon = null
        cartesian = null
        pointArr = []
        return
      }

      // 删除红点
      pointArr.forEach(item => {
        that.viewer.entities.remove(item)
      })

      this.handler.destroy()
      positions.pop()

      var textArea =
        that.unit === 'km'
          ? (getArea(tempPoints)).toFixed(2) + 'km²'
          : (getArea(tempPoints) / 3.43).toFixed(2) + 'nm²'

      that.viewer.entities.add({
        name: '多边形面积',
        position: positions[positions.length - 1],
        label: {
          text: textArea,
          font: '18px sans-serif',
          fillColor: Cesium.Color.GOLD,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(20, -20)
          // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        flag: 'toolbar'
      })
      this.handler.destroy()
      this.handler = null
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    var radiansPerDegree = Math.PI / 180.0// 角度转化为弧度(rad)
    var degreesPerRadian = 180.0 / Math.PI// 弧度转化为角度

    // 计算多边形面积
    function getArea(points) {
      var res = 0
      // 拆分三角曲面

      for (var i = 0; i < points.length - 2; i++) {
        var j = (i + 1) % points.length
        var k = (i + 2) % points.length
        var totalAngle = Angle(points[i], points[j], points[k])

        var dis_temp1 = distance(positions[i], positions[j])
        var dis_temp2 = distance(positions[j], positions[k])
        res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle))
        // console.log(res)
      }

      return (res / 1000000.0)
    }

    /* 角度*/
    function Angle(p1, p2, p3) {
      var bearing21 = Bearing(p2, p1)
      var bearing23 = Bearing(p2, p3)
      var angle = bearing21 - bearing23
      if (angle < 0) {
        angle += 360
      }
      return angle
    }
    /* 方向*/
    function Bearing(from, to) {
      var lat1 = from.lat * radiansPerDegree
      var lon1 = from.lon * radiansPerDegree
      var lat2 = to.lat * radiansPerDegree
      var lon2 = to.lon * radiansPerDegree
      var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2))
      if (angle < 0) {
        angle += Math.PI * 2.0
      }
      angle = angle * degreesPerRadian// 角度
      return angle
    }

    var PolygonPrimitive = (function() {
      function _(positions) {
        this.options = {
          name: '多边形',
          polygon: {
            hierarchy: [],
            extrudedHeight: 0,
            perPositionHeight: true,
            // perPositionHeight : true,
            material: Cesium.Color.GREEN.withAlpha(0.5),
            // heightReference:20000
            outline: true,
            outlineColor: Cesium.Color.GOLD
          }
        }

        this.hierarchy = { positions }
        this._init()
      }

      _.prototype._init = function() {
        var _self = this
        var _update = function() {
          return _self.hierarchy
        }
        // 实时更新polygon.hierarchy
        this.options.flag = 'toolbar'
        this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false)
        console.log(this.options)
        that.viewer.entities.add(this.options)
      }

      return _
    })()

    function distance(point1, point2) {
      var point1cartographic = Cesium.Cartographic.fromCartesian(point1)
      var point2cartographic = Cesium.Cartographic.fromCartesian(point2)
      /** 根据经纬度计算出距离**/
      var geodesic = new Cesium.EllipsoidGeodesic()
      geodesic.setEndPoints(point1cartographic, point2cartographic)
      var s = geodesic.surfaceDistance
      // 返回两点之间的距离
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2))
      return s
    }
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

  // 放大地图
  enlarge() {
    // // console.log('放大')
    // // 获取当前镜头位置的笛卡尔坐标
    // const cameraPos = this.camera.position

    // // 获取当前坐标系标准
    // const ellipsoid = this.scene.globe.ellipsoid

    // // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    // const cartographic = ellipsoid.cartesianToCartographic(cameraPos)

    // // 获取镜头的高度
    // const height = cartographic.height

    // // 根据上面当前镜头的位置，获取该中心位置的经纬度坐标
    // const centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8))
    // const centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8))

    // // 镜头拉近
    // this.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height / 1.8),
    //   duration: 1.0
    // })
    this.camera.zoomIn(
      (this.camera.positionCartographic.height /
        Math.abs(Math.sin(this.camera.pitch))) *
        0.2
    );
  }

  // 缩小地图
  narrow() {
    // // console.log('缩小')
    // // 获取当前镜头位置的笛卡尔坐标
    // const cameraPos = this.camera.position

    // // 获取当前坐标系标准
    // const ellipsoid = this.scene.globe.ellipsoid

    // // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    // const cartographic = ellipsoid.cartesianToCartographic(cameraPos)

    // // 获取镜头的高度
    // const height = cartographic.height

    // // 根据上面当前镜头的位置，获取该中心位置的经纬度坐标
    // const centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8))
    // const centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8))

    // // 镜头拉近
    // this.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height * 1.8),
    //   duration: 1.0
    // })
    this.camera.zoomOut(
      (this.camera.positionCartographic.height /
        Math.abs(Math.sin(this.camera.pitch))) *
        0.2
    );
  }

  clearTool() {
    if (this.handler) {
      this.handler.destroy()
      this.handler = null
    }
  }
}

export default ToolBar

