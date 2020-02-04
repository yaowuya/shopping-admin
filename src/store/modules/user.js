import { getToken, setToken, removeToken } from '../../utils/auth'
import { getStore, setStore, removeStore, MENU_ROUTE } from '../../utils/storage'
// import resetRouter from '@/router'
import http from '../../http'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  menuList: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENU: (state, menu) => {
    state.menuList = [...menu]
  }
}

const actions = {
  // user login
  async setAllToken ({ commit }, token) {
    commit('SET_TOKEN', token)
    setToken(token)
  },

  // user register
  async logout ({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_NAME', '')
    commit('SET_MENU', [])
    // resetRouter()
    removeToken()
    removeStore('userName')
    removeStore(MENU_ROUTE)
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
  async login ({ commit }, name) {
    commit('SET_NAME', name)
    setStore('userName', name)
  },
  // get user info
  async getMenu ({ commit }) {
    let username = state.name === '' ? getStore('userName') : state.name
    if (state.menuList.length > 0) {
      return state.menuList
    } else {
      const menuStorage = JSON.parse(getStore(MENU_ROUTE))
      if (menuStorage && menuStorage.length > 0) {
        commit('SET_MENU', menuStorage)
        return menuStorage
      } else {
        let menuData = await http.get(`/rest/user/menu/${username}`)
        commit('SET_MENU', menuData)
        setStore(MENU_ROUTE, menuData)
        return menuData
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
