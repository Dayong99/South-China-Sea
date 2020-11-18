import request from '@/utils/request'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { windCanvas, getCurrentExtent } from './oceanWeather'
import { waveCanvas } from '@/utils/oceanWaves'
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
  constructor(viewer, day, time, level, num, type) {
    this.viewer = viewer
    this.scene = this.viewer.scene
    this.camera = this.viewer.camera
    this.temPrimitivelist = new Cesium.PrimitiveCollection()
    this.heiPrimitivelist = new Cesium.PrimitiveCollection()
    this.verPrimitivelist = new Cesium.PrimitiveCollection()
    this.sigPrimitivelist = new Cesium.PrimitiveCollection()
    this.mslpPrimitivelist = new Cesium.PrimitiveCollection()
    this.temLabels = new Cesium.LabelCollection()
    this.heiLabels = new Cesium.LabelCollection()
    this.verLabels = new Cesium.LabelCollection()
    this.sigLabels = new Cesium.LabelCollection()
    this.mslpLabels = new Cesium.LabelCollection()
    this.parameter = [
      {
        day,
        time,
        level,
        num,
        type
      },
      {
        day,
        time,
        level,
        num,
        type
      },
      {
        day,
        time,
        level,
        num,
        type
      },
      {
        day,
        time,
        level,
        num,
        type
      },
      {
        day,
        time,
        level,
        num,
        type
      }
    ]
    this.data = []
    this.setParam = function(day, time, level, num, type) {
      if (type.toLowerCase() === 'temperature') {
        this.parameter[0].day = day
        this.parameter[0].time = time
        this.parameter[0].level = level
        this.parameter[0].num = num
        this.parameter[0].type = type
      }
      if (type.toLowerCase() === 'geopotential_height') {
        this.parameter[1].day = day
        this.parameter[1].time = time
        this.parameter[1].level = level
        this.parameter[1].num = num
        this.parameter[1].type = type
      }
      if (type.toLowerCase() === 'vertical_velocity') {
        this.parameter[2].day = day
        this.parameter[2].time = time
        this.parameter[2].level = level
        this.parameter[2].num = num
        this.parameter[2].type = type
      }
      if (type.toLowerCase() === 'significant_height_of_wind_waves') {
        this.parameter[3].day = day
        this.parameter[3].time = time
        this.parameter[3].level = level
        this.parameter[3].num = num
        this.parameter[3].type = type
      }
      if (type.toLowerCase() === 'mslp_eta_model_reduction') {
        this.parameter[4].day = day
        this.parameter[4].time = time
        this.parameter[4].level = level
        this.parameter[4].num = num
        this.parameter[4].type = type
      }
    }
    // 延迟调用
    this.delay = 500
    // this.temDebounceHandle = debounce(this.temLine, this.delay)
    this.heiDebounceHandle = debounce(this.heiLine, this.delay)
    this.verDebounceHandle = debounce(this.verLine, this.delay)
    // this.sigDebounceHandle = debounce(this.sigLine, this.delay)
    this.mslpDebounceHandle = debounce(this.mslpLine, this.delay)

    this.imgParam = [
      {
        day,
        time,
        level,
        num,
        type
      },
      {
        day,
        time,
        level,
        num,
        type
      },
      {
        day,
        time,
        level,
        num,
        type
      },
      {
        day,
        time,
        level,
        num,
        type
      }
    ]
    this.setImgParam = function(day, time, level, num, type) {
      if (type.toLowerCase() === 'u_v_component_of_wind') {
        this.imgParam[0].day = day
        this.imgParam[0].time = time
        this.imgParam[0].level = level
        this.imgParam[0].num = num
        this.imgParam[0].type = type
      } else if (type.toLowerCase() === 'relative_humidity') {
        this.imgParam[1].day = day
        this.imgParam[1].time = time
        this.imgParam[1].level = level
        this.imgParam[1].num = num
        this.imgParam[1].type = type
      } else if (type.toLowerCase() === 'temperature') {
        this.imgParam[2].day = day
        this.imgParam[2].time = time
        this.imgParam[2].level = level
        this.imgParam[2].num = num
        this.imgParam[2].type = type
      } else if (type.toLowerCase() === 'significant_height_of_wind_waves') {
        this.imgParam[3].day = day
        this.imgParam[3].time = time
        this.imgParam[3].level = level
        this.imgParam[3].num = num
        this.imgParam[3].type = type
      }
    }
    this.windImgDebounceHandle = debounce(this.drawWindImage, 500)
    this.relImgDebounceHandle = debounce(this.drawRelImage, 500)
    this.windDebounceHandle = debounce(this.drawwind, 500)
    this.getWindDebounceHandle = debounce(this.getwind, 500)
    this.temperatureImgDebounceHandle = debounce(this.drawTemperatureImage, 500)
    this.sigImgDebounceHandle = debounce(this.drawSigImage, 500)

    this.waveDebounceHandle = debounce(this.drawwave, 500)
    // this.getWaveDebounceHandle = debounce(this.getwave, 100)
    this.temptureLayer = []
    this.windLayer = []
    this.windlist = []
    this.setWind = function(latOffset, lngOffset, windScale, options, day, time, level, colorObj) {
      this.latOffset = latOffset
      this.lngOffset = lngOffset
      this.windScale = windScale
      this.options = options
      this.param = {
        day,
        time,
        level
      }
      this.colorObj = colorObj
    }
    this.waveLayer = []
    this.wavelist = []
    this.setWave = function(latOffset, lngOffset, waveScale, options, day, time, level) {
      this.wavelatOffset = latOffset
      this.wavelngOffset = lngOffset
      this.waveScale = waveScale
      this.waveOptions = options
      this.waveParam = {
        day,
        time,
        level
      }
    }
  }

  // getTemLine() {
  //   this.temDebounceHandle()
  // }
  // temLine() {
  //   // if (window.isScroll) return
  //   this.clearLines()
  //   this.temPrimitivelist = new Cesium.PrimitiveCollection()
  //   this.temLabels = new Cesium.LabelCollection()
  //   const extent = getCurrentExtent(this.viewer)
  //   if (extent.xMin > extent.xMax) {
  //     const extent1 = {
  //       xMin: extent.xMin,
  //       xMax: 360,
  //       yMin: extent.yMin,
  //       yMax: extent.yMax
  //     }
  //     const extent2 = {
  //       xMin: 0,
  //       xMax: extent.xMax,
  //       yMin: extent.yMin,
  //       yMax: extent.yMax
  //     }
  //     this.getTemData(this.parameter[0], extent1)
  //     this.getTemData(this.parameter[0], extent2)
  //   } else {
  //     this.getTemData(this.parameter[0], extent)
  //   }
  // }
  // // 请求数据
  // async getTemData(param, extent) {
  //   // window.isScroll = true
  //   await request.get('/gis/api/numericalvalue/contours', {
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
  //       //   console.log('isoline')
  //       //   console.log(window.isScroll)
  //       //   console.log('lineshuju')
  //       //   console.log(r)
  //         this.data = r.data.data
  //         console.log(this.data)

  //         await this.drawTemLine(r.data.data, param.type)
  //       }
  //     })
  //     .catch(r => {
  //       // console.log(r)
  //       // window.isScroll = false
  //       Message.warning('获得' + param.type + '数据失败')
  //     })
  // }

  // // 绘制线和label
  // drawTemLine(points, type) {
  //   // console.log('r.data.data')
  //   // console.log(points)
  //   // 默认颜色
  //   const color = Cesium.Color.fromCssColorString('#FE0000')

  //   points.forEach((pl, index) => {
  //     const pos = []

  //     pl.PointList.forEach(p => {
  //       pos.push(p.X)
  //       // pos.push(90 - p.Y)
  //       pos.push(p.Y)
  //     })

  //     // 第一个点作为label的位置
  //     const remain = []
  //     let r1 = pos.length / 2
  //     r1 = r1 % 2 == 0 ? r1 : r1 - 1
  //     const r2 = r1 + 1
  //     remain.push(pos[r1])
  //     remain.push(pos[r2])

  //     const prenum = (pl.Value + '').split('.')[0]
  //     const lastnum = (pl.Value + '').split('.')[1].substring(0, 2)
  //     pl.Value = prenum + '.' + lastnum
  //     // pl.Value = (pl.Value + '').split('.')[0]

  //     this.temLabels.add({
  //       position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
  //       text: pl.Value + '',
  //       font: '28px Helvetica',
  //       show: true,
  //       fillColor: color,
  //       scale: 0.5,
  //       // fillColor: Cesium.Color.fromCssColorString('#0E0ED4'),
  //       // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  //       scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
  //       verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
  //       horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
  //       // pixeloffset: new Cesium.Cartesian2(1500, 25),
  //     })
  //     // console.log('label')

  //     const primitive = this.createPolyline(pos, color)
  //     // 温度材质-红色虚线
  //     primitive.appearance = new Cesium.PolylineMaterialAppearance({
  //       material: new Cesium.Material(materialArr[0])
  //     })

  //     this.temPrimitivelist.add(primitive)
  //   })
  //   this.temLabels.blendOption = Cesium.BlendOption.TRANSLUCENT
  //   this.scene.primitives.add(this.temPrimitivelist)
  //   this.scene.primitives.add(this.temLabels)
  // }

  // 画位势高度
  getHeiLine() {
    this.heiDebounceHandle()
  }
  heiLine() {
    // if (window.isScroll) return
    this.clearLines()
    this.heiPrimitivelist = new Cesium.PrimitiveCollection()
    this.heiLabels = new Cesium.LabelCollection()
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
      this.getHeiData(this.parameter[1], extent1)
      this.getHeiData(this.parameter[1], extent2)
    } else {
      this.getHeiData(this.parameter[1], extent)
    }
  }
  // 请求数据
  async getHeiData(param, extent) {
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
      .then(async r => {
        // window.isScroll = false

        if (r.status == 200) {
        //   console.log('isoline')
        //   console.log(window.isScroll)
        //   console.log('lineshuju')
        //   console.log(r)
          this.data = r.data.data
          console.log(this.data)

          await this.drawHeiLine(r.data.data, param.type)
        }
      })
      .catch(r => {
        // console.log(r)
        // window.isScroll = false
        Message.warning('获得' + param.type + '数据失败')
      })
  }

  // 绘制线和label,位势高度
  drawHeiLine(points, type) {
    console.log('r.data.data')
    console.log(points)
    // 默认颜色
    const color = Cesium.Color.fromCssColorString('#0E0ED4')

    points.forEach((pl, index) => {
      const pos = []

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

      // pl.Value = (pl.Value + '').split('.')[0]
      pl.Value = Math.floor(pl.Value / 100)
      // const prenum = (pl.Value + '').split('.')[0]
      // const lastnum = (pl.Value + '').split('.')[1].substring(0, 2)
      // pl.Value = prenum + '.' + lastnum

      this.heiLabels.add({
        position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
        text: pl.Value + '',
        font: '28px Helvetica',
        show: true,
        fillColor: color,
        scale: 0.5,
        // fillColor: Cesium.Color.fromCssColorString('#0E0ED4'),
        // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
        verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
        // pixeloffset: new Cesium.Cartesian2(1500, 25),
      })
      //   console.log('label')

      const primitive = this.createPolyline(pos, color)
      this.heiPrimitivelist.add(primitive)
    })
    this.heiLabels.blendOption = Cesium.BlendOption.TRANSLUCENT
    this.scene.primitives.add(this.heiPrimitivelist)
    this.scene.primitives.add(this.heiLabels)
  }

  // 画垂直速度
  getVerLine() {
    this.verDebounceHandle()
  }
  verLine() {
    // if (window.isScroll) return
    this.clearLines()
    this.verPrimitivelist = new Cesium.PrimitiveCollection()
    this.verLabels = new Cesium.LabelCollection()
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
      this.getVerData(this.parameter[2], extent1)
      this.getVerData(this.parameter[2], extent2)
    } else {
      this.getVerData(this.parameter[2], extent)
    }
  }
  // 请求数据
  async getVerData(param, extent) {
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
      .then(async r => {
        // window.isScroll = false

        if (r.status == 200) {
        //   console.log('isoline')
        //   console.log(window.isScroll)
        //   console.log('lineshuju')
        //   console.log(r)
          this.data = r.data.data
          console.log(this.data)

          await this.drawVerLine(r.data.data, param.type)
        }
      })
      .catch(r => {
        // console.log(r)
        // window.isScroll = false
        Message.warning('获得' + param.type + '数据失败')
      })
  }

  // 绘制线和label
  drawVerLine(points, type) {
    // console.log('r.data.data')
    // console.log(points)
    // 默认颜色
    const color = Cesium.Color.fromCssColorString('#000')

    points.forEach((pl, index) => {
      const pos = []

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

      // pl.Value = (pl.Value + '').split('.')[0]
      const prenum = (pl.Value + '').split('.')[0]
      const lastnum = (pl.Value + '').split('.')[1].substring(0, 2)
      pl.Value = prenum + '.' + lastnum

      this.verLabels.add({
        position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
        text: pl.Value + '',
        font: '28px Helvetica',
        show: true,
        fillColor: color,
        scale: 0.5,
        // fillColor: Cesium.Color.fromCssColorString('#0E0ED4'),
        // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
        verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
        // pixeloffset: new Cesium.Cartesian2(1500, 25),
      })
      // console.log('label')

      const primitive = this.createPolyline(pos, color)
      primitive.appearance = new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material(materialArr[1])
      })

      this.verPrimitivelist.add(primitive)
    })
    this.verLabels.blendOption = Cesium.BlendOption.TRANSLUCENT
    this.scene.primitives.add(this.verPrimitivelist)
    this.scene.primitives.add(this.verLabels)
  }

  // getSigLine() {
  //   this.sigDebounceHandle()
  // }
  // sigLine() {
  //   // if (window.isScroll) return
  //   this.clearLines()
  //   this.sigPrimitivelist = new Cesium.PrimitiveCollection()
  //   this.sigLabels = new Cesium.LabelCollection()
  //   const extent = getCurrentExtent(this.viewer)
  //   if (extent.xMin > extent.xMax) {
  //     const extent1 = {
  //       xMin: extent.xMin,
  //       xMax: 360,
  //       yMin: extent.yMin,
  //       yMax: extent.yMax
  //     }
  //     const extent2 = {
  //       xMin: 0,
  //       xMax: extent.xMax,
  //       yMin: extent.yMin,
  //       yMax: extent.yMax
  //     }
  //     this.getSigData(this.parameter[3], extent1)
  //     this.getSigData(this.parameter[3], extent2)
  //   } else {
  //     this.getSigData(this.parameter[3], extent)
  //   }
  // }
  // // 请求数据
  // async getSigData(param, extent) {
  //   // window.isScroll = true
  //   await request.get('/gis/api/numericalvalue/contours', {
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
  //       //   console.log('isoline')
  //       //   console.log(window.isScroll)
  //       //   console.log('lineshuju')
  //       //   console.log(r)
  //         this.data = r.data.data
  //         console.log(this.data)

  //         await this.drawSigLine(r.data.data, param.type)
  //       }
  //     })
  //     .catch(r => {
  //       // console.log(r)
  //       // window.isScroll = false
  //       Message.warning('获得' + param.type + '数据失败')
  //     })
  // }

  // // 绘制线和label
  // drawSigLine(points, type) {
  //   // console.log('r.data.data')
  //   // console.log(points)
  //   // 默认颜色
  //   const color = Cesium.Color.fromCssColorString('#000')

  //   points.forEach((pl, index) => {
  //     const pos = []

  //     pl.PointList.forEach(p => {
  //       pos.push(p.X)
  //       // pos.push(90 - p.Y)
  //       pos.push(p.Y)
  //     })

  //     // 第一个点作为label的位置
  //     const remain = []
  //     let r1 = pos.length / 2
  //     r1 = r1 % 2 == 0 ? r1 : r1 - 1
  //     const r2 = r1 + 1
  //     remain.push(pos[r1])
  //     remain.push(pos[r2])

  //     // pl.Value = (pl.Value + '').split('.')[0]
  //     const prenum = (pl.Value + '').split('.')[0]
  //     const lastnum = (pl.Value + '').split('.')[1].substring(0, 2)
  //     pl.Value = prenum + '.' + lastnum

  //     this.sigLabels.add({
  //       position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
  //       text: pl.Value + '',
  //       font: '28px Helvetica',
  //       show: true,
  //       fillColor: color,
  //       scale: 0.5,
  //       // fillColor: Cesium.Color.fromCssColorString('#0E0ED4'),
  //       // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  //       scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
  //       verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
  //       horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
  //       // pixeloffset: new Cesium.Cartesian2(1500, 25),
  //     })
  //     // console.log('label')

  //     const primitive = this.createPolyline(pos, color)

  //     this.sigPrimitivelist.add(primitive)
  //   })
  //   this.sigLabels.blendOption = Cesium.BlendOption.TRANSLUCENT
  //   this.scene.primitives.add(this.sigPrimitivelist)
  //   this.scene.primitives.add(this.sigLabels)
  // }
  getMslpLine() {
    this.mslpDebounceHandle()
  }

  mslpLine() {
    this.clearLines()
    this.mslpPrimitivelist = new Cesium.PrimitiveCollection()
    this.mslpLabels = new Cesium.LabelCollection()
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
      this.getMslpData(this.parameter[4], extent1)
      this.getMslpData(this.parameter[4], extent2)
    } else {
      this.getMslpData(this.parameter[4], extent)
    }
  }

  // 请求数据
  async getMslpData(param, extent) {
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
      .then(async r => {
        // window.isScroll = false

        if (r.status == 200) {
        //   console.log('isoline')
        //   console.log(window.isScroll)
        //   console.log('lineshuju')
        //   console.log(r)
          this.data = r.data.data
          console.log(this.data)

          await this.drawMslpLine(r.data.data, param.type)
        }
      })
      .catch(r => {
        // console.log(r)
        // window.isScroll = false
        Message.warning('获得' + param.type + '数据失败')
      })
  }

  // 绘制线和label
  drawMslpLine(points, type) {
    // console.log('r.data.data')
    // console.log(points)
    // 默认颜色
    const color = Cesium.Color.fromCssColorString('#409EFF')

    points.forEach((pl, index) => {
      const pos = []

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

      // pl.Value = (pl.Value + '').split('.')[0]
      pl.Value = Math.floor(pl.Value / 100)
      // const prenum = (pl.Value + '').split('.')[0]
      // const lastnum = (pl.Value + '').split('.')[1].substring(0, 2)
      // pl.Value = prenum + '.' + lastnum

      this.mslpLabels.add({
        position: Cesium.Cartesian3.fromDegrees(remain[0], remain[1]),
        text: pl.Value + '',
        font: '28px Helvetica',
        show: true,
        fillColor: color,
        scale: 0.5,
        // fillColor: Cesium.Color.fromCssColorString('#0E0ED4'),
        // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.8),
        verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT // 水平位置
        // pixeloffset: new Cesium.Cartesian2(1500, 25),
      })
      // console.log('label')

      const primitive = this.createPolyline(pos, color)
      this.mslpPrimitivelist.add(primitive)
    })
    this.mslpLabels.blendOption = Cesium.BlendOption.TRANSLUCENT
    this.scene.primitives.add(this.mslpPrimitivelist)
    this.scene.primitives.add(this.mslpLabels)
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
    this.temPrimitivelist.removeAll()
    this.heiPrimitivelist.removeAll()
    this.verPrimitivelist.removeAll()
    this.sigPrimitivelist.removeAll()
    this.mslpPrimitivelist.removeAll()
    this.temLabels.removeAll()
    this.heiLabels.removeAll()
    this.verLabels.removeAll()
    this.sigLabels.removeAll()
    this.mslpLabels.removeAll()
    this.scene.primitives.remove(this.temPrimitivelist)
    this.scene.primitives.remove(this.heiPrimitivelist)
    this.scene.primitives.remove(this.verPrimitivelist)
    this.scene.primitives.remove(this.sigPrimitivelist)
    this.scene.primitives.remove(this.mslpPrimitivelist)
    this.scene.primitives.remove(this.temLabels)
    this.scene.primitives.remove(this.heiLabels)
    this.scene.primitives.remove(this.verLabels)
    this.scene.primitives.remove(this.sigLabels)
    this.scene.primitives.remove(this.mslpLabels)
  }

  // 画温度色斑图
  drawTemperatureImg() {
    this.temperatureImgDebounceHandle()
  }

  drawTemperatureImage() {
    this.clearImg()
    const extent = getCurrentExtent(this.viewer) // 当前视口下经纬范围
    const extentList = []
    console.log(extent)

    // 范围分段请求
    if (extent.xMin > extent.xMax && extent.xMax > 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else if (extent.xMax > 180 && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else {
      extentList.push(extent)
    }

    extentList.forEach((item) => {
      this.getColorCanvas(this.imgParam[2].day, this.imgParam[2].time, this.imgParam[2].level, this.imgParam[2].num, this.imgParam[2].type, item)
    })
  }

  // 画有效波高色斑图
  drawSigImg() {
    this.sigImgDebounceHandle()
  }

  drawSigImage() {
    this.clearImg()
    const extent = getCurrentExtent(this.viewer) // 当前视口下经纬范围
    const extentList = []
    console.log(extent)

    // 范围分段请求
    if (extent.xMin > extent.xMax && extent.xMax > 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else if (extent.xMax > 180 && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else {
      extentList.push(extent)
    }

    extentList.forEach((item) => {
      this.getColorCanvas(this.imgParam[3].day, this.imgParam[3].time, this.imgParam[3].level, this.imgParam[3].num, this.imgParam[3].type, item)
    })
  }

  // 画风场色斑图
  drawWindImg() {
    // this.debounceHandle = this.debounce(this.drawImage, 500)
    this.windImgDebounceHandle()
  }
  // 画相对湿度色斑图
  drawRelImg() {
    // this.debounceHandle = this.debounce(this.drawImage, 500)
    this.relImgDebounceHandle()
  }

  // 风场色斑图
  async drawWindImage() {
    // this.clearColorLayer()
    this.clearImg()
    this.clearWindLayer()
    // if(this.isImg) return
    const extent = getCurrentExtent(this.viewer) // 当前视口下经纬范围
    const extentList = []
    console.log(extent)

    // 范围分段请求
    if (extent.xMin > extent.xMax && extent.xMax > 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else if (extent.xMax > 180 && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else {
      extentList.push(extent)
    }
    await extentList.forEach(async(item) => {
      await this.getColorCanvas(this.imgParam[0].day, this.imgParam[0].time, this.imgParam[0].level, this.imgParam[0].num, this.imgParam[0].type, item)
    })
    // if (this.windlist.length > 0) {
    //   // this.drawwind()
    //   this.drawWind()
    // }
  }
  // 相对湿度色斑图
  drawRelImage() {
    // this.clearColorLayer()
    // this.clearWindLayer()
    // if(this.isImg) return
    this.clearImg()
    const extent = getCurrentExtent(this.viewer) // 当前视口下经纬范围
    const extentList = []
    console.log(extent)

    // 范围分段请求
    if (extent.xMin > extent.xMax && extent.xMax > 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else if (extent.xMax > 180 && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else {
      extentList.push(extent)
    }

    extentList.forEach((item) => {
      this.getColorCanvas(this.imgParam[1].day, this.imgParam[1].time, this.imgParam[1].level, this.imgParam[1].num, this.imgParam[1].type, item)
    })
  }

  async getColorCanvas(day, time, level, num, type, extent) {
    if (type.toLowerCase() === 'significant_height_of_wind_waves') {
      extent.yMin = extent.yMin < -75 ? -75 : extent.yMin
      extent.yMax = extent.yMax > 75 ? 75 : extent.yMax
    }
    await request.getbuffer('/gis/api/numericalvalue/polygonsImage', {
      day: day,
      legend: type,
      // legend: 'U_V_component_of_wind',
      grade: 1,
      level: level,
      maxX: extent.xMax,
      maxY: extent.yMax,
      minX: extent.xMin,
      minY: extent.yMin,
      num: num,
      time: time < 10 ? '0' + time : time,
      type: type
    }, { responseType: 'arraybuffer' }).then(res => {
      // console.log(res.status)
      if (res.status === 200) {
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }
    }).then(data => {
      console.log('canvas')
      // console.log(data)
      console.log(extent)
      if (extent.xMin >= 180 && extent.xMin < 360) {
        extent.xMin -= 360
        extent.xMax -= 360
      }
      console.log(extent)
      const img = data
      if (img) {
        const colorLayer = this.viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
          url: img,
          rectangle: new Cesium.Rectangle(
            Cesium.Math.toRadians(extent.xMin),
            Cesium.Math.toRadians(extent.yMin),
            Cesium.Math.toRadians(extent.xMax),
            Cesium.Math.toRadians(extent.yMax))
        }), 1)
        // colorLayer.show = false
        colorLayer.alpha = 0.6
        this.temptureLayer.push(colorLayer)
        console.log(colorLayer)
        console.log(this.temptureLayer)
      }
      // if (this.windlist.length > 0) {
      //   this.drawwind()
      // }
    }).catch(r => {
      Message.warning('获得色斑图失败')
    })
  }
  // async getRelColorCanvas(day, time, level, num, type, extent) {
  //   await request.getbuffer('/gis/api/numericalvalue/polygonsImage', {
  //     day: day,
  //     legend: type,
  //     // legend: 'U_V_component_of_wind',
  //     grade: 1,
  //     level: level,
  //     maxX: extent.xMax,
  //     maxY: extent.yMax,
  //     minX: extent.xMin,
  //     minY: extent.yMin,
  //     num: num,
  //     time: time < 10 ? '0' + time : time,
  //     type: type
  //   }, { responseType: 'arraybuffer' }).then(res => {
  //     // console.log(res.status)
  //     if (res.status === 200) {
  //       return 'data:image/png;base64,' + btoa(
  //         new Uint8Array(res.data)
  //           .reduce((data, byte) => data + String.fromCharCode(byte), '')
  //       )
  //     }
  //   }).then(data => {
  //     console.log('canvas')
  //     // console.log(data)
  //     console.log(extent)
  //     if (extent.xMin >= 180 && extent.xMin < 360) {
  //       extent.xMin -= 360
  //       extent.xMax -= 360
  //     }
  //     console.log(extent)
  //     const img = data
  //     if (img) {
  //       const colorLayer = this.viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
  //         url: img,
  //         rectangle: new Cesium.Rectangle(
  //           Cesium.Math.toRadians(extent.xMin),
  //           Cesium.Math.toRadians(extent.yMin),
  //           Cesium.Math.toRadians(extent.xMax),
  //           Cesium.Math.toRadians(extent.yMax))
  //       }), 1)
  //       // colorLayer.show = false
  //       // colorLayer.alpha = 0.6
  //       this.temptureLayer.push(colorLayer)
  //       console.log(colorLayer)
  //       console.log(this.temptureLayer)
  //     }
  //   }).catch(r => {
  //     Message.warning('获得色斑图失败')
  //   })
  // }

  clearImg() {
    this.temptureLayer.forEach(item => {
      this.viewer.imageryLayers.remove(item)
    })
    this.temptureLayer = []
  }

  wind() {
    this.getWindDebounceHandle()
  }
  // 风向图  考虑动态绘制
  getwind() {
    this.windlist = []
    request.get('/gis/api/numericalvalue/wind', {
      // day: this.imgParam[0].day,
      // level: this.imgParam[0].level,
      // time: this.imgParam[0].time < 10 ? '0' + this.imgParam[0].time : this.imgParam[0].time
      day: this.param.day,
      level: this.param.level,
      time: this.param.time < 10 ? '0' + this.param.time : this.param.time
      // type: type
    })
      .then(r => {
        if (r.status == 200) {
          // this.windlist = []
          // window.earth.scene.primitives.removeAll()
          this.windlist = r.data.data
          console.log('wind')
          console.log(r)
          // this.drawwind()
          this.drawWind()
        }
      })
      .catch(r => {
        console.log(r)
        Message.warning('获取"凤羽"数据失败')
      })
  }
  drawWind() {
    this.windDebounceHandle()
  }
  // 绘制
  drawwind() {
    this.clearWindLayer()
    if (!this.windlist.length) return
    // isoLine.clearLines()
    // this.clearWindLayer()

    const extent = getCurrentExtent(this.viewer) // 当前视口下经纬范围
    console.log(extent)
    const extentList = []

    if (extent.xMin > extent.xMax && extent.xMax > 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else if (extent.xMax > 180 && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else {
      extentList.push(extent)
    }

    extentList.forEach(item => {
      const canvas = windCanvas(this.viewer, this.windlist, this.windScale, this.latOffset, this.lngOffset, item, this.options, this.colorObj)
      const layerExtent = {
        xMin: item.xMin >= 180 ? item.xMin - 360 : item.xMin,
        xMax: item.xMax > 180 ? item.xMax - 360 : item.xMax,
        yMin: item.yMin,
        yMax: item.yMax
      }
      const img = canvas.toDataURL()
      this.windLayer.push(this.getColorLayer(img, layerExtent))
    })
  }

  getColorLayer(img, extent) {
    const colorLayer = this.viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
      url: img,
      rectangle: new Cesium.Rectangle(
        Cesium.Math.toRadians(extent.xMin),
        Cesium.Math.toRadians(extent.yMin),
        Cesium.Math.toRadians(extent.xMax),
        Cesium.Math.toRadians(extent.yMax))
    }))
    return colorLayer
  }

  // 清除凤羽图层
  clearWindLayer() {
    this.windLayer.forEach(item => {
      this.viewer.imageryLayers.remove(item)
    })
    this.windLayer = []
  }

  // wave() {
  //   this.getWaveDebounceHandle()
  // }
  // 峰波向
  async wave() {
    this.wavelist = []
    await request.get('/gis/api/numericalvalue/wave', {
      day: this.waveParam.day,
      // level: this.level,
      time: this.waveParam.time < 10 ? '0' + this.waveParam.time : this.waveParam.time
      // type: type
    })
      .then(r => {
        if (r.status === 200) {
          // this.wavelist = []
          // window.earth.scene.primitives.removeAll()
          this.wavelist = r.data.data
          console.log('wave')
          console.log(r)
          this.drawWave()
        }
      })
      .catch(r => {
        console.log(r)
        Message.warning('获取"凤羽"数据失败')
      })
  }

  drawWave() {
    this.waveDebounceHandle()
  }

  // 绘制
  drawwave() {
    if (!this.wavelist.length) return
    this.clearWaveLayer()

    const extent = getCurrentExtent(this.viewer) // 当前视口下经纬范围
    console.log(extent)
    const extentList = []

    if (extent.xMin > extent.xMax && extent.xMax > 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent3 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
      extentList.push(extent3)
    } else if (extent.xMin > extent.xMax) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 359,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 0,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else if (extent.xMax > 180 && extent.xMin < 180) {
      const extent1 = {
        xMin: extent.xMin,
        xMax: 180,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      const extent2 = {
        xMin: 180,
        xMax: extent.xMax,
        yMin: extent.yMin,
        yMax: extent.yMax
      }
      extentList.push(extent1)
      extentList.push(extent2)
    } else {
      extentList.push(extent)
    }

    extentList.forEach(item => {
      const canvas = waveCanvas(this.wavelist, this.waveScale, this.wavelatOffset, this.wavelngOffset, item, this.waveOptions)
      const layerExtent = {
        xMin: item.xMin >= 180 ? item.xMin - 360 : item.xMin,
        xMax: item.xMax > 180 ? item.xMax - 360 : item.xMax,
        yMin: item.yMin,
        yMax: item.yMax
      }
      const img = canvas.toDataURL()
      this.waveLayer.push(this.getColorLayer(img, layerExtent))
    })
  }

  clearWaveLayer() {
    this.waveLayer.forEach(item => {
      this.viewer.imageryLayers.remove(item)
    })
    this.waveLayer = []
  }

  // getCurrentExtent(earth) {
  //   // 范围对象
  //   const extent = []

  //   // 得到当前三维场景的椭球体
  //   const scene = earth.scene
  //   const ellipsoid = scene.globe.ellipsoid
  //   const canvas = scene.canvas

  //   // canvas左上角
  //   const car3_lt = earth.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid)
  //   // canvas右下角
  //   const car3_rb = earth.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid)

  //   // 当canvas左上角和右下角全部在椭球体上
  //   if (car3_lt && car3_rb) {
  //     const carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
  //     const carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
  //     extent.xMin = Cesium.Math.toDegrees(carto_lt.longitude)
  //     extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude)
  //     extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude)
  //     extent.yMin = Cesium.Math.toDegrees(carto_rb.latitude)
  //   }
  //   // 左上角不在，右下角在
  //   else if (!car3_lt && car3_rb) {
  //     let car3_lt2 = null
  //     let x = 0
  //     let y = 0
  //     do {
  //       x <= canvas.width ? x += 10 : canvas.width
  //       y <= canvas.height ? y += 5 : canvas.width
  //       car3_lt2 = earth.camera.pickEllipsoid(new Cesium.Cartesian2(x, y), ellipsoid)
  //     } while (!car3_lt2)
  //     const carto_lt = ellipsoid.cartesianToCartographic(car3_lt2)
  //     const carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
  //     extent.xMin = Cesium.Math.toDegrees(carto_lt.longitude)
  //     extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude)
  //     extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude)
  //     extent.yMin = Cesium.Math.toDegrees(carto_rb.latitude)
  //   }
  //   // 左上角在，右下角不在
  //   else if (car3_lt && !car3_rb) {
  //     let car3_rb2 = null
  //     let x = canvas.width
  //     let y = canvas.height
  //     do {
  //       x >= 10 ? x -= 10 : 10
  //       y >= 5 ? y -= 5 : 5
  //       car3_rb2 = earth.camera.pickEllipsoid(new Cesium.Cartesian2(x, y), ellipsoid)
  //     } while (!car3_rb2)
  //     const carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
  //     const carto_rb = ellipsoid.cartesianToCartographic(car3_rb2)
  //     extent.xMin = Cesium.Math.toDegrees(carto_lt.longitude)
  //     extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude)
  //     extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude)
  //     extent.yMin = Cesium.Math.toDegrees(carto_rb.latitude)
  //   }
  //   // 左上角右下角都不在
  //   else if (!car3_lt && !car3_rb) {
  //     let car3_lt2 = null
  //     let car3_rb2 = null
  //     let x = 0
  //     let y = 0
  //     do {
  //       x <= canvas.width ? x += 10 : canvas.width
  //       y <= canvas.height ? y += 5 : canvas.width
  //       car3_lt2 = earth.camera.pickEllipsoid(new Cesium.Cartesian2(x, y), ellipsoid)
  //     } while (!car3_lt2)

  //     x = canvas.width
  //     y = canvas.height
  //     do {
  //       x >= 10 ? x -= 10 : 10
  //       y >= 5 ? y -= 5 : 5
  //       car3_rb2 = earth.camera.pickEllipsoid(new Cesium.Cartesian2(x, y), ellipsoid)
  //     } while (!car3_rb2)

  //     const carto_lt = ellipsoid.cartesianToCartographic(car3_lt2)
  //     const carto_rb = ellipsoid.cartesianToCartographic(car3_rb2)
  //     extent.xMin = Cesium.Math.toDegrees(carto_lt.longitude)
  //     extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude)
  //     extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude)
  //     extent.yMin = Cesium.Math.toDegrees(carto_rb.latitude)
  //   }
  //   // 风标跨0经线处理
  //   let xmin, xmax
  //   extent.xMin = Math.floor(extent.xMin)
  //   xmin = extent.xMin
  //   extent.xMin < 0 ? extent.xMin += 360 : extent.xMin
  //   extent.yMax = Math.floor(extent.yMax)
  //   extent.xMax = Math.floor(extent.xMax)
  //   xmax = extent.xMax
  //   extent.xMax < 0 ? extent.xMax += 360 : extent.xMax
  //   extent.yMin = Math.floor(extent.yMin)
  //   console.log(extent)

  //   // 摄像机位置
  //   const cam = earth.camera
  //   const campos = ellipsoid.cartesianToCartographic(cam.position)
  //   let camlon = Cesium.Math.toDegrees(campos.longitude)
  //   camlon < 0 ? camlon += 360 : camlon
  //   const camlat = Cesium.Math.toDegrees(campos.latitude)
  //   // 优化当前视口，可以加当前视口经纬度范围/2
  //   if (xmin > 0 && xmax < 0) { // 处理180 -180经线数据问题
  //     extent.xMin = camlon - (180 - xmin + 180 + xmax) / 2
  //     extent.xMax = camlon + (180 - xmin + 180 + xmax) / 2
  //   } else {
  //     extent.xMin = camlon - (xmax - xmin) / 2
  //     extent.xMin < 0 ? extent.xMin += 360 : extent.xMin
  //     extent.xMax = camlon + (xmax - xmin) / 2
  //     extent.xMax > 360 ? extent.xMax -= 360 : extent.xMax
  //   }
  //   extent.yMin = camlat - (extent.yMax - extent.yMin) / 2
  //   // extent.xMax < 0 ? extent.xMax += 180 : extent.xMax
  //   extent.yMax = camlat + (extent.yMax - extent.yMin) / 2
  //   if (extent.yMin > 0 && extent.yMax < 70) {
  //     extent.yMax += 10
  //   }

  //   if (extent.yMax < 0 && extent.yMin > -70) {
  //     extent.yMin -= 10
  //   }

  //   console.log(camlon + '...' + camlat)
  //   // 判断是否是两极
  //   if (extent.yMin > 0 && extent.yMax > 0 && camlat > 75) {
  //     extent.yMin = 55
  //     extent.yMax = 90
  //     extent.xMin = 0
  //     extent.xMax = 360
  //     // if (this.item.type.toLowerCase() === 'Temperature'.toLowerCase()) { this.lineNum = 15 } else { this.lineNum = 40 }
  //   }
  //   if (extent.yMin < 0 && extent.yMax < 0 && camlat < -75) {
  //     extent.yMax = -55
  //     extent.yMin = -90
  //     extent.xMin = 0
  //     extent.xMax = 360
  //     // if (this.item.type.toLowerCase() === 'Temperature'.toLowerCase()) { this.lineNum = 15 } else { this.lineNum = 40 }
  //   }
  //   return extent
  // }
}

function debounce(fn, delay) {
  let timer

  return function() {
    const that = this
    const args = arguments // 存一下传入的参数
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      fn.apply(that, args)
    }, delay)
  }
}

export default Line
