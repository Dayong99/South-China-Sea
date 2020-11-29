const state = {
  // 当前选中要素集合
  menuItemList: [],
  // 高度层级
  levelList: [],
  // 当前层级
  nowLevel: null,
  // 实况信息
  /**
   * 地面常规观测--ground
   * 船舶站--ship
   * 浮标站--buoy
   * 海洋站--ocean
   */
  realTimeValue: null,
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
    console.log('levelList--change', state.levelList);
  },
  setNowLevel(state, val) {
    state.nowLevel = val
  },
  setRealTimeValue(state, val) {
    state.realTimeValue = val
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

