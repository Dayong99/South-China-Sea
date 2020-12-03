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
  }, {
    name: '数据管理',
    icon: require('@/assets/images/menu/data.png'),
    flag: false,
  }],
  systemList: [
    {
      name: '色斑图配置',
      flag: false
    },
    {
      name: '等值线配置',
      flag: false
    },
    {
      name: '常用区域',
      flag: false
    },
    {
      name: '常用地点',
      flag: false
    },
    {
      name: '海区划分',
      flag: false
    },
    {
      name: '参数配置',
      flag: false
    },
    {
      name: '数据项配置',
      flag: false
    },
    
  ],
  dataList: [
    {
      name: '广东省网',
      flag: false
    },
    {
      name: '欧格海浪数值预报',
      flag: false
    },
    {
      name: '数值预报数据',
      flag: false
    },
    {
      name: '台风数据',
      flag: false
    },
    {
      name: '实况数据',
      flag: false
    }
  ],
  TaskManagerOptions: 0, // 0 不显示 1 添加 2 修改
  routeDialogOptions: 0, // 0不显示 1添加航线 2 修改航线
  algorithmOptions: 0, // 0不显示 1新增算法参数 2 修改算法参数
  routeAlgorithmInfo: 0, // 0不显示 1查看评估结果
  assessLegendShow:false // 评估结果图例
}

const actions = {

}

// 改变参数的方法
const mutations = {
  setMenuList(state, val) {
    state.menuList = val
  },
  setAlgorithm(state, val) {
    state.algorithmOptions = val
    console.log(state.algorithmOptions, `state.setAlgorithm`)
  },
  setTaskManagerOptions(state, val) {
    state.TaskManagerOptions = val
  },
  setSystem(state, obj) {
    state.systemList.forEach((item) => {
      item.flag = false
    })
    state.systemList[obj.index].flag = obj.val
  },
  setData(state, obj) {
    state.dataList.forEach((item) => {
      item.flag = false
    })
    state.dataList[obj.index].flag = obj.val
  },
  setRouteDialogOptions(state, val) {
    state.routeDialogOptions = val
  },
  setRouteAlgorithmInfo(state, val) {
    state.routeAlgorithmInfo = val
    console.log('查看评估结果', val)
  },
  setAssessLegendShow(state,val){
    state.assessLegendShow = val
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}