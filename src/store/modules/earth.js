const state = {
  extent: null
}

const actions = {
  
}

// 改变参数的方法
const mutations = {
  setExtent(state, val) {
    state.extent = val
    console.log('store extent', state.extent);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}