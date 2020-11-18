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
        <div :class="{ menu_right: true, bgcolor: item.flag == 1 }">
          <img :src="item.img" />
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
      currentItemList: []
    };
  },
  computed: {
    ...mapState({
      menuItem: state => state.sideBar.menuItem
    })
  },
  watch: {
    // 当前要素的变化
    currentItemList: {
      handler(val, oldval) {
        this.setMenuItemList(this.currentItemList)
      },
      deep: true
    }
  },
  mounted() {
    this.initMenuList()
  },
  methods: {
    ...mapMutations({
      setMenuItemList: 'sideBar/setMenuItemList',
    }),
    // 初始选中
    initMenuList() {
      this.menuList[0].flag = true
      this.currentItemList.push(this.menuList[0])
    },
    // 要素选择
    menuClick(index) {
      // 选中状态时取消选中
      if(this.menuList[index].flag) {
        this.menuList[index].flag = false
        let i = this.currentItemList.findIndex(item => {
          return item.id == this.menuList[index].id
        })
        if(i != -1) {
          this.currentItemList.splice(i, 1)
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
            this.menuList[j].flag = false
            this.currentItemList.splice(i, 1)
          }
          this.menuList[index].flag = true
          this.currentItemList.push(this.menuList[index])
        } else {
          this.menuList[index].flag = true
          this.currentItemList.push(this.menuList[index])
        }
      }

      console.log('currentItemList', this.currentItemList);
      console.log('menuList', this.menuList);
    },
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
</style>
