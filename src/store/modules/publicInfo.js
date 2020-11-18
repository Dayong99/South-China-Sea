const state = {
  filterObj: {
    course: null,
    day: null,
    time: null,
    interval: 3,
    level: 500,
    type: 'Geopotential_Height'
  },
  shipInfo: {
    id: null,
    times: null
  },
  bgFlag: false
}

const actions = {
  changeFilter: ({ commit }) => commit('changeFilter'),
  changeLevel: ({ commit }) => commit('changeLevel'),
  changeShipInfo: ({ commit }) => commit('changeShipInfo'),
  changeBg: ({ commit }) => commit('changeBg')
}

// 改变参数的方法
const mutations = {
  changeFilter(state, obj) {
    const data = Object.assign({}, obj) // 使用Object.assign来更新state.personInfo对象
    state.filterObj = data
  },
  changeLevel(state, obj) {
    console.log(obj)
    state.filterObj.level = obj.level
    state.filterObj.type = obj.type
  },
  changeShipInfo(state, obj) {
    console.log(obj)
    const data = Object.assign({}, obj) // 使用Object.assign来更新state.personInfo对象
    state.shipInfo = data
  },
  changeBg(state, flag) {
    console.log(111)
    state.bgFlag = flag
  }
}

export default {
  state,
  mutations,
  actions
}
