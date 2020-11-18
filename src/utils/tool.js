import eventBus from '@/utils/eventBus.js'
class Tool {
  constructor(viewer) {
    this.unit = undefined
    this.barWidth = 106
    this.distanceLabel = 1000

    this.viewer = viewer
    this.scene = this.viewer.scene
    this.camera = this.viewer.camera

    this.setupEventListeners()
  }

  setupEventListeners() {
    const that = this

    var ellipsoid = that.scene.globe.ellipsoid
    // console.log(ellipsoid)
    var handler = new Cesium.ScreenSpaceEventHandler(that.scene.canvas)
    handler.setInputAction(movement => {
      var cartesian = that.camera.pickEllipsoid(movement.endPosition, ellipsoid)
      if (cartesian) {
        var cartographic = that.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
        var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
        var lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
        // 经纬度格式化
        var latdegree = Math.abs(parseInt(lat))
        var latminute = parseInt(((Math.abs(lat) - latdegree) * 60))
        var latsecond = parseInt((((Math.abs(lat) - latdegree) * 60) - latminute) * 60)
        lat =
        lat < 0
          ? latdegree + '°' + latminute + '′' + latsecond + '″' + 'S'
          : latdegree + '°' + latminute + '′' + latsecond + '″' + 'N'
        // console.log(lat)
        var lngdegree = Math.abs(parseInt(lng))
        var lngminute = parseInt(((Math.abs(lng) - lngdegree) * 60))
        var lngsecond = parseInt((((Math.abs(lng) - lngdegree) * 60) - lngminute) * 60)
        lng =
        lng < 0
          ? lngdegree + '°' + lngminute + '′' + lngsecond + '″' + 'W'
          : lngdegree + '°' + lngminute + '′' + lngsecond + '″' + 'E'

        var event = new CustomEvent('pickPosition', { detail: {
          lat: lat,
          lng: lng
        }
        })
        setTimeout(window.dispatchEvent(event), 500)
        // console.log(that.scene)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.scene.postRender.addEventListener(function() {
      eventBus.$on('getUnit', messege => {
        // console.log(messege)
        that.unit = messege.unit
      })
      // console.log(that.unit)
      var geodesic = new Cesium.EllipsoidGeodesic()
      var distances = [
        1,
        2,
        3,
        5,
        10,
        20,
        30,
        50,
        100,
        200,
        300,
        500,
        1000,
        2000,
        3000,
        5000,
        10000,
        20000,
        30000,
        50000,
        100000,
        200000,
        300000,
        500000,
        1000000,
        2000000,
        3000000,
        5000000,
        10000000,
        20000000,
        30000000,
        50000000
      ]
      // Find the distance between two pixels at the bottom center of the screen.
      const width = that.scene.canvas.clientWidth
      const height = that.scene.canvas.clientHeight

      const left = that.scene.camera.getPickRay(
        new Cesium.Cartesian2((width / 2) | 0, height - 1)
      )
      const right = that.scene.camera.getPickRay(
        new Cesium.Cartesian2((1 + width / 2) | 0, height - 1)
      )

      const globe = that.scene.globe
      const leftPosition = globe.pick(left, that.scene)
      const rightPosition = globe.pick(right, that.scene)

      if (!Cesium.defined(leftPosition) || !Cesium.defined(rightPosition)) {
        return
      }

      const leftCartographic = globe.ellipsoid.cartesianToCartographic(
        leftPosition
      )
      const rightCartographic = globe.ellipsoid.cartesianToCartographic(
        rightPosition
      )

      geodesic.setEndPoints(leftCartographic, rightCartographic)
      const pixelDistance = geodesic.surfaceDistance
      // console.log(pixelDistance)

      // Find the first distance that makes the scale bar less than 100 pixels.
      const maxBarWidth = 106
      let distance
      for (
        let i = distances.length - 1;
        !Cesium.defined(distance) && i >= 0;
        --i
      ) {
        if (distances[i] / pixelDistance < maxBarWidth) {
          distance = distances[i]
        }
      }

      if (Cesium.defined(distance)) {
        // var label =
        //   distance >= 1000
        //     ? (distance / 1000).toString() + ' km'
        //     : distance.toString() + ' m'
        var label
        if (that.unit) {
          label =
              that.unit === 'nmi'
                ? parseInt((distance / 1852)).toString() + that.unit
                : (distance / 1000).toString() + that.unit
          // label = (distance / 1000).toString() + that.unit
        } else {
          label = (distance / 1000).toString() + ' km'
        }
        // if (that.unit === 'nmi') {
        //   that.barWidth = (distance / pixelDistance / 1.852) | 0
        // }
        that.barWidth = (distance / pixelDistance) | 0
        that.distanceLabel = label
      } else {
        that.barWidth = 106
        that.distanceLabel = 1000
      }
      var event = new CustomEvent('getScale', { detail: {
        barWidth: that.barWidth,
        distanceLabel: that.distanceLabel
      }
      })
      setTimeout(window.dispatchEvent(event), 500)
    })

    // this.camera.moveEnd.addEventListener(function() {
    //   console.log('moveEnd')
    //   var tilesToRender = that.scene.globe._surface._tilesToRender
    //   if (tilesToRender.length) {
    //     tilesToRender.forEach(element => {
    //       if (window._level && window._level < element._level) {
    //         window._level = element._level
    //       } else {
    //         window._level = element._level
    //       }
    //     })

    //     var event = new CustomEvent('earthLevelChanged', { detail: {
    //       level: window._level
    //     }
    //     })
    //     setTimeout(window.dispatchEvent(event), 500)
    //   }
    //   // if (moveStart && that.display) {
    //   //   that.updateViewerParameters()
    //   //   that.particleSystem.viewerParametersResize(that.scene.context, that.viewerParameters)
    //   //   moveStart = false
    //   //   that.addPrimitives()
    //   //   that.primitivelist.show = true
    //   //   that.scene.primitives.show = true
    //   // }
    // })
  }
}

export default Tool
