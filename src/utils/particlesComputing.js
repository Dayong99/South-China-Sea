import { randomizeParticles, fileOptions, loadText, getFullscreenQuad, createTexture, createFramebuffer, createRawRenderState, viewRectangleToLonLatRange } from '@/utils/windutil'
import CustomPrimitive from '@/utils/customPrimitive'

class ParticlesComputing {
  constructor(context, data, userInput, viewerParameters) {
    this.createWindTextures(context, data)
    this.createParticlesTextures(context, userInput, viewerParameters, data)
    this.createComputingPrimitives(data, userInput, viewerParameters)
  }

  createWindTextures(context, data) {
    var windTextureOptions = {
      context: context,
      width: data.dimensions.lon,
      height: data.dimensions.lat * data.dimensions.lev,
      pixelFormat: Cesium.PixelFormat.LUMINANCE,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      flipY: false,
      sampler: new Cesium.Sampler({
        // the values of texture will not be interpolated
        minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
        magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
      })
    }

    this.windTextures = {
      U: createTexture(windTextureOptions, data.U.array),
      V: createTexture(windTextureOptions, data.V.array)
    }
  }

  createParticlesTextures(context, userInput, viewerParameters, data) {
    var particlesTextureOptions = {
      context: context,
      width: userInput.particlesTextureSize,
      height: userInput.particlesTextureSize,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      flipY: false,
      sampler: new Cesium.Sampler({
        // the values of texture will not be interpolated
        minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
        magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
      })
    }

    var particlesArray = randomizeParticles(userInput.maxParticles, viewerParameters, data)
    var zeroArray = new Float32Array(4 * userInput.maxParticles).fill(0)

    this.particlesTextures = {
      particlesWind: createTexture(particlesTextureOptions),

      currentParticlesPosition: createTexture(particlesTextureOptions, particlesArray),
      nextParticlesPosition: createTexture(particlesTextureOptions, particlesArray),

      currentParticlesSpeed: createTexture(particlesTextureOptions, zeroArray),
      nextParticlesSpeed: createTexture(particlesTextureOptions, zeroArray),

      postProcessingPosition: createTexture(particlesTextureOptions, particlesArray),
      postProcessingSpeed: createTexture(particlesTextureOptions, zeroArray)
    }
  }

  destroyParticlesTextures() {
    Object.keys(this.particlesTextures).forEach((key) => {
      this.particlesTextures[key].destroy()
    })
  }

  createComputingPrimitives(data, userInput, viewerParameters) {
    const dimension = new Cesium.Cartesian3(data.dimensions.lon, data.dimensions.lat, data.dimensions.lev)
    const minimum = new Cesium.Cartesian3(data.lon.min, data.lat.min, data.lev.min)
    const maximum = new Cesium.Cartesian3(data.lon.max, data.lat.max, data.lev.max)
    const interval = new Cesium.Cartesian3(
      (maximum.x - minimum.x) / (dimension.x - 1),
      (maximum.y - minimum.y) / (dimension.y - 1),
      dimension.z > 1 ? (maximum.z - minimum.z) / (dimension.z - 1) : 1.0
    )
    const uSpeedRange = new Cesium.Cartesian2(data.U.min, data.U.max)
    const vSpeedRange = new Cesium.Cartesian2(data.V.min, data.V.max)

    const that = this

    this.primitives = {
      getWind: new CustomPrimitive({
        commandType: 'Compute',
        uniformMap: {
          U: function() {
            return that.windTextures.U
          },
          V: function() {
            return that.windTextures.V
          },
          currentParticlesPosition: function() {
            return that.particlesTextures.currentParticlesPosition
          },
          dimension: function() {
            return dimension
          },
          minimum: function() {
            return minimum
          },
          maximum: function() {
            return maximum
          },
          interval: function() {
            return interval
          }
        },
        fragmentShaderSource: new Cesium.ShaderSource({
          sources: [loadText(fileOptions.glslDirectory + 'getWind.frag')]
        }),
        outputTexture: this.particlesTextures.particlesWind,
        preExecute: function() {
          // keep the outputTexture up to date
          that.primitives.getWind.commandToExecute.outputTexture = that.particlesTextures.particlesWind
        }
      }),

      updateSpeed: new CustomPrimitive({
        commandType: 'Compute',
        uniformMap: {
          currentParticlesSpeed: function() {
            return that.particlesTextures.currentParticlesSpeed
          },
          particlesWind: function() {
            return that.particlesTextures.particlesWind
          },
          uSpeedRange: function() {
            return uSpeedRange
          },
          vSpeedRange: function() {
            return vSpeedRange
          },
          pixelSize: function() {
            return viewerParameters.pixelSize
          },
          speedFactor: function() {
            return userInput.speedFactor
          }
        },
        fragmentShaderSource: new Cesium.ShaderSource({
          sources: [loadText(fileOptions.glslDirectory + 'updateSpeed.frag')]
        }),
        outputTexture: this.particlesTextures.nextParticlesSpeed,
        preExecute: function() {
          // swap textures before binding
          var temp
          temp = that.particlesTextures.currentParticlesSpeed
          that.particlesTextures.currentParticlesSpeed = that.particlesTextures.postProcessingSpeed
          that.particlesTextures.postProcessingSpeed = temp

          // keep the outputTexture up to date
          that.primitives.updateSpeed.commandToExecute.outputTexture = that.particlesTextures.nextParticlesSpeed
        }
      }),

      updatePosition: new CustomPrimitive({
        commandType: 'Compute',
        uniformMap: {
          currentParticlesPosition: function() {
            return that.particlesTextures.currentParticlesPosition
          },
          currentParticlesSpeed: function() {
            return that.particlesTextures.currentParticlesSpeed
          }
        },
        fragmentShaderSource: new Cesium.ShaderSource({
          sources: [loadText(fileOptions.glslDirectory + 'updatePosition.frag')]
        }),
        outputTexture: this.particlesTextures.nextParticlesPosition,
        preExecute: function() {
          // swap textures before binding
          var temp
          temp = that.particlesTextures.currentParticlesPosition
          that.particlesTextures.currentParticlesPosition = that.particlesTextures.postProcessingPosition
          that.particlesTextures.postProcessingPosition = temp

          // keep the outputTexture up to date
          that.primitives.updatePosition.commandToExecute.outputTexture = that.particlesTextures.nextParticlesPosition
        }
      }),

      postProcessingPosition: new CustomPrimitive({
        commandType: 'Compute',
        uniformMap: {
          nextParticlesPosition: function() {
            return that.particlesTextures.nextParticlesPosition
          },
          nextParticlesSpeed: function() {
            return that.particlesTextures.nextParticlesSpeed
          },
          lonRange: function() {
            return viewerParameters.lonRange
          },
          latRange: function() {
            return viewerParameters.latRange
          },
          randomCoef: function() {
            var randomCoef = Math.random()
            return randomCoef
          },
          dropRate: function() {
            return userInput.dropRate
          },
          dropRateBump: function() {
            return userInput.dropRateBump
          }
        },
        fragmentShaderSource: new Cesium.ShaderSource({
          sources: [loadText(fileOptions.glslDirectory + 'postProcessingPosition.frag')]
        }),
        outputTexture: this.particlesTextures.postProcessingPosition,
        preExecute: function() {
          // keep the outputTexture up to date
          that.primitives.postProcessingPosition.commandToExecute.outputTexture = that.particlesTextures.postProcessingPosition
        }
      }),

      postProcessingSpeed: new CustomPrimitive({
        commandType: 'Compute',
        uniformMap: {
          postProcessingPosition: function() {
            return that.particlesTextures.postProcessingPosition
          },
          nextParticlesSpeed: function() {
            return that.particlesTextures.nextParticlesSpeed
          }
        },
        fragmentShaderSource: new Cesium.ShaderSource({
          sources: [loadText(fileOptions.glslDirectory + 'postProcessingSpeed.frag')]
        }),
        outputTexture: this.particlesTextures.postProcessingSpeed,
        preExecute: function() {
          // keep the outputTexture up to date
          that.primitives.postProcessingSpeed.commandToExecute.outputTexture = that.particlesTextures.postProcessingSpeed
        }
      })
    }
  }
}

export default ParticlesComputing
