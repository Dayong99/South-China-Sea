const state = {
  shipManagerShow: false,
}

const actions = {
  
}

// 改变参数的方法
const mutations = {
  setShipManagerShow(state, val) {
    state.shipManagerShow = val
    console.log('store shipManagerShow', state.shipManagerShow);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}