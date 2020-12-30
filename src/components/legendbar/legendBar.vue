<template>
  <!-- <div class="legend" v-show="legendShow">
    <div class="legend_top">
      <div class="legend_title">图例</div>
      <div class="legend_clear">
        <div class="clear">
          <img src="@/assets/images/legendbar/clear.png" />
          <span>清除要素</span>
        </div>
        <div class="close" @click="closeLegend">
          <img src="@/assets/images/legendbar/close.png" />
        </div>
      </div>
    </div> -->
    <div class="legend_content" v-show="legendShow">
      <ul>
        <li
          v-for="(color, index) in colorList"
          :key="index"
        >
          <div class="legend_item_left">
            <div class="legend_item_top">
              {{ color.name }}
            </div>
            <div class="legend_item_bottom">
              {{ color.units }}
            </div>
          </div>
          <div class="legend_item_right">
            <ul>
              <li
                v-for="(item, i) in color.colorValues"
                :key="i"
                :style="{ background: item }"
                :data-value="color.legendValues[i]"
              ></li>
            </ul>
          </div>
        </li>
      </ul>
      <!-- 雷电、风羽五色图例 -->
      <!-- <div class="thunder">
        <div class="thunder_left">
          <img src="@/assets/images/legendbar/wind.png" />
          <span>气压</span>
          <span>温度</span>
          <span>湿度</span>
          <span>能见度</span>
          <span>降水</span>
        </div>
        <div class="thunder_right" v-show="thunderShow">
          <div class="none_thunder right_thunder">
            <img src="@/assets/images/legendbar/nthunder.png" />
            <span>无雷电</span>
          </div>
          <div class="middle_thunder right_thunder">
            <img src="@/assets/images/legendbar/mthunder.png" />
            <span>雷电强度中</span>
          </div>
          <div class="large_thunder right_thunder">
            <img src="@/assets/images/legendbar/sthunder.png" />
            <span>雷电强度高</span>
          </div>
        </div>
      </div> -->
    </div>
  <!-- </div> -->
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      // 图例显隐
      legendShow: true,
      // 图例中的雷电显隐
      thunderShow: false,
      colorList: [
      //   {
      //   name: '温度',
      //   type: 'temperature',
      //   time: '8/17 16:00',
      //   colorValues: ['#97E8AD', '#9AD2CA', '#9BBCE8', '#6B9DE1', '#2B5CC2', '#2B5CC2', '#1C3BA9', '#112C90', '#071E78', '#000F50'],
      //   legendValues: [-5, 0, 5, 10, 15, 20, 25, 30, 35, 40]
      // }, {
      //   name: '雷电',
      //   type: 'thunder',
      //   time: '8/17 16:00',
      //   colorValues: ['#aaa', '#bbb', '#ccc', '#ddd', '#fff'],
      //   legendValues: [1, 2, 3, 4, 5]
      // }
      ],
      // 获取所有的图例配置信息
      allColorList: []
    };
  },
  created() {
    this.getAllColorList()
  },
  computed: {
    ...mapState({
      menuItemList: state => state.sideBar.menuItemList
    })
  },
  watch: {
    // 根据菜单显示图例
    menuItemList: {
      handler(newval, oldval) {
        this.colorList = []
        let list = newval.filter(item => {
          return item.drawType === 'layer' && item.legendId !== 0
        })
        list.forEach(item => {
          let temp = this.allColorList.filter(itemColor => {
            return itemColor.id === item.legendId
          })
          let menuObj = {
            name: item.name,
            type: item.parameterMark,
            units: item.units,
            flag: null,
            // time: '8/17 16:00',
            colorValues: temp[0].colorValues.split(','),
            legendValues: temp[0].legendValues.split(',')
          }
          this.limitLegend(menuObj)
          this.colorList.push(menuObj)
        })
      },
      deep: true
    },
    // 根据图例列表是否有数据来显示列表
    colorList: {
      handler(newval, oldval) {
        if(newval.length) {
          this.legendShow = true
        } else {
          this.legendShow = false
        }
      },
      deep: true
    },
    
  },
  mounted() {

  },
  methods: {
    // 关闭图例
    closeLegend() {
      this.legendShow = false
    },
    // 获取所有图例数据
    getAllColorList() {
      this.$get('/api/legend-config/all').then(res => {
        if(res.status == 200) {
          this.allColorList = res.data.data
          console.log('allColorList', this.allColorList)
        }
      }).catch(error => {
        this.$message.error('获取图例数据失败')
      })
    },
    // 图例数据进行修改
    limitLegend(legendColor) {
      // let i = legendColor.type.indexOf('temperature')
      // let j = legendColor.type.indexOf('Temperature')
      // if(i != -1 || j != -1) {
      if(legendColor.type.toLowerCase() === 'temperature') {
        legendColor.legendValues.forEach((item, i) => {
          if(item > 180) {
            legendColor.legendValues[i] = Math.round(legendColor.legendValues[i] - 273.15)
          }
        })
      } else if(legendColor.type.toLowerCase() === 'visibility') {
        legendColor.legendValues.forEach((item, i) => {
          legendColor.legendValues[i] = Number(item) / 1000
        })
        legendColor.units = 'KM'
      }
      // 对图例数据进行抽稀
      if (legendColor.legendValues.length > 15 && legendColor.legendValues.length <= 25) {
        for (let i = 1; i < legendColor.legendValues.length; i += 2) {
          if(i % 2 != 0) {
            legendColor.legendValues[i] = ''
          }
        }
      } else if(legendColor.legendValues.length > 25 && legendColor.legendValues.length <=50) {
        for (let i = 1; i < legendColor.legendValues.length; i += 1) {
          if(i % 4 != 0) {
            legendColor.legendValues[i] = ''
          }
        }
      } else if(legendColor.legendValues.length > 50) {
        for(let i = 1; i < legendColor.legendValues.length; i++) {
          if(i % 6 != 0) {
            legendColor.legendValues[i] = ''
          }
        }
      }
    },
  }
};
</script>
<style scoped lang="scss">
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 4px;
  background: rgba(240, 240, 240, 0.6);
  // background-color: rgba(0, 0, 0, 0.5);
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  // background: rgba(240, 240, 240, 0.6);
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
