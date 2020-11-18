<template>
  <div id="menuBar" class="menuBar">
    <div class="search">
      <div  :class="{search_bgcolor: searchFlag, search_icon: true}" @click.stop="changeSearch">
        <img :src="searchIcon">
      </div>
      <div class="search_input">
        <div class="input_left">
          <img src="@/assets/images/menu/search.png">
        </div>
        <div class="input_content">
          <el-input v-model="searchValue" placeholder="请输入位置" clearable class="search_content"></el-input>
        </div>
        <div class="input_right">
          <img src="@/assets/images/menu/heart.png">
        </div>
      </div>
    </div>
    <div class="menu_list" v-show="searchFlag">
      <ul class="list_ul">
        <li v-for="(item, index) in menuList" :key="index">
          <img :src="item.icon">
          <div class="title">
            <span @click.stop="openTask(index)" :class="{ title_bg: item.flag }">{{ item.name }}</span>
            <img src="@/assets/images/menu/add.png" v-if="index == 2" @click.stop="addTask(index)">
          </div>
          <img :src="downIcon" v-if="index == 2" class="down" @click.stop="openTask(index)">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      // 搜索框
      searchFlag: false,
      searchIcon: require('@/assets/images/menu/unselect.png'),
      searchValue: '',

      // 菜单栏
      menuList: [{
        name: '船舰管理',
        icon: require('@/assets/images/menu/ship.png'),
        flag: false,
      }, {
        name: '编队管理',
        icon: require('@/assets/images/menu/team.png'),
        flag: false,
      }, {
        name: '任务管理',
        icon: require('@/assets/images/menu/collection.png'),
        flag: false,
      }],
      // 任务管理展开
      menuListFlag: false,
      downIcon: require('@/assets/images/menu/down.png')
    }
  },
  computed: {
    ...mapState({
      shipManagerShow: state => state.menuBar.shipManagerShow
    })
  },
  watch: {
    shipManagerShow(newval) {
      this.menuList[0].flag = newval
    },
    // 任务管理
    menuListFlag(newval, oldval) {
      if(newval) {
        this.downIcon = require('@/assets/images/menu/up.png')
      } else {
        this.downIcon = require('@/assets/images/menu/down.png')
        this.menuList[2].flag = false
      }
    }
  },
  methods: {
    ...mapMutations({
      setShipManagerShow: 'menuBar/setShipManagerShow'
    }),
    //------------start搜索框--------------
    // 改变搜索图标，并显示菜单栏
    changeSearch() {
      this.searchFlag = !this.searchFlag
      if(this.searchFlag) {
        this.searchIcon = require('@/assets/images/menu/select.png')
      } else {
        this.searchIcon = require('@/assets/images/menu/unselect.png')
        this.menuList.forEach(item => {
          item.flag = false
        })
        this.downIcon = require('@/assets/images/menu/down.png')
      }
    },
    //------------end搜索框--------------

    //------------start任务管理--------------
    // 添加任务
    addTask(index) {
      this.openTask(index)
    },
    // 打开任务管理
    openTask(index) {
      this.menuList.forEach(item => {
        item.flag = false
      })
      this.menuList[index].flag = true
      if(index == 0) {
        this.setShipManagerShow(true)
      }
      // index == 2 任务管理
      if(index == 2) {
        this.menuListFlag = !this.menuListFlag
      } else {
        this.downIcon = require('@/assets/images/menu/down.png')
        this.menuList[2].flag = false
        this.menuListFlag = false
      }
    },
    //------------end任务管理--------------
  }
}
</script>

<style lang="scss" scoped>

</style>