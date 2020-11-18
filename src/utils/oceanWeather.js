class Wind {
  /**
       * 构造函数
       * @param  {L.LatLng} latlng 经纬度
       * @param  {Number} speed  风速（海里/小时）
       * @param  {Number} dir    风向（度，正北方向为0度，顺时针）
       * @param  {Object} options    绘制选项
       * @return {Null}        [description]
       */
  constructor(latlng, speed, dir, color, level, options = {}) {
    this.latlng = latlng
    this.speed = speed
    this.dir = dir
    this.color = color
    this.level = level
    this.options = Object.assign({
      isDrawLeftRight: false, // 是否绘制相邻两边
      windLineLen: 20, // 风向线长度
      levelLineMinLen: 5, // 风力线长度
      chunkCount: 6 // 等分点个数，至少六等分
    }, options)
  }
}
// 角度
function getDir(speed, dir) {
  dir > 180 ? dir -= 180 : dir
  const u = speed * Math.cos(2 * Math.PI / 360 * dir)
  const v = speed * Math.sin(2 * Math.PI / 360 * dir)
  const rad = Math.atan2(v, u)
  if (rad == Math.PI) { dir = 90 } else if (rad > 0) { dir = 270 - rad * (180 / Math.PI) } else if (rad < 0) {
    if (u >= 0) { dir = 270 - rad * (180 / Math.PI) }
    if (u < 0) { dir = -rad * (180 / Math.PI) - 90 }
  } else {
    dir = 270
  }
  return dir
}
// 风级
function getLevel(speed) {
  let level = 0
  if (speed <= 0.2) {
    level = 0
  } else if (speed > 0.2 && speed <= 1.5) {
    level = 1
  } else if (speed > 1.5 && speed <= 3.3) {
    level = 2
  } else if (speed > 3.3 && speed <= 5.4) {
    level = 3
  } else if (speed > 5.4 && speed <= 7.9) {
    level = 4
  } else if (speed > 7.9 && speed <= 10.7) {
    level = 5
  } else if (speed > 10.7 && speed <= 13.8) {
    level = 6
  } else if (speed > 13.8 && speed <= 17.1) {
    level = 7
  } else if (speed > 17.1 && speed <= 20.7) {
    level = 8
  } else if (speed > 20.7 && speed <= 24.4) {
    level = 9
  } else if (speed > 24.4 && speed <= 28.4) {
    level = 10
  } else if (speed > 28.4 && speed <= 32.6) {
    level = 11
  } else if (speed > 32.6 && speed <= 36.9) {
    level = 12
  } else if (speed > 36.9 && speed <= 41.4) {
    level = 13
  } else if (speed > 41.4 && speed <= 46.1) {
    level = 14
  } else if (speed > 46.1 && speed <= 50.9) {
    level = 15
  } else if (speed > 50.9 && speed <= 56.0) {
    level = 16
  } else if (speed > 56.0) {
    level = 17
  }
  return level
}
// 风力对应颜色
function getColor(speed) {
  // if (speed <= 7.9) {
  //   // 0-4级风
  //   return '#0000FE'
  //   // return '#F19303';
  // } else if (speed > 7.9 && speed <= 17.1) {
  //   // 5-7级风
  //   return '#F305EE'
  //   // return '#EE581F';
  // } else if (speed > 17.1 && speed <= 36.9) {
  //   // 8-12级风
  //   return '#820040'
  //   // return '#C20003';
  // } else {
  //   // 13-17级风
  //   return '#50000F'
  // }
  // console.log(colorObj)
  let color = '000'
  if (speed <= colorObj.legendValues[0]) {
    color = colorObj.colorValues[0]
  }
  for (let i = 0; i < colorObj.legendValues.length - 1; i++) {
    if (speed <= colorObj.legendValues[0]) {
      color = colorObj.colorValues[0]
      break
    } else if (speed > colorObj.legendValues[i] && speed <= colorObj.legendValues[i + 1]) {
      color = colorObj.colorValues[i]
      break
    } else if (speed >= colorObj.legendValues[colorObj.legendValues.length - 1]) {
      color = colorObj.colorValues[colorObj.legendValues.length - 1]
      break
    }
  }
  return color
}
// 风速 由海里转化为米
function toMile(speed) {
  return Number(speed) * 1852 / 3600
}

export function getCurrentExtent(earth) {
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
    extent.yMax = Cesium.Math.toDegrees(carto_lt.latitude) + 5
    extent.xMax = Cesium.Math.toDegrees(carto_rb.longitude) + 5
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
  // console.log(extent)
  // console.log(window.demin)

  if (window.demin === '2D') {
    // 摄像机位置
    const cam = earth.camera
    const campos = ellipsoid.cartesianToCartographic(cam.position)
    let camlon = Cesium.Math.toDegrees(campos.longitude)
    camlon < 0 ? camlon += 360 : camlon
    const camlat = Cesium.Math.toDegrees(campos.latitude)
    if (!car3_lt && !car3_rb) { // 左上角、右下角都不在球上，设置范围 lon(120度范围) lat(100度范围)
      extent.xMin = camlon - 60
      extent.xMin = extent.xMin < 0 ? extent.xMin + 360 : extent.xMin
      extent.xMax = camlon + 60
      extent.xMax = extent.xMax > 360 ? extent.xMax - 360 : extent.xMax
      extent.yMin = camlat - 50
      extent.yMin = extent.yMin < -75 ? -75 : extent.yMin
      extent.yMax = camlat + 50
      extent.yMax = extent.yMax > 75 ? 75 : extent.yMax
    } else {
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
    }
  }
  //   //获取当前地图范围
  //   let Rectangle = earth.camera.computeViewRectangle(ellipsoid)
  //   //地理坐标（弧度）转经纬度坐标
  //   extent.xMin = Rectangle.west / Math.PI * 180
  //   extent.xMax = Rectangle.east / Math.PI * 180
  //   extent.yMin = Rectangle.south / Math.PI * 180
  //   extent.yMax = Rectangle.north / Math.PI * 180
  //   // extent = [Rectangle.west / Math.PI * 180, Rectangle.south / Math.PI * 180, Rectangle.east / Math.PI * 180, Rectangle.north / Math.PI * 180]
  // }
  return extent
}

let colorObj = {}

/**
 * 风羽的canvas绘制
 * @param {*} viewer
 * @param {风羽数据} windlist
 * @param {canvas放缩} windScale
 * @param {抽稀纬度值} latOffset
 * @param {抽稀经度值} lngOffset
 * @param {视口范围} extent
 * @param {风羽参数} options
 */
export function windCanvas(viewer, windlist, windScale, latOffset, lngOffset, extent, options, colorobj) {
  colorObj = colorobj
  var canvas = document.createElement('canvas')
  // canvas.width = 70 * windScale
  // canvas.height = 50 * windScale
  extent.xMin = Math.floor(extent.xMin)
  extent.xMax = Math.floor(extent.xMax)
  extent.yMin = Math.floor(extent.yMin)
  extent.yMax = Math.floor(extent.yMax)
  canvas.width = (extent.xMax - extent.xMin) * windScale
  canvas.height = (extent.yMax - extent.yMin) * windScale
  // console.log('canvas---------------------')
  // console.log(canvas.width)
  // console.log(canvas.height)
  const ctx = canvas.getContext('2d')
  // for (let i = 100; i < 150; i += latOffset) {
  //   for (let j = 60; j < 130; j += lngOffset) {
  // 返回的数据 0~180   extent纬度是 -90~90
  for (let i = extent.yMin + 90; i < extent.yMax + 90; i += latOffset) {
    for (let j = extent.xMin; j < extent.xMax; j += lngOffset) {
      const arr = windlist[i][j].split(',')
      const lon = j
      // lon >= 90 ? lon = 90 - lon : lon
      const lat = i - 90
      const latlng = { lon, lat }
      const speed = toMile(parseFloat(arr[0])) // 风速
      const level = getLevel(speed) // 风级
      const color = getColor(speed) // 颜色
      let dir = parseFloat(arr[1]) - 180
      // dir = getDir(speed, dir) // 角度
      const windObj = new Wind(latlng, speed, dir, color, level, options)
      drawWind(ctx, windObj, windScale, extent.xMin, extent.yMax)
      // drawWind(ctx, item, 50, xMin, yMax)
    }
  }
  // canvas.toBlob(function (blob) {
  //     var a = document.createElement('a')
  //     var body = document.getElementsByTagName('body')
  //     document.body.appendChild(a)
  //     a.download = 'img' + '.jpg'
  //     a.href = window.URL.createObjectURL(blob)

  //     a.click()
  //     document.body.removeChild('a')
  // })
  return canvas
}

/**
 * 风图标绘制
 * @param {canvas绘制对象} ctx
 * @param {风参数对象} WindObj
 */
function drawWind(ctx, WindObj, scale, xMin, yMax) {
  // console.time('drawWind');
  var startPoint = toScreen(WindObj.latlng.lon, WindObj.latlng.lat, scale, xMin, yMax) // 返回与给定地理坐标系相符的地图容器的点   经纬度转屏幕坐标
  var len = WindObj.options.windLineLen // 风向线长度 16
  var r = WindObj.options.levelLineMinLen // 风力线长度 4
  var arc = Math.PI / 180 * WindObj.dir // 旋转角
  var a = startPoint.x
  var b = startPoint.y
  var x0 = a
  var y0 = b - len // 长边点(x0, y0)
  // 计算第三个点  短边点
  var endPoint = {
    x: a + (x0 - a) * Math.cos(arc) - (y0 - b) * Math.sin(arc),
    y: b + (x0 - a) * Math.sin(arc) + (y0 - b) * Math.cos(arc)
  }
  var level = WindObj.level // 根据风速设置风级   横杠个数
  var floorLevel = Math.floor(level / 8)
  var color = WindObj.color

  var count8 = floorLevel // 8级个数  三角代表8级
  var count2 = Math.floor(level % 8 / 2) // 2级个数
  var count1 = level % 2 === 0 ? 0 : 1 // 1级个数
  var count = WindObj.options.chunkCount // 等分点个数

  ctx.save()
  ctx.beginPath()
  if (count8 === 0 && count2 === 0 && count1 === 0) {
    ctx.arc(startPoint.x, startPoint.y, r, 0, Math.PI * 2)
  } else {
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    // 8 级
    for (let i = 0; i < count8; i++) {
      const sp = getChunkPoint(startPoint, endPoint, count, 2 * i + 1)
      const sp2 = getChunkPoint(startPoint, endPoint, count, 2 * i + 1 + 2)
      const lp = getPointByDistance(startPoint, sp, r * 2)
      // ctx.moveTo(sp.x, sp.y)
      // ctx.lineTo(lp.x, lp.y)
      // ctx.lineTo(sp2.x, sp2.y)
      let point = []
      point.x = sp.x + (lp.x - sp.x) * Math.cos(Math.PI / 180 * -30) - (lp.y - sp.y) * Math.sin(Math.PI / 180 * -30)
      point.y = sp.y + (lp.x - sp.x) * Math.sin(Math.PI / 180 * -30) + (lp.y - sp.y) * Math.cos(Math.PI / 180 * -30)
      ctx.moveTo(sp.x, sp.y)
      ctx.lineTo(point.x, point.y)
      ctx.lineTo(sp2.x, sp2.y)
    }
    // 2级
    for (let i = 0; i < count2; i++) {
      const sp = getChunkPoint(startPoint, endPoint, count, 2 * count8 + 1 + i)
      const lp = getPointByDistance(startPoint, sp, r * 2)
      // ctx.moveTo(sp.x, sp.y)
      // ctx.lineTo(lp.x, lp.y)
      let point = []
      point.x = sp.x + (lp.x - sp.x) * Math.cos(Math.PI / 180 * -30) - (lp.y - sp.y) * Math.sin(Math.PI / 180 * -30)
      point.y = sp.y + (lp.x - sp.x) * Math.sin(Math.PI / 180 * -30) + (lp.y - sp.y) * Math.cos(Math.PI / 180 * -30)
      ctx.moveTo(sp.x, sp.y)
      ctx.lineTo(point.x, point.y)
    }
    // 1级
    for (let i = 0; i < count1; i++) {
      const sp = getChunkPoint(startPoint, endPoint, count, 2 * count8 + 1 + count2 + i)
      const lp = getPointByDistance(startPoint, sp, r)
      // ctx.moveTo(sp.x, sp.y)
      // ctx.lineTo(lp.x, lp.y)
      let point = []
      point.x = sp.x + (lp.x - sp.x) * Math.cos(Math.PI / 180 * -30) - (lp.y - sp.y) * Math.sin(Math.PI / 180 * -30)
      point.y = sp.y + (lp.x - sp.x) * Math.sin(Math.PI / 180 * -30) + (lp.y - sp.y) * Math.cos(Math.PI / 180 * -30)
      ctx.moveTo(sp.x, sp.y)
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.strokeStyle = color
  ctx.closePath()
  ctx.stroke()
  // ctx.restore()
  // console.timeEnd('drawWind');
}

// 进行屏幕映射
function toScreen(px, py, scale, xMin, yMax) {
  const sx = parseInt(((px.toFixed(6) - xMin) * scale))
  const sy = parseInt(((yMax - py.toFixed(6)) * scale))
  const sxy = { x: sx, y: sy }
  return sxy
}

// 取一条线的 count 等分点的第number(1,2,3...)个点，从endPoint开始计数。
function getChunkPoint(startPoint, endPoint, count, number) {
  var points = []
  var xn, yn
  points.push(startPoint)
  for (let i = 1; i < count; i++) {
    xn = startPoint.x + i * (endPoint.x - startPoint.x) / count
    yn = startPoint.y + i * (endPoint.y - startPoint.y) / count
    const point = []
    point.x = xn
    point.y = yn
    points.push(point)
  }
  points.push(endPoint)
  points = points.reverse()
  return points[number - 1]
}

function getPointByDistance(sp, ep, r) {
  var x, y
  var point = []
  var k = (ep.y - sp.y) / (ep.x - sp.x)
  var r2 = Math.pow(r, 2)
  var k2 = Math.pow(k, 2)
  // 不同坐标系符号问题
  if (ep.x > sp.x) {
    if (ep.y < sp.y) {
      x = ep.x + Math.sqrt((r2 * k2) / (1 + k2))
      y = ep.y + Math.sqrt(r2 / (1 + k2))
    } else {
      x = ep.x - Math.sqrt((r2 * k2) / (1 + k2))
      y = ep.y + Math.sqrt(r2 / (1 + k2))
    }
  } else if (ep.x < sp.x) {
    if (ep.y > sp.y) {
      x = ep.x - Math.sqrt((r2 * k2) / (1 + k2))
      y = ep.y - Math.sqrt(r2 / (1 + k2))
    } else {
      x = ep.x + Math.sqrt((r2 * k2) / (1 + k2))
      y = ep.y - Math.sqrt(r2 / (1 + k2))
    }
  } else {
    if (ep.y > sp.y) {
      x = ep.x - r
      y = ep.y
    } else {
      x = ep.x + r
      y = ep.y
    }
  }
  point.x = x
  point.y = y
  return point
}
