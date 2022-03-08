const state = () => ({
  groups: [],
  selected_group: {},
  selected_group_admins: [],
  selected_group_users: [],
  loading: false
})

const getters = {}

const actions = {
  async fetchGroup ({ state, commit }, groupId) {
    commit('setLoading', true)

    if (state.selected_group?._id !== groupId) {
      const group = await this.$axios.$get(`/groups/${groupId}`)
      commit('setSelectedGroup', group)
      commit('setSelectedGroupAdmins', [])
      commit('setSelectedGroupUsers', [])
    }

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
  async addUserToGroup ({ state, commit, dispatch }, mail) {
    await this.$axios.$post(`/groups/${state.selected_group?._id}/users`, { mail })
    dispatch('fetchGroupUsers')
  },
  async deleteUserFromGroup ({ state, commit, dispatch }, userId) {
    await this.$axios.$delete(`/groups/${state.selected_group?._id}/users/${userId}`)
    dispatch('fetchGroupUsers')
  },
  async fetchGroupUsers ({ state, commit }) {
    const groupUsers = await this.$axios.$get(`/groups/${state.selected_group?._id}/users`)
    commit('setSelectedGroupUsers', groupUsers)
  },
  async addAdminToGroup ({ state, commit, dispatch }, mail) {
    await this.$axios.$post(`/groups/${state.selected_group?._id}/admins`, { mail })
    dispatch('fetchGroupAdmins')
  },
  async deleteAdminFromGroup ({ state, commit, dispatch }, userId) {
    await this.$axios.$delete(`/groups/${state.selected_group?._id}/admins/${userId}`)
    dispatch('fetchGroupAdmins')
  },
  async deleteGroup ({ state, commit, dispatch }) {
    await this.$axios.$delete(`/groups/${state.selected_group?._id}`)
    commit('setSelectedGroup', {})
    dispatch('fetchGroups')
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
