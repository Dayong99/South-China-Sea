const state = {
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
  TaskManagerOptions: 0 // 0 不显示 1 添加 2 修改
}

const actions = {
  
}

// 改变参数的方法
const mutations = {
  setMenuList(state, val) {
    state.menuList = val
    console.log('store menuList', state.menuList);
  },
  setTaskManagerOptions(state,val) {
    state.TaskManagerOptions = val
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}