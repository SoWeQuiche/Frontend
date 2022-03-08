<template>
  <v-row>
    <v-col cols="12" class="pl-12 py-2">
      <v-breadcrumbs :items="breadcrumbs" class="d-inline-block" />
    </v-col>
    <v-col cols="12">
      <h1 class="text-h4 text-center">
        Settings for group
        <span class="grey--text" v-text="selected_group.name" />
      </h1>
    </v-col>
    <v-col cols="12">
      <v-container>
        <v-row>
          <v-col cols="12">
            <user-table-management
              title="Users List"
              :users="selected_group_users"
              :existing-users="selected_organization_users"
              add-existing-user
              @user:add="addUserToGroup"
              @user:delete="deleteUserFromGroup"
            />
          </v-col>
          <v-col cols="12">
            <user-table-management
              title="Admins List"
              :users="selected_group_admins"
              is-promote
              @user:add="addAdminToGroup"
              @user:delete="deleteAdminFromGroup"
            />
          </v-col>
          <v-col cols="12">
            <v-card outlined class="borderRed">
              <v-card-text class="d-flex flex-column flex-sm-row justify-space-between align-center">
                <div>
                  <div class="subtitle-1" :class="{ 'black--text': !$vuetify.theme.dark, 'white--text': $vuetify.theme.dark }">
                    Delete this Group
                  </div>
                  <div>
                    Once you delete a group, there is no going back. Please be certain.
                  </div>
                </div>
                <v-menu
                  :nudge-right="isMobile ? 7 : -10"
                  :nudge-top="isMobile ? -10 : 0"
                  :offset-x="!isMobile"
                  :offset-y="isMobile"
                  left
                >
                  <template #activator="{ on }">
                    <v-btn color="red" outlined class="mt-3 mt-sm-0" v-on="on">
                      <v-icon left>
                        mdi-delete
                      </v-icon>
                      Delete Group
                    </v-btn>
                  </template>

                  <v-btn color="red" dark @click="deleteGroupAction">
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
import { mapActions, mapState } from 'vuex'
import UserTableManagement from '~/components/UserTableManagement'

export default {
  name: 'SettingsPage',
  components: { UserTableManagement },
  data () {
    return {}
  },
  async fetch () {
    await this.fetchGroup(this.uid)
    this.fetchGroupAdmins().then()
    this.fetchGroupUsers().then()

    await this.fetchOrganization(this.selected_group.organization)
    this.fetchOrganizationUsers().then()
  },
  head () {
    return {
      title: `Group - ${this.selected_group.name} - Settings`
    }
  },
  computed: {
    ...mapState('organizations', {
      selected_organization_users: state => state.selected_organization_users
    }),
    ...mapState('groups', {
      selected_group: state => state.selected_group,
      selected_group_admins: state => state.selected_group_admins,
      selected_group_users: state => state.selected_group_users
    }),
    uid () {
      return this.$route.params.groupId
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
          text: `Group - ${this.selected_group.name}`,
          link: true,
          exact: true,
          to: {
            name: 'groups-uid',
            params: {
              uid: this.$route.params.groupId
            }
          }
        },
        {
          text: 'Settings'
        }
      ]
    }
  },
  methods: {
    ...mapActions('organizations', [
      'fetchOrganization',
      'fetchOrganizationUsers'
    ]),
    ...mapActions('groups', [
      'fetchGroup',
      'fetchGroupAdmins',
      'fetchGroupUsers',
      'addUserToGroup',
      'addAdminToGroup',
      'deleteUserFromGroup',
      'deleteAdminFromGroup',
      'deleteGroup'
    ]),
    async deleteGroupAction () {
      await this.deleteGroup()
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
