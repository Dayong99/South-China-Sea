<template>
  <div class="legend" v-show="legendShow">
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
    </div>
    <div class="legend_content">
      <ul>
        <li
          :class="{ bggray: index % 2 == 0 }"
          v-for="(color, index) in colorList"
          :key="index"
        >
          <div class="legend_item_top">
            <div class="legend_item_left">
              <img src="@/assets/images/legendbar/view.png" />
              <span>{{ color.name }}</span>
            </div>
            <div class="legend_item_right">
              <span>{{ color.time }}</span>
              <img src="@/assets/images/legendbar/close.png" />
            </div>
          </div>
          <div class="legend_item_bottom">
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
      <div class="thunder">
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
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      // 图例显隐
      legendShow: false,
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
      ]
    };
  },
  computed: {
    ...mapState({
      menuItem: state => state.sideBar.menuItem
    })
  },
  watch: {
    // 根据菜单显示图例
    menuItem: {
      handler(newval, oldval) {
        let menuObj = {
          name: null,
          type: null,
          flag: null,
          time: '8/17 16:00',
          colorValues: ['#97E8AD', '#9AD2CA', '#9BBCE8', '#6B9DE1', '#2B5CC2', '#2B5CC2', '#1C3BA9', '#112C90', '#071E78', '#000F50'],
          legendValues: [-5, 0, 5, 10, 15, 20, 25, 30, 35, 40]
        }
        if(newval.flag) {
          menuObj.name = newval.name
          menuObj.type = newval.type
          menuObj.flag = newval.flag
          this.colorList.push(menuObj)
          if(newval.type == 'thunder') {
            this.thunderShow = true
          }
        } else {
          let index = this.colorList.findIndex((item) => {
            return item.type == newval.type
          })
          if(index != -1) {
            this.colorList.splice(index, 1)
            if(newval.type == 'thunder') {
              this.thunderShow = false
            }
          }
        }
        // let index = this.colorList.findIndex((item) => {
        //   return item.type == newval.type
        // })
        // if(index != -1) {
        //   return
        // } else {

        // }
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
    }
  },
  mounted() {

  },
  methods: {
    // 关闭图例
    closeLegend() {
      this.legendShow = false
    }
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
