<template>
  <div
    id="levelbar"
    v-show="levelShow"
    :style="{'height':barHeight,'margin-right':'0px'}"
    @click="getNowTip"
    @mouseover="showTip"
    @mousemove="showTip"
    @mouseleave="hideTip"
  >
    <div
      v-show="tipshow"
      class="levelcode ghost-levelcode"
      :style="{'top':tiptop,'right':tipleft}"
    >
      <div class="box">{{ tipcontent }}</div>
    </div>
    <div ref="nowtip" class="levelcode main-levelcode" :style="{'top':nowtop}">
      <div class="box">{{ nowcontent }}</div>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
  name: 'LevelBar',
  data() {
    return {
      barHeight: 0,
      itemHeight: 22,

      // 层级轴是否显示
      levelShow: false,
      // 当前时间戳
      nowcontent: null,
      levelIndex: 0,
      nowtop: 0,

      // 提示框
      tipcontent: null,
      tipshow: false,
      tiptop: 0,
      tipleft: '',
      itemlevelIndex: 0
    }
  },
  computed: {
    ...mapState({
      levelList: state => state.sideBar.levelList,
      menuItemList: state => state.sideBar.menuItemList
    })
  },
  watch: {
    levelList(newval) {
      if(newval.length) {
        this.levelShow = true
      } else{
        this.levelShow = false
      }
      // 层级工具栏初始高度
      this.barHeight = this.itemHeight * newval.length + 'px'

      // // 层级栏初始内容
      // this.levelList = newval

      // 初始化当前层级戳位置
      this.nowtop = this.itemHeight * this.levelList.length - 22 + 'px'
      // this.startNowTip()
    },
    menuItemList: {
      handler(val, oldval) {
        if(this.levelShow) {
          // 显示最近缓存的层级
          this.nowcontent = val[val.length - 1].currentLevel
          let i = val[val.length - 1].parseIntLevel.findIndex(item => {
            return item == this.nowcontent
          })

          // 渲染之后
          this.$nextTick(() => {
            this.nowtop = (this.levelList.length - i - 1) * 22 + 'px'
          })
        }
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      setNowLevel: 'sideBar/setNowLevel'
    }),
    // 初始层级戳
    startNowTip(levelIndex, heightIndex) {
      this.nowcontent = this.levelList[0]
    },
    // 点击显示当前位置层级
    getNowTip() {
      this.levelIndex = this.levelList.length - (parseInt(event.offsetY / this.itemHeight) + 1)
      this.nowcontent = this.levelList[this.levelIndex]
      this.nowtop = event.offsetY - 11 + 'px'
      // 层级变化通知sideBar重绘
      this.setNowLevel(this.nowcontent)
    },
    // 显示层级戳
    showTip() {
      this.tipshow = true
      // 时间戳偏移量
      this.tiptop = event.offsetY - 11 + 'px'

      // 第几个
      this.itemlevelIndex = this.levelList.length - (parseInt(event.offsetY / this.itemHeight) + 1)

      const nowVal = parseInt(this.$refs.nowtip.style.top.replace('px', ''))
      const tipVal = parseInt(this.tiptop.replace('px', ''))
      if (Math.abs(nowVal - tipVal) <= 22) {
        this.tipleft = '6.5em'
      } else {
        this.tipleft = '2.5em'
      }

      // 时间戳内容
      this.tipcontent = this.levelList[this.itemlevelIndex]
    },
    // 隐藏层级戳
    hideTip() {
      this.tipshow = false
      this.tipTop = 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
