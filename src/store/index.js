import { createStore } from 'vuex';

export default createStore({
  state: {
    mapInstance: null,
  },
  getters: {
    mapInstance: (state) => state.mapInstance,
  },
  mutations: {
    setMapInstance(state, mapInstance) {
      state.mapInstance = mapInstance;
    },
  },
  actions: {
  },
  modules: {
  },
});
