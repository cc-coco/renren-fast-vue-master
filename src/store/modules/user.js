export default {
  namespaced: true,
  state: {
    id: 0,
    name: "",
    distinguishing: ""
  },
  mutations: {
    updateId(state, id) {
      state.id = id;
    },
    updateName(state, name) {
      state.name = name;
    },
    updateDistinguishing(state, distinguishing) {
      state.distinguishing = distinguishing;
    }
  }
};
