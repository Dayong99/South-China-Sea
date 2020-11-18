/**
 * 等值线
 */
import request from '@/utils/request'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { getCurrentExtent } from './oceanWeather'

// 等值线材质
const materialArr = [
  {
    fabric: {
      type: 'PolylineDash',
      uniforms: {
        color: {
          red: 1,
          green: 0,
          blue: 0,
          alpha: 1
        },
        gapColor: {
          red: 1,
          green: 1,
          blue: 1,
          alpha: 0
        },
        dashLength: 10
      }
    }
  },
  {
    fabric: {
      type: 'PolylineDash',
      uniforms: {
        color: {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 1
        },
        gapColor: {
          red: 1,
          green: 1,
          blue: 1,
          alpha: 0
        },
        dashLength: 10
      }
    }
  },
  {
    fabric: {
      type: 'Color',
      uniforms: {
        color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
      }
    }
  }
]

class Line {
  /**
     * 等值线类
     * @param {window.earth} viewer
     * @param {日期} day
     * @param {时刻} time
     * @param {高度层级} level
     * @param {抽稀值} num
     * @param {等值线类型} type
     */
  constructor(viewer, day, time, level, num, type) {
    this.viewer = viewer
    this.scene = this.viewer.scene
    this.camera = this.viewer.camera
    this.primitivelist = new Cesium.PrimitiveCollection()
    this.labels = new Cesium.LabelCollection()
    this.heightPrimitivelist = new Cesium.PrimitiveCollection()
    this.heightLabels = new Cesium.LabelCollection()
    this.mslpPrimitivelist = new Cesium.PrimitiveCollection()
    this.mslpLabels = new Cesium.LabelCollection()
    this.velocityPrimitivelist = new Cesium.PrimitiveCollection()
    this.velocityLabels = new Cesium.LabelCollection()
    this.parameter = {
      day,
      time,
      level,
      num,
      type
    }
    this.data = []
    this.setParam = function (day, time, level, num, type) {
      this.parameter.day = day,
        this.parameter.time = time,
        this.parameter.level = level,
        this.parameter.num = num,
        this.parameter.type = type
    }
    // 延迟调用
    this.delay = 1000
    this.debounceHandle = debounce(this.Line, this.delay)
    this.temptureLayer = []
  }
  getLine() {
    this.debounceHandle()
    // debounce(this.Line, 2000)
  }

  // handle() {
  //   console.log('handle')
  // }

  // 根据不同的范围请求数据
  Line() {
    console.log('-----------------')
    console.log(this.parameter.type)
    // if (window.isScroll) return
    // this.clearLines()
    // 根据类型进行不同的清除
    if (this.parameter.type.toLowerCase() == 'Geopotential_Height'.toLowerCase()) {
      this.clearHeightLines()
      this.heightPrimitivelist = new Cesium.PrimitiveCollection()
      this.heightLabels = new Cesium.LabelCollection()
    } else if (this.parameter.type.toLowerCase() == 'MSLP_Eta_model_reduction'.toLowerCase()) {
      this.clearMslpLines()
      this.mslpPrimitivelist = new Cesium.PrimitiveCollection()
      this.mslpLabels = new Cesium.LabelCollection()
    } else if (this.parameter.type.toLowerCase() == 'Vertical_velocity'.toLowerCase()) {
      this.clearVelocity()
      this.velocityPrimitivelist = new Cesium.PrimitiveCollection()
      this.velocityLabels = new Cesium.LabelCollection()
    }
    this.primitivelist = new Cesium.PrimitiveCollection()
    this.labels = new Cesium.LabelCollection()

    const extent = getCurrentExtent(this.viewer)
    if (extent.xMin > extent.xMax) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 360,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      this.getData(this.parameter, extent1)
      this.getData(this.parameter, extent2)
    } else {
      this.getData(this.parameter, extent)
    }
  }

  // 请求数据
  async getData(param, extent) {
    // window.isScroll = true
    await request.get('/gis/api/numericalvalue/contours', {
      day: param.day,
      level: param.level,
      maxX: extent.xMax,
      maxY: extent.yMax,
      minX: extent.xMin,
      minY: extent.yMin,
      num: param.num,
      time: param.time < 10 ? '0' + param.time : param.time,
      type: param.type
    })
      .then(r => {
        // window.isScroll = false

        if (r.status == 200) {
          console.log('isoline')
          // console.log(window.isScroll)
          console.log('lineshuju')
          console.log(r)
          this.data = r.data.data
          console.log(this.data)

          this.drawLine(r.data.data, param.type)
        }
      })
      .catch(r => {
        // console.log(r)
        // window.isScroll = false
        Message.warning('获得' + param.type + '数据失败')
      })
  }

  // async getData(param, extent) {
  //   // window.isScroll = true
  //   await request.getbuffer('/gis/api/numericalvalue/contoursImage', {
  //     day: param.day,
  //     level: param.level,
  //     maxX: extent.xMax,
  //     maxY: extent.yMax,
  //     minX: extent.xMin,
  //     minY: extent.yMin,
  //     num: param.num,
  //     time: param.time < 10 ? '0' + param.time : param.time,
  //     type: param.type
  //   })
  //     .then(async r => {
  //       // window.isScroll = false

  //       if (r.status == 200) {
  //         return 'data:image/png;base64,' + btoa(
  //           new Uint8Array(r.data)
  //             .reduce((data, byte) => data + String.fromCharCode(byte), '')
  //         )
  //       }
  //     }).then(data => {
  //       const img = data
  //       if (img) {
  //         const colorLayer = window.earth.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
  //           url: img,
  //           rectangle: new Cesium.Rectangle(
  //             Cesium.Math.toRadians(extent.xMin),
  //             Cesium.Math.toRadians(extent.yMin),
  //             Cesium.Math.toRadians(extent.xMax),
  //             Cesium.Math.toRadians(extent.yMax))
  //         }), 1)  // 1是设置色斑图在凤羽之后
  //         // colorLayer.show = false
  //         // colorLayer.alpha = 0.6
  //         this.temptureLayer.push(colorLayer)
  //       }
  //     })
  //     .catch(r => {
  //       // console.log(r)
  //       // window.isScroll = false
  //       Message.warning('获得' + param.type + '数据失败')
  //     })
  // }

  // 绘制线和label
  drawLine(points, type) {
    console.log('r.data.data')
    console.log(points)
    // 默认颜色
    let color = Cesium.Color.fromCssColorString('#409EFF')

    points.forEach((pl, index) => {
      const pos = []

      if (type.toLowerCase() === 'Geopotential_Height'.toLowerCase()) {
        // 位势高度-蓝黑线
        if (color !== Cesium.Color.fromCssColorString('#0E0ED4')) {
          color = Cesium.Color.fromCssColorString('#0E0ED4')
        }
      }
      //  else if (type.toLowerCase() === 'significant_height_of_wind_waves'.toLowerCase()) {
      //   // 有效波高-黑线
      //   color = Cesium.Color.fromCssColorString('#000')
      // }

      pl.PointList.forEach(p => {
        pos.push(p.X)
        // pos.push(90 - p.Y)
        pos.push(p.Y)
      })

      // 第一个点作为label的位置
      const remain = []
      let r1 = pos.length / 2
      r1 = r1 % 2 == 0 ? r1 : r1 - 1
      const r2 = r1 + 1
      remain.push(pos[r1])
      remain.push(pos[r2])

      // let pos1 = pos.splice(0, (r1-10))
      // let pos2 = pos.splice(10, (pos.length - 10))

      if (type.toLowerCase() === 'MSLP_Eta_model_reduction'.toLowerCase() || type.toLowerCase() === 'Geopotential_Height'.toLowerCase()) {
        pl.Value = pl.Value / 100
        let prenum = (pl.Value + '').split('.')[0]
        let lastnum = (pl.Value + '').split('.')[1].substring(0, 2)
        pl.Value = prenum + '.' + lastnum
      } else {
        let prenum = (pl.Value + '').split('.')[0]
        let lastnum = (pl.Value + '').split('.')[1].substring(0, 2)
        pl.Value = prenum + '.' + lastnum
      }

      if (type.toLowerCase() === 'Vertical_velocity'.toLowerCase()) {
        // 垂速-黑色虚线
        color = Cesium.Color.fromCssColorString('#000')
      }

      if (type.toLowerCase() === 'Geopotential_Height'.toLowerCase()) {
        this.heightLabels.add({
          position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
          text: pl.Value + '',
          font: '28px Helvetica',
          show: true,
          fillColor: color,
          scale: 0.5,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
          verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
        })
      } else if (type.toLowerCase() === 'MSLP_Eta_model_reduction'.toLowerCase()) {
        this.mslpLabels.add({
          position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
          text: pl.Value + '',
          font: '28px Helvetica',
          show: true,
          fillColor: color,
          scale: 0.5,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
          verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
        })
      } else if (type.toLowerCase() === 'Vertical_velocity'.toLowerCase()) {
        this.velocityLabels.add({
          position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
          text: pl.Value + '',
          font: '28px Helvetica',
          show: true,
          fillColor: color,
          scale: 0.5,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
          verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
        })
      }
      // this.labels.add({
      //   position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
      //   text: pl.Value + '',
      //   font: '28px Helvetica',
      //   show: true,
      //   fillColor: color,
      //   scale: 0.5,
      //   scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
      //   verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
      //   horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
      // })

      const primitive = this.createPolyline(pos, color)

      // if (type.toLowerCase() === 'Temperature'.toLowerCase()) {
      //   // 温度材质-红色虚线
      //   primitive.appearance = new Cesium.PolylineMaterialAppearance({
      //     material: new Cesium.Material(materialArr[0])
      //   })
      //   color = Cesium.Color.fromCssColorString('#FE0000')
      // } 

      if (type.toLowerCase() === 'Vertical_velocity'.toLowerCase()) {
        // 垂速-黑色虚线
        primitive.appearance = new Cesium.PolylineMaterialAppearance({
          material: new Cesium.Material(materialArr[1])
        })
        color = Cesium.Color.fromCssColorString('#000')
      }
      // this.primitivelist.add(primitive)
      if (type.toLowerCase() === 'Geopotential_Height'.toLowerCase()) {
        this.heightPrimitivelist.add(primitive)
      } else if (type.toLowerCase() === 'MSLP_Eta_model_reduction'.toLowerCase()) {
        this.mslpPrimitivelist.add(primitive)
      } else if (type.toLowerCase() === 'Vertical_velocity'.toLowerCase()) {
        this.velocityPrimitivelist.add(primitive)
      }
    })

    if (type.toLowerCase() === 'Geopotential_Height'.toLowerCase()) {
      this.scene.primitives.add(this.heightPrimitivelist)
      this.scene.primitives.add(this.heightLabels)
    } else if (type.toLowerCase() === 'MSLP_Eta_model_reduction'.toLowerCase()) {
      this.scene.primitives.add(this.mslpPrimitivelist)
      this.scene.primitives.add(this.mslpLabels)
    } else if (type.toLowerCase() === 'Vertical_velocity'.toLowerCase()) {
      this.scene.primitives.add(this.velocityPrimitivelist)
      this.scene.primitives.add(this.velocityLabels)
    }
    // this.scene.primitives.add(this.primitivelist)
    // console.log(this.scene.primitives)
    // this.scene.primitives.add(this.labels)
  }

  // 错误提示信息
  errorType(type) {
    if (type.toLowerCase() === 'U_V_component_of_wind'.toLowerCase()) {
      return type = '风场'
    } else if (type.toLowerCase() === 'Geopotential_Height'.toLowerCase()) {
      return type = '位势高度'
    } else if (type.toLowerCase() === 'Relative_humidity'.toLowerCase()) {
      return type = '相对湿度'
    } else if (type.toLowerCase() === 'Temperature'.toLowerCase()) {
      return type = '温度'
    } else if (type.toLowerCase() === 'Vertical_velocity'.toLowerCase()) {
      return type = '垂直速度'
    } else if (type.toLowerCase() === 'MSLP_Eta_model_reduction'.toLowerCase()) {
      return type = '海平面气压'
    } else if (type.toLowerCase() === 'significant_height_of_wind_waves'.toLowerCase()) {
      return type = '有效波高'
    }

    // Temperature
    // Geopotential_Height
    // Relative_humidity 相对湿度
    // Vertical_velocity 垂直速度
    // MSLP_Eta_model_reduction 海平面气压
    // significant_height_of_wind_waves 有效波高
  }

  // 根据位置和颜色创建线
  createPolyline(position, color) {
    return new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray(position), // 坐标必须两个和两个以上
          width: 1, // 线宽
          vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(color) // color  必须设置 不然没有效果
        }
      }),
      appearance: new Cesium.PolylineColorAppearance({
        translucent: false
      })
    })
  }

  // 清除线
  clearLines() {
    /*this.scene.primitives.remove(this.primitivelist)
    this.scene.primitives.remove(this.labels)*/
    // this.primitivelist.removeAll()
    // this.labels.removeAll()
    // this.scene.primitives.removeAll()
    this.scene.primitives.remove(this.heightPrimitivelist)
    this.scene.primitives.remove(this.heightLabels)
    this.scene.primitives.remove(this.mslpPrimitivelist)
    this.scene.primitives.remove(this.mslpLabels)
    this.scene.primitives.remove(this.velocityPrimitivelist)
    this.scene.primitives.remove(this.velocityLabels)
  }

  clearHeightLines() {
    this.scene.primitives.remove(this.heightPrimitivelist)
    this.scene.primitives.remove(this.heightLabels)
  }

  clearMslpLines() {
    this.scene.primitives.remove(this.mslpPrimitivelist)
    this.scene.primitives.remove(this.mslpLabels)
  }

  clearVelocity() {
    this.scene.primitives.remove(this.velocityPrimitivelist)
    this.scene.primitives.remove(this.velocityLabels)
  }

  getCurrentExtent(earth) {
    // 范围对象
    const extent = []

    // 得到当前三维场景的椭球体
    const scene = earth.scene
    const ellipsoid = scene.globe.ellipsoid
    const canvas = scene.canvas

    // canvas左上角
    const car3_lt = earth.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid)
    // canvas右下角
    const car3_rb = earth.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid)

    // 当canvas左上角和右下角全部在椭球体上
    if (car3_lt && car3_rb) {
      const carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
      const carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
      extent.xMin = Cesium.Math.toDegrees(carto_lt.longitude)
      extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude)
      extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude)
      extent.yMin = Cesium.Math.toDegrees(carto_rb.latitude)
    }
    // 左上角不在，右下角在
    else if (!car3_lt && car3_rb) {
      let car3_lt2 = null
      let x = 0
      let y = 0
      do {
        x <= canvas.width ? x += 10 : canvas.width
        y <= canvas.height ? y += 5 : canvas.width
        car3_lt2 = earth.camera.pickEllipsoid(new Cesium.Cartesian2(x, y), ellipsoid)
      } while (!car3_lt2)
      const carto_lt = ellipsoid.cartesianToCartographic(car3_lt2)
      const carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
      extent.xMin = Cesium.Math.toDegrees(carto_lt.longitude)
      extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude)
      extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude)
      extent.yMin = Cesium.Math.toDegrees(carto_rb.latitude)
    }
    // 左上角在，右下角不在
    else if (car3_lt && !car3_rb) {
      let car3_rb2 = null
      let x = canvas.width
      let y = canvas.height
      do {
        x >= 10 ? x -= 10 : 10
        y >= 5 ? y -= 5 : 5
        car3_rb2 = earth.camera.pickEllipsoid(new Cesium.Cartesian2(x, y), ellipsoid)
      } while (!car3_rb2)
      const carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
      const carto_rb = ellipsoid.cartesianToCartographic(car3_rb2)
      extent.xMin = Cesium.Math.toDegrees(carto_lt.longitude)
      extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude)
      extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude)
      extent.yMin = Cesium.Math.toDegrees(carto_rb.latitude)
    }
    // 左上角右下角都不在
    else if (!car3_lt && !car3_rb) {
      let car3_lt2 = null
      let car3_rb2 = null
      let x = 0
      let y = 0
      do {
        x <= canvas.width ? x += 10 : canvas.width
        y <= canvas.height ? y += 5 : canvas.width
        car3_lt2 = earth.camera.pickEllipsoid(new Cesium.Cartesian2(x, y), ellipsoid)
      } while (!car3_lt2)

      x = canvas.width
      y = canvas.height
      do {
        x >= 10 ? x -= 10 : 10
        y >= 5 ? y -= 5 : 5
        car3_rb2 = earth.camera.pickEllipsoid(new Cesium.Cartesian2(x, y), ellipsoid)
      } while (!car3_rb2)

      const carto_lt = ellipsoid.cartesianToCartographic(car3_lt2)
      const carto_rb = ellipsoid.cartesianToCartographic(car3_rb2)
      extent.xMin = Cesium.Math.toDegrees(carto_lt.longitude)
      extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude)
      extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude)
      extent.yMin = Cesium.Math.toDegrees(carto_rb.latitude)
    }
    // 风标跨0经线处理
    let xmin, xmax
    extent.xMin = Math.floor(extent.xMin)
    xmin = extent.xMin
    extent.xMin < 0 ? extent.xMin += 360 : extent.xMin
    extent.yMax = Math.floor(extent.yMax)
    extent.xMax = Math.floor(extent.xMax)
    xmax = extent.xMax
    extent.xMax < 0 ? extent.xMax += 360 : extent.xMax
    extent.yMin = Math.floor(extent.yMin)
    console.log(extent)

    // 摄像机位置
    const cam = earth.camera
    const campos = ellipsoid.cartesianToCartographic(cam.position)
    let camlon = Cesium.Math.toDegrees(campos.longitude)
    camlon < 0 ? camlon += 360 : camlon
    const camlat = Cesium.Math.toDegrees(campos.latitude)
    // 优化当前视口，可以加当前视口经纬度范围/2
    if (xmin > 0 && xmax < 0) { // 处理180 -180经线数据问题
      extent.xMin = camlon - (180 - xmin + 180 + xmax) / 2
      extent.xMax = camlon + (180 - xmin + 180 + xmax) / 2
    } else {
      extent.xMin = camlon - (xmax - xmin) / 2
      extent.xMin < 0 ? extent.xMin += 360 : extent.xMin
      extent.xMax = camlon + (xmax - xmin) / 2
      extent.xMax > 360 ? extent.xMax -= 360 : extent.xMax
    }
    extent.yMin = camlat - (extent.yMax - extent.yMin) / 2
    // extent.xMax < 0 ? extent.xMax += 180 : extent.xMax
    extent.yMax = camlat + (extent.yMax - extent.yMin) / 2
    if (extent.yMin > 0 && extent.yMax < 70) {
      extent.yMax += 10
    }

    if (extent.yMax < 0 && extent.yMin > -70) {
      extent.yMin -= 10
    }

    console.log(camlon + '...' + camlat)
    // 判断是否是两极
    if (extent.yMin > 0 && extent.yMax > 0 && camlat > 75) {
      extent.yMin = 55
      extent.yMax = 90
      extent.xMin = 0
      extent.xMax = 360
      // if (this.item.type.toLowerCase() === 'Temperature'.toLowerCase()) { this.lineNum = 15 } else { this.lineNum = 40 }
    }
    if (extent.yMin < 0 && extent.yMax < 0 && camlat < -75) {
      extent.yMax = -55
      extent.yMin = -90
      extent.xMin = 0
      extent.xMax = 360
      // if (this.item.type.toLowerCase() === 'Temperature'.toLowerCase()) { this.lineNum = 15 } else { this.lineNum = 40 }
    }
    return extent
  }
}

function debounce(fn, delay) {
  let timer

  return function () {
    const that = this
    const args = arguments // 存一下传入的参数
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

// function handle() {
//   console.log('handle')
// }

export default Line
