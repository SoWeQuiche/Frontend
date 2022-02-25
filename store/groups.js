const state = () => ({
  groups: [],
  selected_group: {},
  selected_group_admins: [],
  selected_group_users: [],
  loading: false
})

const getters = {}

const actions = {
  async fetchGroup ({ commit }, groupId) {
    commit('setLoading', true)

    const group = await this.$axios.$get(`/groups/${groupId}`)
    commit('setSelectedGroup', group)

    commit('setLoading', false)
  },
  async fetchGroups ({ commit, rootState: { organizations } }) {
    commit('setLoading', true)

    const groups = await this.$axios.$get(`/groups/organization/${organizations?.selected_organization._id}`)
    commit('setGroups', groups)

    commit('setLoading', false)
  },
  async fetchGroupAdmins ({ state, commit }) {
    const groupAdmins = await this.$axios.$get(`/groups/${state.selected_group?._id}/admins`)
    commit('setSelectedGroupAdmins', groupAdmins)
  },
  async fetchGroupUsers ({ state, commit }) {
    const groupUsers = await this.$axios.$get(`/groups/${state.selected_group?._id}/users`)
    commit('setSelectedGroupUsers', groupUsers)
  }
}

const mutations = {
  setGroups (state, groups) {
    state.groups = groups || []
  },
  setSelectedGroup (state, group) {
    state.selected_group = group || {}
  },
  setSelectedGroupAdmins (state, selectedGroupAdmins) {
    state.selected_group_admins = selectedGroupAdmins || []
  },
  setSelectedGroupUsers (state, selectedGroupUsers) {
    state.selected_group_users = selectedGroupUsers || []
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
