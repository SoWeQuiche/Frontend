const state = () => ({
  groups: [],
  loading: false
})

const getters = {}

const actions = {
  async fetchGroups ({ commit, rootState: { organizations } }) {
    commit('setLoading', true)
    commit('setGroups', [])

    const groups = await this.$axios.$get(`/groups/organization/${organizations?.selected_organization._id}`)

    commit('setGroups', groups)
    commit('setLoading', false)
  }
}

const mutations = {
  setGroups (state, groups) {
    state.groups = groups || []
  },
  setLoading (state, loading) {
    state.loading = loading
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
