import { clearAll } from '@/utils/auth'
import db from '@/utils/localstorage'

const TokenKey = 'ACCESS_TOKEN'

const user = {
  state: {
    token: db.get('ACCESS_TOKEN'),
    expireTime: db.get('EXPIRE_TIME'),
    routeToken: db.get('ROUTE_TOKEN', null)
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      db.save(TokenKey, token)
    },
  
    SET_EXPIRETIME: (state, val) => {
      state.expireTime = val
      db.save('EXPIRE_TIME', val)
    },

    SET_REFRESH_TOKEN(state, val) {
      db.save('REFRESH_TOKEN', val)
    },
  },

  actions: {
    // 登录
    Login({ commit }, data) {
      console.log(commit)
      commit('SET_TOKEN', data.access_token)
    },

    // 登出
    LogOut({ commit, state }) {
      clearAll()
    }
  }
}

export default user
