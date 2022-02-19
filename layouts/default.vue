<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click="organization_drawer = !organization_drawer" />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>SoWeQuiches &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-navigation-drawer
      v-model="organization_drawer"
      width="300"
      absolute
      temporary
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
                v-model="selected_organization"
                item-text="name"
                item-value="_id"
                :items="organizations"
                label="Organization"
                hide-details
                outlined
                dense
                :loading="$fetchState.pending"
                no-data-text="You are not part of an organization"
                @change="getOrganizationData"
              />
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item v-if="isAdmin || isOrganizationAdmin">
          <v-row class="d-flex justify-center">
            <v-col v-if="isOrganizationAdmin" cols="3">
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
            <v-col v-if="isOrganizationAdmin" cols="3">
              <v-tooltip color="green" bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    block
                    small
                    outlined
                    color="green"
                    v-bind="attrs"
                    v-on="on"
                    @click="promote_organization_dialog = true"
                  >
                    <v-icon>
                      mdi-account-multiple-plus-outline
                    </v-icon>
                  </v-btn>
                </template>
                <span>Promote someone Admin of Organization</span>
              </v-tooltip>
            </v-col>
            <v-col v-if="isOrganizationAdmin" cols="3">
              <v-menu
                nudge-right="-60"
                nudge-top="-5"
                offset-y
              >
                <template #activator="{ on: onMenu }">
                  <v-tooltip color="red" bottom>
                    <template #activator="{ on: onTooltip }">
                      <v-btn
                        block
                        small
                        outlined
                        color="red"
                        v-on="{ ...onMenu, ...onTooltip }"
                      >
                        <v-icon>
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Delete Organization</span>
                  </v-tooltip>
                </template>

                <v-card>
                  <v-card-actions>
                    <v-btn
                      color="red"
                      outlined
                      @click="deleteOrganization"
                    >
                      Confirm Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
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
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list nav dense>
        <v-list-item
          v-for="group in groups"
          :key="group._id"
          color="primary"
          @click="logout"
        >
          <v-list-item-icon>
            <v-icon>
              mdi-account-group
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ group.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <div v-if="!groups.length" class="grey--text text-center">
        <span v-if="!groups_loading">No group available for tha Organization</span>
        <v-progress-circular v-else indeterminate />
      </div>
      <template #append>
        <div class="pa-2">
          <v-btn
            block
            color="red"
            @click="logout"
          >
            <v-icon left>
              mdi-logout
            </v-icon>
            Disconnect
          </v-btn>
        </div>
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
export default {
  name: 'DefaultLayout',
  middleware: 'auth',
  fetchOnServer: false,
  data () {
    return {
      organization_drawer: true,
      organizations: [],
      organization_name: '',
      create_organization_dialog: false,
      promote_organization_dialog: false,
      promote_organization_email: '',
      selected_organization: null,
      selected_organization_admins: [],
      groups: [],
      group_name: '',
      groups_loading: false,
      selected_group: 1,
      create_group_dialog: false
    }
  },
  fetch () {
    this.$axios.get('/organizations')
      .then(({ data }) => {
        this.organizations = data
        if (!this.selected_organization) { this.selected_organization = data[0]._id }
        this.getOrganizationData()
      })
  },
  computed: {
    user () {
      return this.$auth.user
    },
    isAdmin () {
      return this.user.isAdmin
    },
    isOrganizationAdmin () {
      return this.isAdmin || this.selected_organization_admins.includes(this.user._id)
    }
  },
  methods: {
    logout () {
      this.$auth.logout()
      this.$router.push('/login')
    },
    createOrganization () {
      this.$axios.post('/organizations', {
        name: this.organization_name
      }).then(() => {
        this.create_organization_dialog = false
        this.organization_name = ''
        this.$fetch()
      })
    },
    promoteOrganizationAdmin () {
      this.$axios.post(`/organizations/${this.selected_organization}/promote`, {
        mail: this.promote_organization_email
      }).then(() => {
        this.promote_organization_dialog = false
        this.promote_organization_email = ''
        this.$fetch()
      })
    },
    deleteOrganization () {
      this.$axios.delete(`/organizations/${this.selected_organization}`)
        .then(() => {
          this.selected_organization = null
          this.$fetch()
        })
    },
    getOrganizationData () {
      this.groups_loading = true
      this.selected_organization_admins = []
      this.groups = []

      this.$axios.get(`/organizations/${this.selected_organization}`)
        .then(({ data }) => {
          this.selected_organization_admins = data.admins
        })
        .finally(() => {
          this.groups_loading = false
        })

      this.$axios.get(`/groups/organization/${this.selected_organization}`)
        .then(({ data }) => {
          this.groups = data
        })
        .finally(() => {
          this.groups_loading = false
        })
    },
    createGroup () {
      this.groups = []
      this.$axios.post(`/groups/organization/${this.selected_organization}`, {
        name: this.group_name
      }).then(() => {
        this.create_group_dialog = false
        this.getOrganizationData()
      })
    }
  }
}
</script>
