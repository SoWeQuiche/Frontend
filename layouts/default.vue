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
          <v-row>
            <v-col :cols="isAdmin ? 9 : 12">
              <v-select
                v-model="selected_organization"
                item-text="name"
                item-value="_id"
                :items="organizations"
                hide-details
                outlined
                dense
                :loading="$fetchState.pending"
                no-data-text="You are not part of an organization"
              />
            </v-col>
            <v-col v-if="isAdmin" cols="3" class="d-flex justify-end align-center">
              <v-tooltip color="primary" bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    block
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    @click="create_organization_dialog = true"
                  >
                    <v-icon>
                      mdi-plus
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
          :key="group.id"
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
      <template #append>
        <div class="pa-2">
          <v-btn block color="red" @click="logout">
            <v-icon left>
              mdi-logout
            </v-icon>
            Disconnect
          </v-btn>
        </div>
      </template>
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
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
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
      selected_organization: 1,
      groups: [
        { name: 'Group 1', id: 1 },
        { name: 'Group 2', id: 2 },
        { name: 'Group 3', id: 3 },
        { name: 'Group 4', id: 4 },
        { name: 'Group 5', id: 5 },
        { name: 'Group 6', id: 6 },
        { name: 'Group 7', id: 7 },
        { name: 'Group 8', id: 8 },
        { name: 'Group 9', id: 9 },
        { name: 'Group 10', id: 10 }
      ],
      selected_group: 1,
      create_organization_dialog: false,
      organization_name: ''
    }
  },
  fetch () {
    this.$axios.get('/organizations')
      .then(({ data }) => {
        this.organizations = data
        this.selected_organization = data[0]._id
        this.getOrganizationGroups()
      })
  },
  computed: {
    user () {
      return this.$auth.user
    },
    isAdmin () {
      return this.user.isAdmin
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
    getOrganizationGroups () {
      this.$axios.get(`/organizations/${this.selected_organization}`)
        .then(({ data }) => {
          console.log(data)
        })
    }
  }
}
</script>
