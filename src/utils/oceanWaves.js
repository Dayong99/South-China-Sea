class Wave {
  /**
         * 构造函数
         * @param  {L.LatLng} latlng 经纬度
         * @param  {Number} speed  风速（海里/小时）
         * @param  {Number} dir    风向（度，正北方向为0度，顺时针）
         * @param  {Object} options    绘制选项
         * @return {Null}        [description]
         */
  constructor(latlng, dir, options = {}) {
    this.latlng = latlng
    this.dir = dir
    this.options = Object.assign({
      isDrawLeftRight: false, // 是否绘制相邻两边
      windLineLen: 20, // 箭头长度
      levelLineMinLen: 1, // 线宽
      color: '#FB0100' // 颜色
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

const colorObj = {}

/**
 * 峰波向的canvas绘制
 * @param {数据} wavelist
 * @param {canvas放缩} waveScale
 * @param {抽稀纬度值} latOffset
 * @param {抽稀经度值} lngOffset
 * @param {视口范围} extent
 * @param {参数} options
 */
export function waveCanvas(wavelist, windScale, latOffset, lngOffset, extent, options) {
//   console.log('waveCanvas')
//   console.log(extent)
  var canvas = document.createElement('canvas')
  // canvas.width = 70 * windScale
  // canvas.height = 50 * windScale
  extent.xMin = Math.floor(extent.xMin)
  extent.xMax = Math.floor(extent.xMax)
  extent.yMin = Math.floor(extent.yMin)
  extent.yMax = Math.floor(extent.yMax)
  extent.yMin = extent.yMin < -77.5 ? -77.5 : extent.yMin
  extent.yMax = extent.yMax > 77.5 ? 77.5 : extent.yMax

  canvas.width = (extent.xMax - extent.xMin) * windScale
  canvas.height = (extent.yMax - extent.yMin) * windScale
  //   console.log('canvas---------------------')
  //   console.log(canvas.width)
  //   console.log(canvas.height)
  const ctx = canvas.getContext('2d')

  // 返回数据是0~310 （77.5 ~ -77.5）  0~720
  // extent获取范围需要修正  y * 2 + 155     x * 2
  const xmin = extent.xMin * 2
  const xmax = extent.xMax * 2
  const ymin = (77.5 - extent.yMax) * 2
  const ymax = (77.5 - extent.yMin) * 2
  for (let i = ymin; i < ymax; i += latOffset) {
    for (let j = xmin; j < xmax; j += lngOffset) {
      if (wavelist[i][j] !== '') {
        const arr = wavelist[i][j].split(',')
        const lon = j / 2
        const lat = 77.5 - (i / 2)
        const latlng = { lon, lat }
        const speed = parseFloat(arr[0])
        const dir = parseFloat(arr[1]) - 180
        // dir = getDir(speed, dir) // 角度
        const waveObj = new Wave(latlng, dir, options)
        drawDirWave(ctx, waveObj, windScale, extent.xMin, extent.yMax)
      }
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
 *
 * @param {*} ctx
 * @param {对象} waveObj
 * @param {比例} scale
 * @param {最小值} xMin
 * @param {最大值} yMax
 */
function drawDirWave(ctx, waveObj, scale, xMin, yMax) {
  var startPoint = toScreen(waveObj.latlng.lon, waveObj.latlng.lat, scale, xMin, yMax) // 返回与给定地理坐标系相符的地图容器的点   经纬度转屏幕坐标
  var len = 16 // 风向线长度 16
  // var len = waveObj.options.windLineLen || 12 // 风向线长度 16
  var arc = Math.PI / 180 * waveObj.dir // 旋转角
  var a = startPoint.x
  var b = startPoint.y
  var x0 = a
  var y0 = b - len
  var x1 = a + (x0 - a) * Math.cos(arc) - (y0 - b) * Math.sin(arc)
  var y1 = b + (x0 - a) * Math.sin(arc) + (y0 - b) * Math.cos(arc)
  drawWave(ctx, a, b, x1, y1, 30, 6, 1, waveObj.options.color)
}

// 进行屏幕映射
function toScreen(px, py, scale, xMin, yMax) {
  const sx = parseInt(((px.toFixed(6) - xMin) * scale))
  const sy = parseInt(((yMax - py.toFixed(6)) * scale))
  const sxy = { x: sx, y: sy }
  return sxy
}

/**
 * 绘制箭头
 * @param  {object} ctx     canvas画布
 * @param  {Number} fromX   起始点x坐标
 * @param  {Number} fromY   起始点y坐标
 * @param  {Number} toX     终止点x坐标
 * @param  {Number} toY     终止点y坐标
 * @param  {Number} theta   箭头倾斜角度
 * @param  {Number} headlen 箭头长度
 * @param  {Number} width   线宽
 * @param  {String} color   颜色
 * @return {null}         null
 */
function drawWave(ctx, fromX, fromY, toX, toY, theta, headlen, width, color) {
  theta = typeof (theta) !== 'undefined' ? theta : 30
  headlen = typeof (theta) !== 'undefined' ? headlen : 10
  width = typeof (width) !== 'undefined' ? width : 1
  color = typeof (color) !== 'color' ? color : '#000'
  // 计算各角度和对应的P2,P3坐标
  var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
  var angle1 = (angle + theta) * Math.PI / 180
  var angle2 = (angle - theta) * Math.PI / 180
  var topX = headlen * Math.cos(angle1)
  var topY = headlen * Math.sin(angle1)
  var botX = headlen * Math.cos(angle2)
  var botY = headlen * Math.sin(angle2)
  ctx.save()
  ctx.beginPath()
  var arrowX = fromX - topX
  var arrowY = fromY - topY
  ctx.moveTo(arrowX, arrowY)
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  arrowX = toX + topX
  arrowY = toY + topY
  ctx.moveTo(arrowX, arrowY)
  ctx.lineTo(toX, toY)
  arrowX = toX + botX
  arrowY = toY + botY
  ctx.lineTo(arrowX, arrowY)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
  ctx.restore()
}
