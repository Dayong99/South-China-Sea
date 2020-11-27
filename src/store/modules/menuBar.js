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
  }, {
    name: '系统配置',
    icon: require('@/assets/images/menu/system.png'),
    flag: false,
  }],
  systemList:[
    {
      name:'色斑图配置',
      flag:false
    },
    {
      name:'等值线配置',
      flag:false
    },
    {
      name:'常用区域',
      flag:false
    },
    {
      name:'海区划分',
      flag:false
    },
    {
      name:'参数配置',
      flag:false
    },
    {
      name:'数据项配置',
      flag:false
    },
    {
      name:'广东省网',
      flag:false
    },
    {
      name:'欧格海浪数值预报',
      flag:false
    },
    {
      name:'hj数值预报数据',
      flag:false
    },
  ],
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
  setSystem(state,obj) {
    state.systemList.forEach((item)=>{
      item.flag = false
    })
    state.systemList[obj.index].flag = obj.val},
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