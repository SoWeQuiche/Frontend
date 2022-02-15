<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon />
      <v-spacer />
      <v-btn color="error" @click="logout">
        <v-icon left>
          mdi-logout
        </v-icon>
        Disconnect
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: 'auth',
  data () {
    return {}
  },
  methods: {
    logout () {
      this.$auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>
