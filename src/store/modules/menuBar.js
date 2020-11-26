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
  TaskManagerOptions: 0, // 0 不显示 1 添加 2 修改
  routeDialogOptions: 0 // 0不显示 1添加航线 2 修改航线
}

const actions = {
  
}

// 改变参数的方法
const mutations = {
  setMenuList(state, val) {
    state.menuList = val
  },
  setTaskManagerOptions(state,val) {
    state.TaskManagerOptions = val
  },
  setRouteDialogOptions(state,val) {
    state.routeDialogOptions = val
    console.log(state.routeDialogOptions,`state.routeDialog`)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}