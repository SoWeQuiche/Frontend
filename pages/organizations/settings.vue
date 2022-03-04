<template>
  <v-row>
    <v-col cols="12" class="pl-12 py-2">
      <v-breadcrumbs :items="breadcrumbs" class="d-inline-block" />
    </v-col>
    <v-col cols="12">
      <h1 class="text-h4 text-center">
        Settings for organization
        <span class="grey--text" v-text="selected_organization.name" />
      </h1>
    </v-col>
    <v-col cols="12">
      <v-container>
        <v-row>
          <v-col cols="12">
            <UserTableManagement
              title="Users List"
              :users="selected_organization_users"
              @user:add="addUserToOrganization"
              @user:delete="deleteUserFromOrganization"
            />
          </v-col>
          <v-col cols="12">
            <UserTableManagement
              title="Admins List"
              :users="selected_organization_admins"
              is-promote
              @user:add="addAdminToOrganization"
              @user:delete="deleteAdminFromOrganization"
            />
          </v-col>
          <v-col v-if="isAdmin" cols="12">
            <v-card outlined class="borderRed">
              <v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center">
                <div>
                  <div class="subtitle-1" :class="{ 'black--text': !$vuetify.theme.dark, 'white--text': $vuetify.theme.dark }">
                    Delete this Organization
                  </div>
                  <div>
                    Once you delete a organization, there is no going back. Please be certain.
                  </div>
                </div>
                <v-menu
                  :nudge-right="isMobile ? 7 : -10"
                  :nudge-top="isMobile ? -10 : 0"
                  :offset-x="!isMobile"
                  :offset-y="isMobile"
                  left
                  max-width="187"
                >
                  <template #activator="{ on }">
                    <v-btn color="red" outlined class="mt-3 mt-sm-0" v-on="on">
                      <v-icon left>
                        mdi-delete
                      </v-icon>
                      Delete Organization
                    </v-btn>
                  </template>

                  <v-btn color="red" dark @click="deleteOrganizationAction">
                    <v-icon left>
                      mdi-alert-outline
                    </v-icon>
                    Confirm Delete
                  </v-btn>
                </v-menu>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex/dist/vuex.esm.browser'

export default {
  name: 'SettingsPage',
  async fetch () {
    if (this.selected_organization._id) {
      this.fetchOrganizationAdmins().then()
      this.fetchOrganizationUsers().then()
    } else {
      await this.fetchOrganizations()
    }
  },
  computed: {
    ...mapState('organizations', {
      selected_organization: state => state.selected_organization,
      selected_organization_users: state => state.selected_organization_users,
      selected_organization_admins: state => state.selected_organization_admins
    }),
    user () {
      return this.$auth.user
    },
    isAdmin () {
      return this.user.isAdmin
    },
    isMobile () {
      return this.$vuetify.breakpoint.xs
    },
    breadcrumbs () {
      return [
        {
          text: 'Dashboard',
          to: '/'
        },
        {
          text: 'Organization Settings'
        }
      ]
    }
  },
  methods: {
    ...mapActions('organizations', [
      'fetchOrganization',
      'fetchOrganizations',
      'fetchOrganizationUsers',
      'addUserToOrganization',
      'deleteUserFromOrganization',
      'fetchOrganizationAdmins',
      'addAdminToOrganization',
      'deleteAdminFromOrganization',
      'deleteOrganization'
    ]),
    async deleteOrganizationAction () {
      await this.deleteOrganization()
      await this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.borderRed {
  border: 1px solid #F44336;
}
</style>
