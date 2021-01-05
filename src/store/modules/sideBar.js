const state = {
  // 当前选中要素集合
  menuItemList: [],
  // 高度层级
  levelList: [],
  // 当前层级
  nowLevel: {
    level: null,
    refresh: false,  // 标识是否重新刷新
  },
  // 实况信息
  /**
   * 地面常规观测--ground
   * 船舶站--ship
   * 浮标站--buoy
   * 海洋站--ocean
   */
  realTimeValue: null,
  // 数据源
  sourceType: 2,
  // 刷新时间标识
  reloadTime: false,
}

const actions = {

}

// 改变参数的方法
const mutations = {
    setMenuItemList(state, val) {
        state.menuItemList = val
        console.log('store menuItemList', state.menuItemList);
    },
    setLevelList(state, val) {
        state.levelList = val
    },
    setNowLevel(state, val) {
        state.nowLevel.level = val.level
        state.nowLevel.refresh = val.refresh
    },
    setRealTimeValue(state, val) {
        state.realTimeValue = val
    },
    setSourceType(state, val) {
        state.sourceType = val
    },
    setReloadTime(state) {
        state.reloadTime = !state.reloadTime
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}