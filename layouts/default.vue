<template>
  <v-app dark>
    <v-btn
      small
      fab
      fixed
      top
      left
      color="primary"
      @click="openOrganizationDrawer"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>SoWeQuiches &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-navigation-drawer
      v-model="organization_drawer"
      width="300"
      temporary
      fixed
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user.firstname }} {{ user.lastname }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-row class="d-flex justify-center">
            <v-col cols="12">
              <v-select
                item-text="name"
                item-value="_id"
                :items="organizations"
                :value="selected_organization._id"
                label="Organization"
                hide-details
                outlined
                dense
                :loading="loading"
                no-data-text="You are not part of an organization"
                @change="setSelectedOrganization"
              />
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item v-if="isAdmin || isOrganizationAdmin" class="mt-2">
          <v-row class="d-flex justify-center">
            <v-col cols="12">
              <v-row justify="center">
                <v-col cols="3">
                  <v-tooltip color="primary" bottom>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        block
                        small
                        outlined
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                        @click="create_group_dialog = true"
                      >
                        <v-icon>
                          mdi-account-group-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Create a Group</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="3">
                  <v-tooltip color="blue-grey" bottom>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        link
                        block
                        small
                        outlined
                        color="blue-grey"
                        :to="{ name: 'organizations-settings' }"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>
                          mdi-cog-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Organization Settings</span>
                  </v-tooltip>
                </v-col>
                <v-col v-if="isAdmin" cols="3">
                  <v-tooltip color="primary" bottom>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        block
                        small
                        outlined
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                        @click="create_organization_dialog = true"
                      >
                        <v-icon>
                          mdi-domain
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Create an Organization</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list nav dense>
        <v-list-item
          v-for="group in groups"
          :key="group._id"
          color="primary"
          link
          :to="{ name: 'groups-uid', params: { uid: group._id } }"
        >
          <v-list-item-icon>
            <v-icon>
              mdi-account-group
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ group.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <div v-if="!groups.length || groups_loading" class="grey--text text-center">
        <span v-if="!groups_loading">No group available for tha Organization</span>
        <v-progress-circular v-else indeterminate />
      </div>
      <template #append>
        <v-row class="pa-2">
          <v-col cols="3">
            <v-btn outlined @click="toggleDarkTheme">
              <v-icon>
                mdi-brightness-6
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="9">
            <v-btn
              block
              dark
              color="red"
              @click="logout"
            >
              <v-icon left>
                mdi-logout
              </v-icon>
              Disconnect
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-dialog
        v-model="create_group_dialog"
        max-width="300"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Group Creation</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="group_name"
                    label="Group Name"
                    hide-details
                    required
                    outlined
                    @keyup.enter="createGroup"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey"
              text
              @click="create_group_dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              @click="createGroup"
            >
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="user_add_organization_dialog"
        max-width="400"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Organization Member</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="user_add_organization_email"
                    label="Email"
                    hide-details
                    required
                    outlined
                    @keyup.enter="addOrganizationUser"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey"
              text
              @click="user_add_organization_dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              @click="addOrganizationUser"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="promote_organization_dialog"
        max-width="400"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Organization Administrator</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="promote_organization_email"
                    label="Email"
                    hide-details
                    required
                    outlined
                    @keyup.enter="promoteOrganizationAdmin"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey"
              text
              @click="promote_organization_dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="green"
              @click="promoteOrganizationAdmin"
            >
              Promote
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="create_organization_dialog"
        max-width="300"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Organization Creation</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="organization_name"
                    label="Organization Name"
                    hide-details
                    required
                    outlined
                    @keyup.enter="createOrganization"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey"
              text
              @click="create_organization_dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              @click="createOrganization"
            >
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  middleware: 'auth',
  fetchOnServer: false,
  data () {
    return {
      loading: false,
      organization_drawer: false,
      organization_name: '',
      create_organization_dialog: false,
      user_add_organization_dialog: false,
      user_add_organization_email: '',
      promote_organization_dialog: false,
      promote_organization_email: '',
      group_name: '',
      selected_group: 1,
      create_group_dialog: false
    }
  },
  computed: {
    ...mapState('organizations', {
      organizations: state => state.organizations,
      selected_organization: state => state.selected_organization,
      selected_organization_admins: state => state.selected_organization_admins
    }),
    ...mapState('groups', {
      groups: state => state.groups,
      groups_loading: state => state.loading
    }),
    user () {
      return this.$auth.user
    },
    isAdmin () {
      return this.user.isAdmin
    },
    isOrganizationAdmin () {
      return this.isAdmin || this.selected_organization_admins.find(admins => admins._id === this.user._id)
    }
  },
  mounted () {
    if (!localStorage.getItem('theme') && this.$vuetify.theme.dark) {
      localStorage.setItem('theme', 'dark')
    }

    this.$vuetify.theme.dark = localStorage.getItem('theme') === 'dark'
  },
  methods: {
    ...mapActions('organizations', [
      'fetchOrganizations',
      'fetchOrganizationAdmins',
      'fetchOrganizationUsers',
      'deleteOrganization'
    ]),
    ...mapActions('groups', [
      'fetchGroups'
    ]),
    ...mapMutations('organizations', [
      'setSelectedOrganizationById'
    ]),
    logout () {
      this.$auth.logout()
      this.$router.push('/login')
    },
    async openOrganizationDrawer () {
      this.organization_drawer = true

      this.loading = true
      await this.fetchOrganizations()
      await this.fetchOrganizationAdmins()
      this.loading = false
    },
    createOrganization () {
      this.$axios.post('/organizations', {
        name: this.organization_name
      }).then(() => {
        this.create_organization_dialog = false
        this.organization_name = ''
        this.fetchOrganizations()
      })
    },
    addOrganizationUser () {
      this.$axios.post(`/organizations/${this.selected_organization._id}/users`, {
        mail: this.user_add_organization_email
      }).then(() => {
        this.user_add_organization_dialog = false
        this.user_add_organization_email = ''
      })
    },
    promoteOrganizationAdmin () {
      this.$axios.post(`/organizations/${this.selected_organization._id}/admins`, {
        mail: this.promote_organization_email
      }).then(() => {
        this.promote_organization_dialog = false
        this.promote_organization_email = ''
      })
    },
    createGroup () {
      this.$axios.post(`/groups/organization/${this.selected_organization._id}`, {
        name: this.group_name
      }).then(() => {
        this.create_group_dialog = false
        this.fetchGroups()
      })
    },
    toggleDarkTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('theme', this.$vuetify.theme.dark ? 'dark' : 'light')
    },
    setSelectedOrganization (organization) {
      this.setSelectedOrganizationById(organization)
      this.fetchOrganizationAdmins()
      this.fetchOrganizationUsers()
      this.fetchGroups()
    }
  }
}
</script>
