import geoJson from './outline'
/**
 *
 * @param {canvas宽度} width
 * @param {canvas高度} height
 * @param {点数据} data
 * @param {颜色列表} colorList
 * @param {分辨率级别} scale
 * @param {xMin} xMin
 * @param {yMax} yMax
 */
export default function getCanvas(width, height, data, colorList, scale, xMin, yMax, flag) {
    let canvas = document.getElementById('canvasMap')
    canvas.width = width * scale
    canvas.height = height * scale
    // canvas.style.display = 'block';
    const context = canvas.getContext('2d')
    context.fillStyle = 'white' // 内部使用白色，如不指定，默认为黑色
    // context.strokeStyle = '#008' // 深蓝色外边框
    // context.lineWidth = 1 // 2个像素宽
    // context.globalAlpha = 0.75// 设置透明度
    console.log('canvas')
    console.log(data)

    data.polygons.forEach((pl, index) => {
        const value = pl.LowValue
        let num = 0
        let intervals = data.intervals
        for (let i = 0; i < intervals.length; i++) {
            if (intervals[i] > value) break
            num = i
        }
        const color = colorList[num]

        // context.fillStyle = color.toCssColorString() // 内部使用白色，如不指定，默认为黑色
        context.fillStyle = color // 内部使用白色，如不指定，默认为黑色
        context.beginPath()
        pl.OutLine.PointList.forEach((point, index) => {
            if (point.X && point.Y) {
                // point.Y = 90 - point.Y
                if (flag) {
                    point.X >= 180 ? point.X -= 360 : point.X
                } else {
                    point.X > 180 ? point.X -= 360 : point.X
                }

                let sxy = toScreen(point.X, point.Y, scale, xMin, yMax)
                if (index === 0) {
                    context.moveTo(sxy.x, sxy.y)
                } else {
                    context.lineTo(sxy.x, sxy.y)
                }
            }
        })

        if (pl.HoleLines.length > 0) {
            pl.HoleLines.forEach(hole => {
                hole.PointList.forEach((point, index) => {
                    // point.Y = 90 - point.Y
                    if (flag) {
                        point.X >= 180 ? point.X -= 360 : point.X
                    } else {
                        point.X > 180 ? point.X -= 360 : point.X
                    }
                    let sxy = toScreen(point.X, point.Y, scale, xMin, yMax)
                    if (index == 0) {
                        context.moveTo(sxy[0], sxy[1])
                    } else {
                        context.lineTo(sxy[0], sxy[1])
                    }
                })
            })
        }
        context.closePath()
        context.fill()
        // context.stroke()
    })
    // canvas出图
    // canvas.toBlob(function (blob) {
    //     var a = document.createElement('a')
    //     var body = document.getElementsByTagName('body')
    //     document.body.appendChild(a)
    //     a.download = 'img' + '.jpg'
    //     a.href = window.URL.createObjectURL(blob)

    //     a.click()
    //     document.body.removeChild('a')
    // })
    clip(canvas, scale, xMin, yMax)
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

function clip(canvas, scale, xMin, yMax) {
    if (!canvas) return
    var features = geoJson.features
    var feature
    for (let i = 0, len = features.length; i < len; i++) {
        feature = features[i]
        clipFeature(feature, canvas, scale, xMin, yMax)
    }
    // return this
}
function clipFeature(feature, canvas, scale, xMin, yMax) {
    const ctx = canvas.getContext('2d')
    var coords = []
    if (feature.geometry.type === 'Polygon') {
        // let coordsObj = []
        coords = feature.geometry.coordinates[0]
        // coordsObj = MercatorLonlat(coords)
        excuteClip(coords, ctx, scale, xMin, yMax)
    } else if (feature.geometry.type === 'MultiPolygon') {
        // let coordsObj = []
        const lines = feature.geometry.coordinates
        for (let i = 0, len = lines.length; i < len; i++) {
            coords = lines[i][0]
            // coordsObj = MercatorLonlat(coords)
            excuteClip(coords, canvas, scale, xMin, yMax)
        }
        // console.log(coordsObj)
    }
}
function excuteClip(coords, canvas, scale, xMin, yMax) {
    // console.log(coords)
    const ctx = canvas.getContext('2d')
    var pt, lpt, rpt
    const p1 = []
    ctx.save()
    ctx.beginPath()
    for (let i = 0, len = coords.length; i < len; i++) {
        pt = toScreen(coords[i][0], coords[i][1], scale, xMin, yMax)
        i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
        p1.push(pt)
    }
    // console.log(p1)
    ctx.closePath()
    /* if (this.options.isClipLeftRight) {
          for (let i = 0, len = coords.length; i < len; i++) {
              // lpt = map.latLngToContainerPoint(L.latLng(coords[i][1], Number(coords[i][0]) - 360))
              lpt = toScreen(coords[i][0], coords[i][1], scale, xMin, yMax)
              i === 0 ? ctx.moveTo(lpt.x, lpt.y) : ctx.lineTo(lpt.x, lpt.y)
          }
          ctx.closePath()
          for (let i = 0, len = coords.length; i < len; i++) {
              // rpt = map.latLngToContainerPoint(L.latLng(coords[i][1], Number(coords[i][0]) + 360))
              rpt = toScreen(coords[i][0], coords[i][1], scale, xMin, yMax)
              i === 0 ? ctx.moveTo(rpt.x, rpt.y) : ctx.lineTo(rpt.x, rpt.y)
          }
          ctx.closePath()
      }*/
    ctx.clip()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
}

// 进行屏幕映射
function toScreen(px, py, scale, xMin, yMax) {
    // const scaleX = 700 / (130 - 60)
    // const scaleY = 500 / (60 - 10)
    // const sx = parseInt(((px.toFixed(4) - 60) * scaleX))
    // const sy = parseInt(((60 - py.toFixed(4)) * scaleY))
    const sx = parseInt(((px.toFixed(6) - xMin) * scale))
    const sy = parseInt(((yMax - py.toFixed(6)) * scale))
    const sxy = { x: sx, y: sy }
    // sxy = MercatorLonlat(sxy)
    return sxy
}
