<template>
  <div class="sideBar" id="sideBar">
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
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
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
      // 文字集合
      divIconList: [],
    };
  },
  computed: {
    ...mapState({
      // 范围
      extent: state => state.earth.extent,
      // 时间
      time: state => state.time.time
    })
  },
  watch: {
    // 当前要素列表的变化
    currentItemList: {
      handler(val, oldval) {
        this.setMenuItemList(this.currentItemList)
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
    // 范围的变化
    extent: {
      handler(val, old) {
        this.drawItemList()
      }
    }
  },
  created() {
    this.initMenuList()
  },
  mounted() {
    // this.initMenuList()
  },
  methods: {
    ...mapMutations({
      setMenuItemList: 'sideBar/setMenuItemList',
    }),
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
              xMin: null,
              xMax: null,
              yMin: null,
              yMax: null,
              units: item.units,
              drawType: item.drawType
            }
            // 处理level
            let level = item.parameterStep.split(',')
            level.forEach(item => {
              obj.level.push(Number(item))
            })
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
      }).catch(error => {
        this.$message.error("获取数据源数据失败")
      })
    },
    // 要素选择
    menuClick(index) {
      // 选中状态时取消选中
      if(this.menuList[index].flag) {
        // 清除单个
        this.clearDivIcon(this.menuList[index].id)
        this.clearLayer(this.menuList[index].id)

        this.menuList[index].flag = false
        let i = this.currentItemList.findIndex(item => {
          return item.id == this.menuList[index].id
        })
        if(i != -1) {
          this.currentItemList.splice(i, 1)
        }
        // 当前要素设置为当前要素列表中的最后一个
        this.currentItem = this.currentItemList[this.currentItemList.length - 1]
        this.currentLevel = this.currentItemList[this.currentItemList.length - 1].level[0]
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
        this.drawItem()
      }

      // 当前要素设置为当前要素列表中的最后一个
      // this.currentItem = this.currentItemList[this.currentItemList.length - 1]
      // this.currentLevel = this.currentItemList[this.currentItemList.length - 1].level[0]

      console.log('currentItemList', this.currentItemList);
      console.log('menuList', this.menuList);
      console.log('currentLevel', this.currentLevel);
    },
    // 创建marker
    // createMarker() {
    //   let icon = this.$utilsMap.createIcon({
    //     iconUrl: require('@/assets/images/logo.png')
    //   })
    //   this.$utilsMap.createMarkerByLatlng(window.map, [25, 120], {
    //     icon: icon,
    //     title: '测试'
    //   })
    // },
    // 绘制单个要素
    drawItem() {
      if(this.currentItem.drawType == 'line') {
        this.getAndDrawLine(this.currentItem)
      }
    },
    // 循环绘制当前要素列表的要素
    drawItemList() {
      this.currentItemList.forEach(item => {
        if(item.drawType == 'line') {
          this.clearDivIcon(item.id)
          this.clearLayer(item.id)
          this.getAndDrawLine(item)
        }
      })
    },
    // 获取线的数据并绘制
    getAndDrawLine(currentItem) {
      let day = this.time.split(' ')[0]
      let time = this.time.split(' ')[1] + ':00'
      this.$get('/api/numerical-forecast/contours', {
        day: day,
        grade: currentItem.grade,
        level: this.currentLevel,
        minX: this.extent.xMin,
        maxX: this.extent.xMax,
        minY: this.extent.yMin,
        maxY: this.extent.yMax,
        num: 20,
        time: time,
        type: currentItem.id
      }).then(res => {
        if(res.status == 200) {
          console.log(res.data.data)
          let polyline = []
          res.data.data.forEach(item => {
            let linedata = []
            item.PointList.forEach(item1 => {
              let latlng = []
              latlng.push(item1.Y)
              latlng.push(item1.X)
              linedata.push(latlng)
            })
            // 中间位置加文字
            let j = Math.round(item.PointList.length / 2)
            let icon = this.$utilsMap.createDivIcon({
              id: currentItem.id,
              html: item.Value
            })
            let x = item.PointList[j].X
            let y = item.PointList[j].Y
            let iconMarker = this.$utilsMap.createMarkerByLatlng(window.map, [y, x], {
              id: currentItem.id,
              icon: icon
            })
            this.divIconList.push(iconMarker)

            polyline.push(linedata)
          })
          let line = this.$utilsMap.createPolyline(window.map, polyline, {
            id: currentItem.id,
            color: "#ff0000",
            weight: 1
          })
          this.lineList.push(line)
        }
      }).catch(error => {
        this.$message.error("获取" + currentItem.name + "数据失败")
      })
    },
    clearLayer(id) {
      if(this.lineList.length) {
        let i = this.lineList.findIndex(item => {
          return item.options.id == id
        })
        map.removeLayer(this.lineList[i])
        this.lineList.splice(i, 1)
      }
    },
    clearDivIcon(id) {
      if(this.divIconList.length) {
        console.log('divIconList', this.divIconList)
        let list = this.divIconList.filter(item => {
          return item.options.id == id
        })
        list.forEach(item => {
          map.removeLayer(item)
          let i = this.divIconList.findIndex(item1 => {
            return item1 == item
          })
          this.divIconList.splice(i, 1)
        })
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
