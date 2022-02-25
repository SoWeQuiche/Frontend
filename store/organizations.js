const state = () => ({
  organizations: [],
  selected_organization: {},
  selected_organization_admins: []
})

const getters = {}

const actions = {
  async fetchOrganizations ({ commit, dispatch }) {
    const organizations = await this.$axios.$get('/organizations')
    commit('setOrganizations', organizations)
    dispatch('fetchOrganizationAdmins')
  },
  async fetchOrganizationAdmins ({ state, commit }) {
    const organizationAdmins = await this.$axios.$get(`/organizations/${state.selected_organization._id}/admins`)
    commit('setOrganizationAdmins', organizationAdmins)
  }
}

const mutations = {
  setOrganizations (state, organizations) {
    state.organizations = organizations
    state.selected_organization = organizations[0]
  },
  setOrganizationAdmins (state, organizationAdmins) {
    state.selected_organization_admins = organizationAdmins
  },
  setSelectedOrganization (state, organization) {
    state.selected_organization = organization
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
