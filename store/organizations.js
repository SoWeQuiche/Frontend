const state = () => ({
  organizations: [],
  selected_organization: {},
  selected_organization_admins: [],
  selected_organization_users: []
})

const getters = {}

const actions = {
  async fetchOrganization ({ commit, state }, organizationId) {
    if (state.selected_organization?._id === organizationId) { return }

    const organization = await this.$axios.$get(`/organizations/${organizationId}`)
    commit('setSelectedOrganization', organization)
  },
  async fetchOrganizations ({ commit }) {
    const organizations = await this.$axios.$get('/organizations')
    commit('setOrganizations', organizations)
    commit('setSelectedOrganization', organizations[0] || {})
  },
  async fetchOrganizationAdmins ({ state, commit }) {
    const organizationAdmins = await this.$axios.$get(`/organizations/${state.selected_organization._id}/admins`)
    commit('setOrganizationAdmins', organizationAdmins)
  },
  async fetchOrganizationUsers ({ state, commit }) {
    const organizationUsers = await this.$axios.$get(`/organizations/${state.selected_organization._id}/users`)
    commit('setOrganizationUsers', organizationUsers)
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
