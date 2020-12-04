const state = {
  extent: null,
  routeInfoflag:true,
  // 底图切换
  tileLayer: false,
}

const actions = {
  
}

// 改变参数的方法
const mutations = {
  setExtent(state, val) {
    state.extent = val
    // console.log('store extent', state.extent);
  },
  setRouteInfoflag(state,val){
    state.routeInfoflag = val
  },
  setTileLayer(state, val) {
    state.tileLayer = val
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}