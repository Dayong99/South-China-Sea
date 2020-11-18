import ParticleSystem from '@/utils/particleSystem'
import {
  viewRectangleToLonLatRange
} from '@/utils/windutil'
import {
  loadText,
  fileOptions
} from '@/utils/windutil'
import eventBus from '@/utils/eventBus.js'

class Wind3D {
  constructor(viewer) {
    // this.unit = undefined
    // this.barWidth = 106
    // this.distanceLabel = 1000
    this.primitivelist = null
    this.parameter = {
      particlesTextureSize: 126,
      maxParticles: 15000,
      particleHeight: 100,
      fadeOpacity: 0.964,
      dropRate: 0.003,
      dropRateBump: 0.01,
      speedFactor: 4,
      lineWidth: 3
      // particlesTextureSize: 100,
      // maxParticles: 10000,
      // particleHeight: 100,
      // fadeOpacity: 0.964,
      // dropRate: 0.003,
      // dropRateBump: 0.01,
      // speedFactor: 1,
      // lineWidth: 1
    }
    this.display = false
    this.parameter.particlesTextureSize = Math.ceil(Math.sqrt(this.parameter.maxParticles))
    this.parameter.maxParticles = this.parameter.particlesTextureSize * this.parameter.particlesTextureSize

    this.viewer = viewer
    this.scene = this.viewer.scene
    this.camera = this.viewer.camera
    this.data = {}

    this.viewerParameters = {
      lonRange: new Cesium.Cartesian2(),
      latRange: new Cesium.Cartesian2(),
      pixelSize: 0.0
    }
    // use a smaller earth radius to make sure distance to camera > 0
    this.globeBoundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, 0.99 * 6378137.0)
    this.updateViewerParameters()

    // this.loadData().then(
    //     (data) => {
    //         this.particleSystem = new ParticleSystem(this.scene.context, data,
    //             this.parameter, this.viewerParameters);
    //         this.addPrimitives();
    //     });

    this.setupEventListeners()
  }

  addPrimitives() {
    this.primitivelist = new Cesium.PrimitiveCollection()

    this.primitivelist.add(this.particleSystem.particlesComputing.primitives.getWind)
    this.primitivelist.add(this.particleSystem.particlesComputing.primitives.updateSpeed)
    this.primitivelist.add(this.particleSystem.particlesComputing.primitives.updatePosition)
    this.primitivelist.add(this.particleSystem.particlesComputing.primitives.postProcessingPosition)
    this.primitivelist.add(this.particleSystem.particlesComputing.primitives.postProcessingSpeed)

    this.primitivelist.add(this.particleSystem.particlesRendering.primitives.segments)
    this.primitivelist.add(this.particleSystem.particlesRendering.primitives.trails)
    this.primitivelist.add(this.particleSystem.particlesRendering.primitives.screen)
    this.scene.primitives.add(this.primitivelist)
  }

  updateViewerParameters() {
    var viewRectangle = this.camera.computeViewRectangle(this.scene.globe.ellipsoid)
    var lonLatRange = viewRectangleToLonLatRange(viewRectangle)
    this.viewerParameters.lonRange.x = lonLatRange.lon.min
    this.viewerParameters.lonRange.y = lonLatRange.lon.max
    this.viewerParameters.latRange.x = lonLatRange.lat.min
    this.viewerParameters.latRange.y = lonLatRange.lat.max

    var pixelSize = this.camera.getPixelSize(
      this.globeBoundingSphere,
      this.scene.drawingBufferWidth,
      this.scene.drawingBufferHeight
    )

    if (pixelSize > 0) {
      this.viewerParameters.pixelSize = pixelSize
    }
  }

  arrayToMap(array) {
    return array.reduce(function(map, object) {
      map[object.name] = object
      return map
    }, {})
  }

  async loadNetCDF(filePath) {
    var that = this
    return new Promise(function(resolve) {
      var request = new XMLHttpRequest()
      request.open('GET', filePath)
      // request.open('GET', "http://192.168.2.104:8301/gis/api/numericalvalue/file/u_v_component_of_wind/nc/2020-01-01/18/700");
      request.responseType = 'arraybuffer'
      request.onload = function() {
        var arrayToMap = function(array) {
          return array.reduce(function(map, object) {
            map[object.name] = object
            return map
          }, {})
        }

        var NetCDF = new netcdfjs(request.response)

        var dimensions = arrayToMap(NetCDF.dimensions)
        that.data.dimensions = {}
        that.data.dimensions.lon = dimensions['lon'].size
        that.data.dimensions.lat = dimensions['lat'].size
        that.data.dimensions.lev = dimensions['lev'].size

        that.data.lon = {}
        that.data.lon.array = new Float32Array(NetCDF.getDataVariable('lon').flat())
        that.data.lon.min = Math.min(...that.data.lon.array)
        that.data.lon.max = Math.max(...that.data.lon.array)

        that.data.lat = {}
        that.data.lat.array = new Float32Array(NetCDF.getDataVariable('lat').flat())
        that.data.lat.min = Math.min(...that.data.lat.array)
        that.data.lat.max = Math.max(...that.data.lat.array)

        that.data.lev = {}
        that.data.lev.array = new Float32Array(NetCDF.getDataVariable('lev').flat())
        that.data.lev.min = Math.min(...that.data.lev.array)
        that.data.lev.max = Math.max(...that.data.lev.array)

        that.data.U = {}
        that.data.U.array = new Float32Array(NetCDF.getDataVariable('U').flat())
        that.data.U.min = NetCDF.getDataVariable('U_min').flat()
        that.data.U.max = NetCDF.getDataVariable('U_max').flat()

        that.data.V = {}
        that.data.V.array = new Float32Array(NetCDF.getDataVariable('V').flat())
        that.data.V.min = NetCDF.getDataVariable('V_min').flat()
        that.data.V.max = NetCDF.getDataVariable('V_max').flat()

        resolve(that.data)
      }

      request.send()
    })
  }

  loadColorTable(filePath) {
    var string = loadText(filePath)
    var json = JSON.parse(string)

    var colorNum = json['ncolors']
    var colorTable = json['colorTable']

    var colorsArray = new Float32Array(3 * colorNum)
    for (var i = 0; i < colorNum; i++) {
      colorsArray[3 * i] = colorTable[3 * i]
      colorsArray[3 * i + 1] = colorTable[3 * i + 1]
      colorsArray[3 * i + 2] = colorTable[3 * i + 2]
    }

    this.data.colorTable = {}
    this.data.colorTable.colorNum = colorNum
    this.data.colorTable.array = colorsArray
  }

  async loadData() {
    var ncFilePath = fileOptions.dataDirectory + fileOptions.dataFile
    await this.loadNetCDF(ncFilePath)

    var colorTableFilePath = fileOptions.dataDirectory + 'colorTable.json'
    this.loadColorTable(colorTableFilePath)

    return this.data
  }

  paserNetCDF(response) {
    var data = {}
    var NetCDF = new netcdfjs(response)
    var dimensions = this.arrayToMap(NetCDF.dimensions)
    data.dimensions = {}
    data.dimensions.lon = dimensions['lon'].size
    data.dimensions.lat = dimensions['lat'].size
    data.dimensions.lev = dimensions['lev'].size

    data.lon = {}
    data.lon.array = new Float32Array(NetCDF.getDataVariable('lon').flat())
    data.lon.min = Math.min(...data.lon.array)
    data.lon.max = Math.max(...data.lon.array)

    data.lat = {}
    data.lat.array = new Float32Array(NetCDF.getDataVariable('lat').flat())
    data.lat.min = Math.min(...data.lat.array)
    data.lat.max = Math.max(...data.lat.array)

    data.lev = {}
    data.lev.array = new Float32Array(NetCDF.getDataVariable('lev').flat())
    data.lev.min = Math.min(...data.lev.array)
    data.lev.max = Math.max(...data.lev.array)

    data.U = {}
    data.U.array = new Float32Array(NetCDF.getDataVariable('U').flat())
    data.U.min = NetCDF.getDataVariable('U_min').flat()
    data.U.max = NetCDF.getDataVariable('U_max').flat()

    data.V = {}
    data.V.array = new Float32Array(NetCDF.getDataVariable('V').flat())
    data.V.min = NetCDF.getDataVariable('V_min').flat()
    data.V.max = NetCDF.getDataVariable('V_max').flat()
    return data
  }

  updateData(response) {
    console.log(222)
    try {
      if (this.display) {
        this.hind()
      }
      var data = this.paserNetCDF(response)
      if (!data.colorTable) {
        if (!this.data.colorTable) {
          var colorTableFilePath = fileOptions.dataDirectory + 'colorTable-blue.json'
          this.loadColorTable(colorTableFilePath)
        }
        data.colorTable = this.data.colorTable
      }

      this.particleSystem = new ParticleSystem(this.scene.context, data,
        this.parameter, this.viewerParameters)
      this.updateViewerParameters()
      this.particleSystem.viewerParametersResize(this.scene.context, this.viewerParameters)
      this.addPrimitives()
      this.primitivelist.show = true
      // this.scene.primitives.show = true
      this.display = true
    } catch (error) {
      console.log('wind3D,updateData' + error)
    }
  }

  // setData(response) {
  //     console.log('创建风场')
  //     this.display=true;
  //     var data= this.paserNetCDF(response);
  //     if (!data.colorTable) {
  //         if(!this.data.colorTable){
  //             var colorTableFilePath = fileOptions.dataDirectory + 'colorTable-spread.json';
  //             this.loadColorTable(colorTableFilePath);
  //         }
  //         data.colorTable = this.data.colorTable;
  //     }
  //     this.particleSystem = new ParticleSystem(this.scene.context, data,
  //         this.parameter, this.viewerParameters);
  //     this.updateViewerParameters();
  //     this.particleSystem.viewerParametersResize(this.scene.context, this.viewerParameters);
  //     this.addPrimitives();
  //     this.primitivelist.show = true;
  //     this.scene.primitives.show = true;
  // }

  hind() {
    try {
      if (this.display) {
        this.primitivelist.show = false
        // this.scene.primitives.show = false
        this.scene.primitives.remove(this.primitivelist)
        this.primitivelist.removeAll()
      }
    } catch (error) {
      console.log('wind3D,hind' + error)
    } finally {
      this.display = false
    }
  }

  // show() {
  //     this.display=true;
  //     this.updateViewerParameters();
  //     this.particleSystem.viewerParametersResize(this.scene.context, this.viewerParameters);
  //     this.addPrimitives();
  //     this.primitivelist.show = true;
  //     this.scene.primitives.show = true;
  // }

  setupEventListeners() {
    const that = this
    var moveStart = false

    // var ellipsoid = that.scene.globe.ellipsoid
    // console.log(ellipsoid)
    // var handler = new Cesium.ScreenSpaceEventHandler(that.scene.canvas)
    // handler.setInputAction(movement => {
    //   var cartesian = that.camera.pickEllipsoid(movement.endPosition, ellipsoid)
    //   if (cartesian) {
    //     var cartographic = that.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
    //     var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
    //     var lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
    //     // 经纬度格式化
    //     var latdegree = Math.abs(parseInt(lat))
    //     var latminute = parseInt(((Math.abs(lat) - latdegree) * 60))
    //     var latsecond = parseInt((((Math.abs(lat) - latdegree) * 60) - latminute) * 60)
    //     lat =
    //     lat < 0
    //       ? latdegree + '°' + latminute + '′' + latsecond + '″' + 'S'
    //       : latdegree + '°' + latminute + '′' + latsecond + '″' + 'N'
    //     // console.log(lat)
    //     var lngdegree = Math.abs(parseInt(lng))
    //     var lngminute = parseInt(((Math.abs(lng) - lngdegree) * 60))
    //     var lngsecond = parseInt((((Math.abs(lng) - lngdegree) * 60) - lngminute) * 60)
    //     lng =
    //     lng < 0
    //       ? lngdegree + '°' + lngminute + '′' + lngsecond + '″' + 'W'
    //       : lngdegree + '°' + lngminute + '′' + lngsecond + '″' + 'E'

    //     var event = new CustomEvent('pickPosition', { detail: {
    //       lat: lat,
    //       lng: lng
    //     }
    //     })
    //     setTimeout(window.dispatchEvent(event), 500)
    //     // console.log(that.scene)
    //   }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // this.scene.postRender.addEventListener(function() {
    //   eventBus.$on('getUnit', messege => {
    //     // console.log(messege)
    //     that.unit = messege.unit
    //   })
    //   // console.log(that.unit)
    //   var geodesic = new Cesium.EllipsoidGeodesic()
    //   var distances = [
    //     1,
    //     2,
    //     3,
    //     5,
    //     10,
    //     20,
    //     30,
    //     50,
    //     100,
    //     200,
    //     300,
    //     500,
    //     1000,
    //     2000,
    //     3000,
    //     5000,
    //     10000,
    //     20000,
    //     30000,
    //     50000,
    //     100000,
    //     200000,
    //     300000,
    //     500000,
    //     1000000,
    //     2000000,
    //     3000000,
    //     5000000,
    //     10000000,
    //     20000000,
    //     30000000,
    //     50000000
    //   ]
    //   // Find the distance between two pixels at the bottom center of the screen.
    //   const width = that.scene.canvas.clientWidth
    //   const height = that.scene.canvas.clientHeight

    //   const left = that.scene.camera.getPickRay(
    //     new Cesium.Cartesian2((width / 2) | 0, height - 1)
    //   )
    //   const right = that.scene.camera.getPickRay(
    //     new Cesium.Cartesian2((1 + width / 2) | 0, height - 1)
    //   )

    //   const globe = that.scene.globe
    //   const leftPosition = globe.pick(left, that.scene)
    //   const rightPosition = globe.pick(right, that.scene)

    //   if (!Cesium.defined(leftPosition) || !Cesium.defined(rightPosition)) {
    //     return
    //   }

    //   const leftCartographic = globe.ellipsoid.cartesianToCartographic(
    //     leftPosition
    //   )
    //   const rightCartographic = globe.ellipsoid.cartesianToCartographic(
    //     rightPosition
    //   )

    //   geodesic.setEndPoints(leftCartographic, rightCartographic)
    //   const pixelDistance = geodesic.surfaceDistance
    //   // console.log(pixelDistance)

    //   // Find the first distance that makes the scale bar less than 100 pixels.
    //   const maxBarWidth = 106
    //   let distance
    //   for (
    //     let i = distances.length - 1;
    //     !Cesium.defined(distance) && i >= 0;
    //     --i
    //   ) {
    //     if (distances[i] / pixelDistance < maxBarWidth) {
    //       distance = distances[i]
    //     }
    //   }

    //   if (Cesium.defined(distance)) {
    //     // var label =
    //     //   distance >= 1000
    //     //     ? (distance / 1000).toString() + ' km'
    //     //     : distance.toString() + ' m'
    //     var label
    //     if (that.unit) {
    //       label =
    //         that.unit === 'nmi'
    //           ? parseInt((distance / 1852)).toString() + that.unit
    //           : (distance / 1000).toString() + that.unit
    //       // label = (distance / 1000).toString() + that.unit
    //     } else {
    //       label = (distance / 1000).toString() + ' km'
    //     }
    //     // if (that.unit === 'nmi') {
    //     //   that.barWidth = (distance / pixelDistance / 1.852) | 0
    //     // }
    //     that.barWidth = (distance / pixelDistance) | 0
    //     that.distanceLabel = label
    //   } else {
    //     that.barWidth = 106
    //     that.distanceLabel = 1000
    //   }
    //   var event = new CustomEvent('getScale', { detail: {
    //     barWidth: that.barWidth,
    //     distanceLabel: that.distanceLabel
    //   }
    //   })
    //   setTimeout(window.dispatchEvent(event), 500)
    // })

    this.camera.moveStart.addEventListener(function() {
      console.log('moveStart')
      if (that.display) {
        moveStart = true
        that.primitivelist.show = false
        // that.scene.primitives.show = false
        that.scene.primitives.remove(that.primitivelist)
        that.primitivelist.removeAll()
      }
    })

    this.camera.moveEnd.addEventListener(function() {
      console.log('moveEnd')
      var tilesToRender = that.scene.globe._surface._tilesToRender
      if (tilesToRender.length) {
        tilesToRender.forEach(element => {
          if (window._level && window._level < element._level) {
            window._level = element._level
          } else {
            window._level = element._level
          }
        })

        var event = new CustomEvent('earthLevelChanged', { detail: {
          level: window._level
        }
        })
        setTimeout(window.dispatchEvent(event), 500)
      }
      if (moveStart && that.display) {
        that.updateViewerParameters()
        that.particleSystem.viewerParametersResize(that.scene.context, that.viewerParameters)
        moveStart = false
        that.addPrimitives()
        that.primitivelist.show = true
        // that.scene.primitives.show = true
      }
    })
  }
}

export default Wind3D
