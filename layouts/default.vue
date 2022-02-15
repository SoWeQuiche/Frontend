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
      <span>&copy; {{ new Date().getFullYear() }}</span>
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
          <v-select
            v-model="selected_organization"
            :items="organizations"
            hide-details
            outlined
            dense
            no-data-text="You are not part of an organization"
          />
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
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: 'auth',
  data () {
    return {
      organization_drawer: false,
      organizations: [
        { text: 'Organization 1', value: 1 },
        { text: 'Organization 2', value: 2 },
        { text: 'Organization 3', value: 3 },
        { text: 'Organization 4', value: 4 },
        { text: 'Organization 5', value: 5 },
        { text: 'Organization 6', value: 6 },
        { text: 'Organization 7', value: 7 },
        { text: 'Organization 8', value: 8 },
        { text: 'Organization 9', value: 9 },
        { text: 'Organization 10', value: 10 }
      ],
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
      selected_group: 1
    }
  },
  computed: {
    user () {
      return this.$auth.user
    }
  },
  methods: {
    logout () {
      this.$auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>
