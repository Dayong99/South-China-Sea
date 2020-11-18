const state = {
  menuItemList: []
}

const actions = {
  
}

// 改变参数的方法
const mutations = {
  setMenuItemList(state, val) {
    state.menuItemList = val
    console.log('store menuItemList', state.menuItemList);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

