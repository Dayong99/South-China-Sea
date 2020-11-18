const state = {
  time: null,
  timeLevel: []
}

const actions = {
  changeTime: ({ commit }) => commit('changeTime'), // 提交到mutations中处理
  getTimeLevel: ({ commit }) => commit('getTimeLevel')
}

// 改变参数的方法
const mutations = {
  changeTime(state, str) {
    state.time = str
    // console.log(state.time)
  },
  getTimeLevel(state, arr) {
    state.timeLevel = arr
  }
}

export default {
  state,
  mutations,
  actions
}

