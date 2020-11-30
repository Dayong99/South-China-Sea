const state = {
  extent: null,
  // 图层重绘个数
  imageLayerNum: 0,
  routeInfoflag:true
}

const actions = {
  
}

// 改变参数的方法
const mutations = {
  setExtent(state, val) {
    state.extent = val
    // console.log('store extent', state.extent);
  },
  setImageLayerNum(state, val) {
    state.imageLayerNum = val
  },
  setRouteInfoflag(state,val){
    state.routeInfoflag = val
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}