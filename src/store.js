import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapInstance: null
  },
  getters: {
    mapInstance: state => state.mapInstance
  },
  mutations: {
    setMapInstance (state, mapInstance) {
      state.mapInstance = mapInstance
    }
  },
  actions: {

  }
})
