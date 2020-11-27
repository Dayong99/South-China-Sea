<template>
  <div class="sideBar" id="sideBar">
    <div class="sidebar_ul">
      <!-- 温度、气压等子项 -->
      <ul class="menu_name">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          @click.stop="menuClick(index)"
        >
          <div class="menu_left">{{ item.name }}</div>
          <!-- <div :class="{ menu_right: true, bgcolor: item.flag == 1 }">
            <img :src="item.flag == 0 ? item.img : item.selectImg" />
          </div> -->
        </li>
      </ul>
      <ul class="menu_list">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          @click.stop="menuClick(index)"
        >
          <!-- <div class="menu_left" :class="{ bgcolor: item.flag == 1 }">{{ item.name }}</div> -->
          <div :class="{ menu_right: true, bgcolor: item.flag == true }">
            <img :src="item.icon" />
          </div>
        </li>
      </ul>
    </div>

    <!-- 潮汐显示 -->
    <div class="tidal"
      id="tidal"
      ref="tidal"
      :style="{'left': tidalObj.left + 'px', 'top': tidalObj.top + 'px'}"
      v-show="tidalObj.tidalShow"
      @mouseover="tidalOver(true)"
      @mouseout="tidalOver(false)">
      <div class="tidal_title">
        <div class="title_detail" ref="tidal_name">{{ tidalData.name }}</div>
        <div class="title_time">
          <img src="@/assets/images/sidebar/refresh.png">
          <span>{{ tidalData.time }}</span>
        </div>
      </div>
      <div class="tidal_content">
        <div class="content_echarts">
          <!-- ul li 替换 -->
          <!-- <div class="echarts_time">2020-10</div> -->
          <ul class="echarts_time">
            <li v-for="(item, index) in tidalData.timeList" :key="index" @click.stop="changeTimeIndex(index)" :class="{ 'li_select': index === tidalIndex }">
              <div>{{ item }}</div>
            </li>
          </ul>
          <div class="echarts_content" id="echarts_content"></div>
        </div>
        <div class="content_list">
          <ul>
            <li v-for="(item, index) in tidalData.tidalList" :key="index" :class="{ 'li_blue': index % 2 == 0, 'li_red': index % 2 != 0 }">
              <div class="list_top">
                <img :src="index % 2 == 0 ? require('@/assets/images/sidebar/bluetidal.png') : require('@/assets/images/sidebar/redtidal.png')">
                <span :class="{ 'blue': index % 2 == 0, 'red': index % 2 != 0 }">{{ item.name }}</span>
              </div>
              <div class="list_bottom">
                <div class="list_time">
                  <img src="@/assets/images/sidebar/time.png">
                  <span>潮时：</span>
                  <span>{{ item.tidalTime }}</span>
                </div>
                <div class="list_height">
                  <img src="@/assets/images/sidebar/up.png">
                  <span>潮高：</span>
                  <span>{{ item.height + 'cm' }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 层级轴 -->
    <level-bar></level-bar>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { PressureLayer } from '@/utils/pressure/ocean.weather.pressure';
import { FlowLayer } from '@/utils/pressure/ocean.weather.flow';
import { WindLayer } from '@/utils/pressure/ocean.weather.wind';

import LevelBar from '@/components/levelbar/LevelBar'
export default {
  components: {
    LevelBar: LevelBar
  },
  data() {
    return {
      firstFlag: true,
      // 菜单列表数组
      menuList: [{
        id: 0,
        img: require('@/assets/images/sidebar/temperature.png'),
        name: '温度',
        type: 'temperature',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 1,
      }, {
        id: 1,
        img: require('@/assets/images/sidebar/pressure.png'),
        name: '气压',
        type: 'pressure',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 0,
      }, {
        id: 2,
        img: require('@/assets/images/sidebar/humidity.png'),
        name: '湿度',
        type: 'humidity',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 1,
      }, {
        id: 3,
        img: require('@/assets/images/sidebar/wind.png'),
        name: '风场',
        type: 'wind',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 1,
      }, {
        id: 4,
        img: require('@/assets/images/sidebar/effectivewave.png'),
        name: '有效波高',
        type: 'visibility',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 1,
      }, {
        id: 5,
        img: require('@/assets/images/sidebar/geopotential.png'),
        name: '位势高度',
        type: 'rain',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 0,
      }, {
        id: 6,
        img: require('@/assets/images/sidebar/humidity.png'),
        name: '相对湿度',
        type: 'thunder',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 1,
      }, {
        id: 7,
        img: require('@/assets/images/sidebar/pressure.png'),
        name: '海平面气压',
        type: 'radar',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 0,
      }, {
        id: 8,
        img: require('@/assets/images/sidebar/vertical.png'),
        name: '垂直速度',
        type: 'satellite',
        flag: 0,
        stationType: true,
        gridType: false,
        mutex: 0,
      }],
      // 当前选中的所有要素集合
      currentItemList: [],
      // 当前选中的一个要素
      currentItem: null,
      // 当前选中的一个要素的层级
      currentLevel: null,
      // 线集合
      lineList: [],
      // 图层集合
      layerList: [],
      // 范围数组
      extentList: [],
      // 海流图层
      waveLayer: null,
      // 风羽图层
      windLayer: null,
      // 图层个数
      layerNum: null,

      // 潮汐面板显隐
      tidalObj: {
        // 面板显隐
        tidalShow: false,
        // 定位 left、top
        left: null,
        top: null,
      },
      // 面板数据
      tidalData: {
        time: null,
        name: null,
        timeList: [],
        tidalList: []
      },
      // 图表数据
      tidalCharts: {
        xdata: [],
        ydata: [],
      },
      tidalChart: null,
      // 屏幕宽高数据
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      // 潮汐面板选择时间
      tidalIndex: 2,
      // 潮汐图标
      tidalIcon: null,
      tidalSelectIcon: null,
      tidalMarker: [],
      markerId: null,
    };
  },
  computed: {
    ...mapState({
      // 范围
      extent: state => JSON.parse(JSON.stringify(state.earth.extent)),
      // 时间
      time: state => state.time.time,
      // 当前层级
      nowLevel: state => state.sideBar.nowLevel,
      // 重绘次数
      imageLayerNum: state => state.earth.imageLayerNum,
    }),
  },
  watch: {
    imageLayerNum(val, old) {
      this.layerNum = val
    },
    // 当前要素列表的变化
    currentItemList: {
      handler(val, oldval) {
        this.setMenuItemList(this.currentItemList)
        console.log('currentItemList', this.currentItemList)
        // 测试marker
        // this.createMarker()
      },
      deep: true
    },
    // 当前要素的变化
    currentItem: {
      handler(val, old) {
        // this.drawItem()
      }
    },
    // 范围数组的变化
    extent: {
      // async handler(val, old) {
      async handler(val, old) {
        console.log('val', val)
        console.log('old', old)
        // flag 为 true 需要重绘
        let flag = true

        if(old === null || val.length !== old.length) {
          flag = true
        } else {
          for(let i = 0; i < val.length; i++) {
            if(val[i].xMin === old[i].xMin && val[i].xMax === old[i].xMax && val[i].yMin === old[i].yMin && val[i].yMax === old[i].yMax) {
              flag = false
              break;
            }
          }
        }
        if(flag) {
          this.layerNum -= 1
          this.extentList = val
          await this.drawItemList()
          await this.setImageLayerNum(this.layerNum)
        }
        
        
        // 图层数减一
        // this.layerNum -= 1
        // this.extentList = val
        // await this.drawItemList()
        // await this.setImageLayerNum(this.layerNum)
      },
      deep: true
    },
    // 层级变化
    nowLevel(newval) {
      // 最近的层级 作为缓存，删除当前要素之后 显示前一个要素的绘制层级
      this.currentItemList[this.currentItemList.length - 1].currentLevel = newval
      this.currentLevel = newval
      this.clearLayer(this.currentItem)
      this.drawItem()
    },
    // 监听时间
    time(newval) {
      console.log(newval)
    },
  },
  created() {
    this.initMenuList()
  },
  mounted() {
    // 初始化图表
    this.tidalChart = this.$echarts.init(document.getElementById("echarts_content"))
    // 初始化潮汐图标
    this.tidalIcon = this.$utilsMap.createIcon({
      iconUrl: require('@/assets/images/sidebar/station.png'),
      iconSize: [45, 45],
      popupAnchor: [40, 40]
    })
    this.tidalSelectIcon = this.$utilsMap.createIcon({
      iconUrl: require('@/assets/images/sidebar/selectStation.png'),
      iconSize: [45, 45],
      popupAnchor: [40, 40]
    })

    const that = this
    window.onresize = () => {
      return (() => {
        // window.fullWidth = document.documentElement.offsetWidth
        // window.fullHeight = document.documentElement.offsetHeight
        window.fullWidth = document.documentElement.clientWidth
        window.fullHeight = document.documentElement.clientHeight
        that.screenWidth = window.fullWidth
        that.screenHeight = window.fullHeight
      })()
    }
  },
  methods: {
    ...mapMutations({
      setMenuItemList: 'sideBar/setMenuItemList',
      setLevelList: 'sideBar/setLevelList',
      setImageLayerNum: 'earth/setImageLayerNum',
    }),
    // 潮汐面板日期切换
    changeTimeIndex(i) {
      this.tidalIndex = i
      let time = this.tidalData.timeList[i]
      let date = new Date()
      let year = date.getFullYear()
      let t = year + '-' + time
      this.getTidalData(this.markerId, t)
    },
    // 鼠标在面板上移入移出控制面板显隐
    tidalOver(flag) {
      this.tidalObj.tidalShow = flag
      // 考虑id替换
      let marker = this.tidalMarker.filter(item => {
        return item.name == this.$refs.tidal_name.innerText
      })
      console.log('this.$refs.tidal', this.$refs.tidal_name.innerText)
      if(flag) {
        marker[0].setIcon(this.tidalSelectIcon)
      } else {
        // this.clearChart()
        // this.createChart(this.tidalCharts)
        marker[0].setIcon(this.tidalIcon)
      }
    },
    // 初始选中
    initMenuList() {
      /**
       * type: 数据源类型   0--EC  1--GFS
       */
      this.$get('/api/parameters/get_type', {
        type: 0
      }).then(res => {
        if(res.status == 200) {
          this.menuList = []
          res.data.data.forEach(item => {
            let obj = {
              id: item.id,
              flag: false,
              icon: item.iconImage,
              dataSource: item.type,
              name: item.parameterName,
              parameterMark: item.parameterMark,
              legendId: item.legendId,
              mutex: item.dataGroup,
              level: [],
              grade: null,
              gridSize: item.gridSize,
              xMin: null,
              xMax: null,
              yMin: null,
              yMax: null,
              units: item.units,
              drawType: item.drawType,
              currentLevel: null,
            }
            // 处理level
            let level = item.parameterStep.split(',')
            level.forEach(item => {
              obj.level.push(Number(item))
            })
            obj.currentLevel = Number(level[0])
            // 处理经纬度范围
            let lat = item.latRange.split(',')
            obj.yMin = lat[1]
            obj.yMax = lat[0]
            let lon = item.lonRange.split(',')
            obj.xMin = lon[0]
            obj.xMax = lon[1]
            // 处理格点数据抽稀
            let gradesize = 0
            if(item.gridSize == 0.125) {
              gradesize = 8
            } else if(item.gridSize == 0.25) {
              gradesize = 4
            } else{
              gradesize = 0
            }
            obj.grade = gradesize
            this.menuList.push(obj)
          })
        }
        console.log('数据源', this.menuList)
        this.menuList[0].flag = true
        this.currentItemList.push(this.menuList[0])
        this.currentItem = this.menuList[0]
        this.currentLevel = this.menuList[0].currentLevel
        this.setLevelList(this.menuList[0].level)
        // 首次加载绘制默认选中的要素
        this.drawItem()
      }).catch(error => {
        this.$message.error("获取数据源数据失败")
      })
    },
    // 要素选择
    menuClick(index) {
      // 选中状态时取消选中
      if(this.menuList[index].flag) {
        // 清除单个
        this.clearLayer(this.menuList[index])
        // 海流和风用同一个清除方法
        if(this.menuList[index].drawType === 'point_flow' || this.menuList[index].drawType === 'point_wind') {
          this.clearWindWave(this.menuList[index])
        }

        // 取消状态、重置最近缓存的level
        this.menuList[index].flag = false
        this.menuList[index].currentLevel = this.menuList[index].level[0]
        let i = this.currentItemList.findIndex(item => {
          return item.id == this.menuList[index].id
        })
        if(i != -1) {
          this.currentItemList.splice(i, 1)
        }
        // 当前要素设置为当前要素列表中的最后一个
        if(this.currentItemList.length) {
          this.currentItem = this.currentItemList[this.currentItemList.length - 1]
          this.currentLevel = this.currentItemList[this.currentItemList.length - 1].level[0]
          this.setLevelList(this.currentItemList[this.currentItemList.length - 1].level)
        } else{
          this.currentItem = null
          this.currentLevel = null
          this.setLevelList([])
        }
      } else {
        // 互斥元素添加
        if(this.menuList[index].mutex) {
          // 当前选中的要素中找到前一个互斥的要素
          let i = this.currentItemList.findIndex(item => {
            return item.mutex == 1
          })
          // 所有的要素中找到前一个互斥的要素
          let j = this.menuList.findIndex(item => {
            return item.mutex && item.flag
          })
          // 只需要判断 i，currentItemList有menulist一定有
          if(i != -1) {
            // 清除前一个互斥的要素及色斑图
            this.clearLayer(this.menuList[j])
            this.menuList[j].flag = false
            this.currentItemList.splice(i, 1)
          }
          this.menuList[index].flag = true
          this.currentItemList.push(this.menuList[index])
        } else {
          this.menuList[index].flag = true
          this.currentItemList.push(this.menuList[index])
        }
        // 当前要素设置为当前要素列表中的最后一个
        this.currentItem = this.currentItemList[this.currentItemList.length - 1]
        this.currentLevel = this.currentItemList[this.currentItemList.length - 1].level[0]
        this.setLevelList(this.currentItemList[this.currentItemList.length - 1].level)

        // 绘制当前选中的要素
        this.drawItem()
      }

      // 当前要素设置为当前要素列表中的最后一个
      // this.currentItem = this.currentItemList[this.currentItemList.length - 1]
      // this.currentLevel = this.currentItemList[this.currentItemList.length - 1].level[0]

    },
    // createMarker() {
    //   let icon = this.$utilsMap.createIcon({
    //     iconUrl: require('@/assets/images/sidebar/station.png')
    //   })
    //   let marker = this.$utilsMap.createMarkerByLatlng(window.map, [25, 120], {
    //     icon: icon,
    //     title: '测试'
    //   })
    //   marker.on('mouseover', ev => {
    //     console.log('mouseover')
    //   })
    //   console.log('-----------------------');
    //   // marker.addTo(map)
    // },
    // 绘制单个要素
    drawItem() {
      if(this.currentItem.drawType == 'point_flow') {
        this.getAndDrawWave(this.currentItem)
      } else if(this.currentItem.drawType == 'point_wind') {
        this.getAndDrawWind(this.currentItem)
      } else if(this.currentItem.drawType == 'point') {
        this.getAndDrawTidal(this.currentItem)
      } else {
        // // 需要根据每个要素自带的限制范围进行范围约束
        // let itemExtentList = []
        // if(this.currentItem.xMax > 180) {
        //   let ex1 = {
        //     xMin: this.currentItem.xMin,
        //     xMax: 180,
        //     yMin: this.currentItem.yMin,
        //     yMax: this.currentItem.yMax
        //   }
        //   let ex2 = {
        //     xMin: -180,
        //     xMax: this.currentItem.xMax - 360,
        //     yMin: this.currentItem.yMin,
        //     yMax: this.currentItem.yMax
        //   }
        //   itemExtentList.push(ex1)
        //   itemExtentList.push(ex2)
        // } else {
          
        // }



        let itemExtent = {
          xMin: null,
          xMax: null,
          yMin: null,
          yMax: null
        }
        itemExtent.xMin = this.currentItem.xMin
        itemExtent.xMax = this.currentItem.xMax
        itemExtent.yMin = this.currentItem.yMin
        itemExtent.yMax = this.currentItem.yMax
        // 存放不在要素范围内的 extentList 中的项
        let otherList = []
        // 深拷贝，范围是列表中所有数据共用的
        let extentList = this._.cloneDeep(this.extentList)
        extentList.forEach((item, index) => {
          // 最小范围大于最大范围，直接赋值
          if(item.xMin >= itemExtent.xMax) {
            otherList.push(item)
          } else if(item.xMax <= itemExtent.xMin) {
            otherList.push(item)
          } else if(item.yMin >= itemExtent.yMax) {
            otherList.push(item)
          } else if(item.yMax <= itemExtent.yMin) {
            otherList.push(item)
          } else {
            extentList[index].xMin = Number(itemExtent.xMin) > Number(item.xMin) ? Number(itemExtent.xMin) : Number(item.xMin)
            extentList[index].xMax = Number(itemExtent.xMax) < Number(item.xMax) ? Number(itemExtent.xMax) : Number(item.xMax)
            extentList[index].yMin = Number(itemExtent.yMin) > Number(item.yMin) ? Number(itemExtent.yMin) : Number(item.yMin)
            extentList[index].yMax = Number(itemExtent.yMax) < Number(item.yMax) ? Number(itemExtent.yMax) : Number(item.yMax)
          }
        })

        // 删除不用的 extent 数据
        otherList.forEach((item, index) => {
          let i = extentList.findIndex(item1 => {
            return item1 == item
          })
          extentList.splice(i, 1)
        })
        // 色斑图按照 -180~180 请求，
        if(this.currentItem.drawType == 'layer') {
          extentList.forEach((item, index) => {
            if(item.xMax > 180) {
              extentList[index].xMin -= 360
              extentList[index].xMax -= 360
            }
          })
        }
        extentList.forEach(item => {
          this.clearLayer(this.currentItem)
          if(this.currentItem.drawType == 'line') {
            this.getAndDrawLine(this.currentItem, item)
          } else if(this.currentItem.drawType == 'layer') {
            this.getAndDrawLayer(this.currentItem, item)
          }
        })
        console.log('extentList', extentList);
      }
    },
    // 循环绘制当前要素列表的要素
    drawItemList() {
      // 循环所有元素，根据每个元素的范围给视口范围进行调整
      this.currentItemList.forEach(currentItem => {
        let itemExtent = {
          xMin: null,
          xMax: null,
          yMin: null,
          yMax: null
        }
        itemExtent.xMin = currentItem.xMin
        itemExtent.xMax = currentItem.xMax
        itemExtent.yMin = currentItem.yMin
        itemExtent.yMax = currentItem.yMax
        let otherList = []
        // 深拷贝，范围是列表中所有数据共用的
        let extentList = this._.cloneDeep(this.extentList)
        extentList.forEach((item, index) => {
          // 最小范围大于最大范围，直接赋值
          if(item.xMin >= itemExtent.xMax) {
            otherList.push(item)
          } else if(item.xMax <= itemExtent.xMin) {
            otherList.push(item)
          } else if(item.yMin >= itemExtent.yMax) {
            otherList.push(item)
          } else if(item.yMax <= itemExtent.yMin) {
            otherList.push(item)
          } else {
            extentList[index].xMin = Number(itemExtent.xMin) > Number(item.xMin) ? Number(itemExtent.xMin) : Number(item.xMin)
            extentList[index].xMax = Number(itemExtent.xMax) < Number(item.xMax) ? Number(itemExtent.xMax) : Number(item.xMax)
            extentList[index].yMin = Number(itemExtent.yMin) > Number(item.yMin) ? Number(itemExtent.yMin) : Number(item.yMin)
            extentList[index].yMax = Number(itemExtent.yMax) < Number(item.yMax) ? Number(itemExtent.yMax) : Number(item.yMax)
          }
        })

        otherList.forEach((item, index) => {
          let i = extentList.findIndex(item1 => {
            return item1 == item
          })
          extentList.splice(i, 1)
        })
        if(currentItem.drawType === 'layer') {
          extentList.forEach((item, index) => {
            if(item.xMax > 180) {
              extentList[index].xMin -= 360
              extentList[index].xMax -= 360
            }
          })
        }
        extentList.forEach(item => {
          this.clearLayer(currentItem)
          if(currentItem.drawType == 'line') {
            this.getAndDrawLine(currentItem, item)
          } else if(currentItem.drawType == 'layer') {
            // this.clearLayer(item)
            this.getAndDrawLayer(currentItem, item)
          }
        })
        console.log(extentList)
      })

      // this.extentList.forEach(item => {
      //   this.currentItemList.forEach(item1 => {
      //     this.clearLayer(item1)
      //     if(item1.drawType == 'line') {
      //       this.getAndDrawLine(item1, item)
      //     } else if(item1.drawType == 'layer') {
      //       // this.clearLayer(item)
      //       this.getAndDrawLayer(item1, item)
      //     }
      //   })
      // })
      
    },
    // 获取线的数据并绘制
    getAndDrawLine(currentItem, extent) {
      let day = this.time.split(' ')[0]
      let time = this.time.split(' ')[1] + ':00'
      this.$get('/api/numerical-forecast/contours', {
        day: day,
        grade: currentItem.grade,
        level: this.currentLevel,
        minX: extent.xMin,
        maxX: extent.xMax,
        minY: extent.yMin,
        maxY: extent.yMax,
        // minX: 0,
        // maxX: 360,
        // minY: -75,
        // maxY: 75,
        num: 30,
        time: time,
        type: currentItem.id
      }).then(res => {
        if(res.status == 200) {
          let polyline = []
          res.data.data.forEach(item => {
            let linedata = []
            item.PointList.forEach(item1 => {
              let latlng = []
              latlng.push(item1.Y)
              latlng.push(item1.X)
              latlng.push(Math.round(item.Value/100))
              linedata.push(latlng)
            })

            polyline.push(linedata)
          })
          let line = new PressureLayer({}, {
            data: polyline,
            hlData: []
          }).addTo(window.map);
          line.id = currentItem.id
          this.lineList.push(line)
        }
      }).catch(error => {
        this.$message.error("获取" + currentItem.name + "数据失败")
      })
    },
    // 绘制色斑图
    async getAndDrawLayer(currentItem, extent) {
      let day = this.time.split(' ')[0]
      let time = this.time.split(' ')[1] + ':00'
      try {
        let test = await this.$getbuffer('/api/numerical-forecast/mercator-polygonsImage', {
        // this.$getbuffer('/api/numerical-forecast/polygonsImage', {
          day: day,
          grade: currentItem.grade,
          level: this.currentLevel,
          minX: extent.xMin,
          maxX: extent.xMax,
          minY: extent.yMin,
          maxY: extent.yMax,
          num: 20,
          time: time,
          type: currentItem.id
        }, { responseType: 'arraybuffer' })
        
        const img = this.toImage(test)
        // let ex = this._.cloneDeep(extent)
        // if(extent.xMax == 360) {
        //   ex.xMin = extent.xMin - 360
        //   ex.xMax = extent.xMax - 360
        // }
        let bounds = L.latLngBounds(L.latLng(extent.yMin, extent.xMin), L.latLng(extent.yMax, extent.xMax))
        let bounds1 = L.latLngBounds(L.latLng(extent.yMin, extent.xMin + 360), L.latLng(extent.yMax, extent.xMax + 360))
        let bounds2 = L.latLngBounds(L.latLng(extent.yMin, extent.xMin - 360), L.latLng(extent.yMax, extent.xMax - 360))
        if (img) {
          let imageLayer = L.imageOverlay(img, bounds)
          imageLayer.id = currentItem.id
          imageLayer.on('add', ev => {
            console.log('加载完成', ev)
            if(this.imageLayerNum >= 0) {
              window.map.removeLayer(imageLayer)
            }
            console.log(this.layerNum)
            // this.setImageLayerNum(this.layerNum)
          })
          imageLayer.addTo(window.map)
          console.log(imageLayer)
          this.layerList.push(imageLayer)
          let imageLayer1 = L.imageOverlay(img, bounds1)
          imageLayer1.id = currentItem.id
          imageLayer1.on('add', ev => {
            if(this.imageLayerNum >= 0) {
              window.map.removeLayer(imageLayer1)
            }
          })
          imageLayer1.addTo(window.map)
          this.layerList.push(imageLayer1)
          let imageLayer2 = L.imageOverlay(img, bounds2).addTo(window.map)
          imageLayer2.id = currentItem.id
          imageLayer2.on('add', ev => {
            if(this.imageLayerNum >= 0) {
              window.map.removeLayer(imageLayer2)
            }
            // this.setImageLayerNum(this.layerNum)
          })
          imageLayer2.addTo(window.map)
          this.layerList.push(imageLayer2)
        }
      } catch (error) {
        this.$message.error("获取" + currentItem.name + "数据失败")
      }
      

      // test.then(res => {
      //   if(res.status == 200) {
      //     return (
      //       'data:image/png;base64,' +
      //       btoa(
      //         new Uint8Array(res.data).reduce(
      //           (data, byte) => data + String.fromCharCode(byte),
      //           ''
      //         )
      //       )
      //     )
      //   }
      // }).then((data) => {
      //   const img = data
      //   // let ex = this._.cloneDeep(extent)
      //   // if(extent.xMax == 360) {
      //   //   ex.xMin = extent.xMin - 360
      //   //   ex.xMax = extent.xMax - 360
      //   // }
      //   let bounds = L.latLngBounds(L.latLng(extent.yMin, extent.xMin), L.latLng(extent.yMax, extent.xMax))
      //   let bounds1 = L.latLngBounds(L.latLng(extent.yMin, extent.xMin + 360), L.latLng(extent.yMax, extent.xMax + 360))
      //   let bounds2 = L.latLngBounds(L.latLng(extent.yMin, extent.xMin - 360), L.latLng(extent.yMax, extent.xMax - 360))
      //   if (img) {
      //     let imageLayer = L.imageOverlay(img, bounds)
      //     imageLayer.id = currentItem.id
      //     imageLayer.on('add', ev => {
      //       console.log('加载完成', ev)
      //       if(this.imageLayerNum >= 1) {
      //         window.map.removeLayer(imageLayer)
      //       }
      //       console.log(this.layerNum)
      //       // this.setImageLayerNum(this.layerNum)
      //     })
      //     imageLayer.addTo(window.map)
      //     console.log(imageLayer)
      //     this.layerList.push(imageLayer)
      //     let imageLayer1 = L.imageOverlay(img, bounds1)
      //     imageLayer1.id = currentItem.id
      //     imageLayer1.on('add', ev => {
      //       if(this.imageLayerNum >= 1) {
      //         window.map.removeLayer(imageLayer1)
      //       }
      //     })
      //     imageLayer1.addTo(window.map)
      //     this.layerList.push(imageLayer1)
      //     let imageLayer2 = L.imageOverlay(img, bounds2).addTo(window.map)
      //     imageLayer2.id = currentItem.id
      //     imageLayer2.on('add', ev => {
      //       if(this.imageLayerNum >= 1) {
      //         window.map.removeLayer(imageLayer2)
      //       }
      //       // this.setImageLayerNum(this.layerNum)
      //     })
      //     imageLayer2.addTo(window.map)
      //     this.layerList.push(imageLayer2)
      //   }
      // }).catch(error => {
      //   this.$message.error("获取" + currentItem.name + "数据失败")
      // })

    },
    // 接收图像转base64
    toImage(res) {
      return (
        'data:image/png;base64,' +
        btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )
      )
    },
    getAndDrawWind(currentItem, extent) {
      let day = this.time.split(' ')[0]
      let time = this.time.split(' ')[1] + ':00'
      this.$get('/api/numerical-forecast/wind', {
        day: day,
        level: this.currentLevel,
        time: time,
        grade: 4,
        type: currentItem.id
      }).then(res => {
        if(res.status == 200) {
          console.log('wind--res', res.data.data)
          if(res.status == 200) {
            let windList = res.data.data
            
            var config = {
              lat: '0',
              lng: '1',
              value: '2',
              dir: '3',
              data: windList
            };
            this.windLayer = new WindLayer({}, config);
            this.windLayer.id = currentItem.id
            window.map.addLayer(this.windLayer)
          }
        }
      }).catch(error => {
        this.$message.error("获取" + currentItem.name + "数据失败")
      })
    },
    // 绘制 洋流\波向
    getAndDrawWave(currentItem) {
      console.log('wave--', currentItem)
      let day = this.time.split(' ')[0]
      let time = this.time.split(' ')[1] + ':00'
      this.$get('/api/numerical-forecast/wave', {
        day: day,
        time: time,
        type: currentItem.id,
      }).then(res => {
        console.log('wave--res', res.data.data)
        if(res.status == 200) {
          let gridSize = currentItem.gridSize
          let xMin = currentItem.xMin
          let xMax = currentItem.xMax
          let yMin = currentItem.yMin
          let yMax = currentItem.yMax
          // waveList 构造数组 361 * 720 [lat, lng, value, dir]
          let waveList = []
          let data = res.data.data
          for(let i = 0; i < data.length; i++) {
            let latlngList = []
            for(let j = 0;j < data[i].length; j++) {
              let arr = []
              arr.push(Number(yMax) - i * gridSize)
              if(Number(xMin) + j * gridSize > 180) {
                arr.push(Number(xMin) + j * gridSize - 360)
              } else {
                arr.push(Number(xMin) + j * gridSize)
              }
              if(data[i][j] != "") {
                let temp = data[i][j].split(',')
                arr.push(temp[0])
                arr.push(temp[1])
              } else {
                arr.push("")
                arr.push("")
              }
              latlngList.push(arr)
            }
            waveList.push(latlngList)
          }
          console.log('waveList', waveList)

          var config = {
            lat: '0',
            lng: '1',
            value: '2',
            dir: '3',
            data: waveList
          };
          this.waveLayer = new FlowLayer({}, config);
          this.waveLayer.id = currentItem.id
          window.map.addLayer(this.waveLayer)
        }
      }).catch(error => {
        this.$message.error('获取' + currentItem.name + '数据失败')
      })
    },
    // 绘制潮汐
    getAndDrawTidal(currentItem) {
      // 先绘制港口数据
      this.$get('/api/harbor').then(res => {
        if(res.status == 200) {
          console.log('harbor', res.data.data);
          let harborList = res.data.data.rows
          harborList.forEach(item => {
            this.createMarker(item)
          })
        }
      }).catch(error => {
        this.$message.error(this.$message.error('获取' + currentItem.name + '数据失败'))
      })
    },
    // 根据港口数据创建marker
    createMarker(harbor) {
      // let icon = this.$utilsMap.createIcon({
      //   iconUrl: require('@/assets/images/sidebar/station.png'),
      //   iconSize: [45, 45],
      //   popupAnchor: [40, 40]
      // })
      // let selectIcon = this.$utilsMap.createIcon({
      //   iconUrl: require('@/assets/images/sidebar/selectStation.png'),
      //   iconSize: [45, 45],
      //   popupAnchor: [40, 40]
      // })
      let marker = this.$utilsMap.createMarkerByLatlng(window.map, [harbor.lat, harbor.lon], {
        icon: this.tidalIcon,
        title: harbor.hname
      })
      marker.id = harbor.id
      marker.name = harbor.hname
      marker.on('mouseover', ev => {
        this.markerId = ev.target.id
        // 请求潮汐数据
        let time = this.time.split(' ')[0]
        this.getTidalData(harbor.id, time)
        
        console.log('mouseover', ev)
        // ev.target.   构造数据
        this.tidalData.time = this.time
        this.tidalData.name = ev.target.name
        // 前三天日期数据
        this.tidalIndex = 2     // 重置选择的日期
        this.tidalData.timeList = []
        let now = this.$m(this.time).format('MM-DD')
        let yestoday = this.$m(this.time).subtract(1, 'days').format('MM-DD')
        let lastday = this.$m(this.time).subtract(2, 'days').format('MM-DD')
        this.tidalData.timeList.push(lastday)
        this.tidalData.timeList.push(yestoday)
        this.tidalData.timeList.push(now)

        // 潮汐面板显示并重新定位
        this.tidalObj.tidalShow = true
        this.tidalObj.left = ev.containerPoint.x
        this.tidalObj.top = ev.containerPoint.y - 50
        marker.setIcon(this.tidalSelectIcon)
        this.$nextTick(() => {
          // let width = document.querySelector('.tidal').offsetWidth
          // let height = this.$refs.tidal.clientHeight
          let width = this.$refs.tidal.offsetWidth
          let height = this.$refs.tidal.offsetHeight
          // 都在屏幕范围内
          if(this.screenWidth - ev.containerPoint.x > (width + 50) && this.screenHeight - ev.containerPoint.y > (height + 50)) {
            this.tidalObj.left = ev.containerPoint.x + 10
            this.tidalObj.top = ev.containerPoint.y - 50
          } else if(this.screenWidth - ev.containerPoint.x > (width + 50)) {
            // 高度超出屏幕
            let offHeight = height - (this.screenHeight - ev.containerPoint.y)
            this.tidalObj.left = ev.containerPoint.x + 10
            this.tidalObj.top = ev.containerPoint.y - offHeight - 50
          } else if(this.screenHeight - ev.containerPoint.y > (height + 50)) {
            // 宽度超出屏幕
            let offWidth = width - (this.screenWidth - ev.containerPoint.x)
            this.tidalObj.left = ev.containerPoint.x - width - 10
            this.tidalObj.top = ev.containerPoint.y + 10
          } else {
            // 宽度、高度都超出屏幕
            let offWidth = width - (this.screenWidth - ev.containerPoint.x)
            let offHeight = height - (this.screenHeight - ev.containerPoint.y)
            this.tidalObj.left = ev.containerPoint.x - width - 10
            this.tidalObj.top = ev.containerPoint.y - offHeight - 50
          }
        })
      })
      marker.on('mouseout', ev => {
        marker.setIcon(this.tidalIcon)
        this.tidalObj.tidalShow = false
      })
      this.tidalMarker.push(marker)
      // marker.on('click', ev => {
      //   console.log('harbor--click', harbor);
      //   this.tidalObj.left = 500
      //   this.tidalObj.top = 300
      //   this.tidalObj.tidalShow = true
      // })
    },
    getTidalData(id, time) {
      this.$get('/api/tidal/one', {
        id: id,
        localDate: time
      }).then(res => {
        if(res.status == 200) {
          let tidalList = res.data.data
          console.log('tidalList', tidalList)
          this.tidalData.tidalList = []
          let time = null
          this.clearChart()
          this.createChart(this.tidalCharts)
          if(tidalList.length && tidalList != null && tidalList != undefined) {
            // 最大值和最小值
            let maxObj = tidalList[0]
            let minObj = tidalList[0]
            for(let i = 0; i < tidalList.length; i++) {
              if(maxObj.height < tidalList[i].height) {
                maxObj = tidalList[i]
              }
              if(minObj.height > tidalList[i].height) {
                minObj = tidalList[i]
              }
              let time = this.$m(tidalList[i].tidalTime).format('HH')
              this.tidalCharts.xdata.push(time)
              this.tidalCharts.ydata.push(tidalList[i].height)
            }
            // 绘制图表
            this.createChart(this.tidalCharts)
            console.log('xdata', this.tidalCharts.xdata);
            console.log('ydata', this.tidalCharts.ydata);
            this.tidalData.tidalList.push(this._.cloneDeep(maxObj))
            time = this.$m(this.tidalData.tidalList[0].tidalTime).format('hh-mm')
            this.tidalData.tidalList[0].tidalTime = time.split('-')[0] + '时' + time.split('-')[1] + '分'
            this.tidalData.tidalList[0].name = '第一高潮'
            this.tidalData.tidalList[0].type = 'max'
            this.tidalData.tidalList.push(this._.cloneDeep(minObj))
            time =  this.$m(this.tidalData.tidalList[1].tidalTime).format('hh-mm')
            this.tidalData.tidalList[1].tidalTime = time.split('-')[0] + '时' + time.split('-')[1] + '分'
            this.tidalData.tidalList[1].name = '第一低潮'
            this.tidalData.tidalList[1].type = 'min'
            console.log('tidalList', this.tidalData.tidalList)
          } else {
            this.$message.warning("此时刻暂无潮汐数据")
          }
        }
      }).catch(error => {
        this.$message.error('获取潮汐数据失败')
      })
    },
    showTidalMessage() {
      this.$message.warning("此时刻暂无潮汐数据")
    },
    // 创建图表
    createChart(dital) {
      let option = {
        backgroundColor: '#fff',
        color: ['#73A0FA'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            },
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        grid: {
          left: 5,
          right: 5,
          bottom: 5,
          top: 15,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dital.xdata,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#999',
            textStyle: {
              fontSize: 12
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F3F4F4'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
        },
        series: [{
            name: '订单总笔数',
            type: 'line',
            smooth: true,
            data: dital.ydata
          }
        ]
      }

      this.tidalChart.setOption(option)
    },
    // 清除图表数据
    clearChart() {
      this.tidalCharts.xdata = []
      this.tidalCharts.ydata = []
    },
    // 清除
    clearLayer(layer) {
      if(layer.drawType === 'line' && this.lineList.length) {
        let arr = this.lineList.filter(item => {
          return item.id == layer.id
        })
        arr.forEach(item => {
          let i = this.lineList.findIndex(item1 => {
            return item1.id == item.id
          })
          map.removeLayer(this.lineList[i])
          this.lineList.splice(i, 1)
        })
      }

      if(layer.drawType === 'layer' && this.layerList.length) {
        let arr = this.layerList.filter(item => {
          return item.id == layer.id
        })
        arr.forEach(item => {
          let i = this.layerList.findIndex(item1 => {
            return item1.id == item.id
          })
          map.removeLayer(this.layerList[i])
          this.layerList.splice(i, 1)
        })
      }

      // if(layer.drawType === 'point_flow' && (this.waveLayer !== null)) {
      //   map.removeLayer(layer)
      //   this.waveLayer = null
      // }
    },
    // wind、wave使用了自动重绘，需要单独清除
    clearWindWave(layer) {
      if(layer.drawType === 'point_flow' && (this.waveLayer !== null)) {
        map.removeLayer(this.waveLayer)
        this.waveLayer = null
      } else if(layer.drawType === 'point_wind' && (this.windLayer !== null)) {
        map.removeLayer(this.windLayer)
        this.windLayer = null
      }
    }
  }
};
</script>
<style scoped lang="scss">
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 4px;
  background-color: rgba(0, 0, 0, 0.5);
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(240, 240, 240, 0.6);
}

#sideBar {
  z-index: 999;

}
.leaflet-marker-pane .leaflet-div-icon {
  background: none!important;
  border: none!important;
}
</style>
