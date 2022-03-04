const state = () => ({
  organizations: [],
  selected_organization: {},
  selected_organization_admins: [],
  selected_organization_users: []
})

const getters = {}

const actions = {
  async fetchOrganization ({ commit, state, dispatch }, organizationId) {
    if (state.selected_organization?._id === organizationId) { return }

    if (state.selected_organization?._id !== organizationId) {
      const organization = await this.$axios.$get(`/organizations/${organizationId}`)
      commit('setSelectedOrganization', organization)
      dispatch('fetchOrganizationUsers')
      dispatch('fetchOrganizationAdmins')
    }

    await dispatch('groups/fetchGroups', null, { root: true })
  },
  async fetchOrganizations ({ commit, state, dispatch, rootState }) {
    const organizations = await this.$axios.$get('/organizations')
    commit('setOrganizations', organizations)

    if (!state.selected_organization._id) {
      if (organizations[0]._id) {
        dispatch('fetchOrganization', organizations[0]._id)
      } else {
        commit('setSelectedOrganization', {})
      }
    }

    if (state.selected_organization._id !== rootState.groups.selected_group.organization) {
      await dispatch('groups/fetchGroups', null, { root: true })
    }
  },
  async fetchOrganizationUsers ({ state, commit }) {
    const organizationUsers = await this.$axios.$get(`/organizations/${state.selected_organization._id}/users`)
    commit('setOrganizationUsers', organizationUsers)
  },
  async addUserToOrganization ({ state, commit, dispatch }, mail) {
    await this.$axios.$post(`/organizations/${state.selected_organization._id}/users`, { mail })
    dispatch('fetchOrganizationUsers')
  },
  async deleteUserFromOrganization ({ state, commit, dispatch }, userId) {
    await this.$axios.$delete(`/organizations/${state.selected_organization._id}/users/${userId}`)
    dispatch('fetchOrganizationUsers')
  },
  async fetchOrganizationAdmins ({ state, commit }) {
    const organizationAdmins = await this.$axios.$get(`/organizations/${state.selected_organization._id}/admins`)
    commit('setOrganizationAdmins', organizationAdmins)
  },
  async addAdminToOrganization ({ state, commit, dispatch }, mail) {
    await this.$axios.$post(`/organizations/${state.selected_organization._id}/admins`, { mail })
    dispatch('fetchOrganizationAdmins')
  },
  async deleteAdminFromOrganization ({ state, commit, dispatch }, userId) {
    await this.$axios.$delete(`/organizations/${state.selected_organization._id}/admins/${userId}`)
    dispatch('fetchOrganizationAdmins')
  },
  async deleteOrganization ({ state, commit, dispatch }) {
    await this.$axios.$delete(`/organizations/${state.selected_organization._id}`)
    commit('setSelectedOrganization', state.organizations[0] || {})
    dispatch('fetchOrganizations')
  }
}

const mutations = {
  setOrganizations (state, organizations) {
    state.organizations = organizations || []
  },
  setSelectedOrganization (state, organization) {
    state.selected_organization = organization
  },
  setOrganizationAdmins (state, organizationAdmins) {
    state.selected_organization_admins = organizationAdmins
  },
  setOrganizationUsers (state, organizationUsers) {
    state.selected_organization_users = organizationUsers
  },
  setSelectedOrganizationById (state, organization) {
    state.selected_organization = state.organizations.find(org => org._id === organization)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
