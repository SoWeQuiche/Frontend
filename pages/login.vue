<template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title>Login to SoWeQuiches</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            outlined
            hide-details
            label="Email"
            @keyup.enter="login"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            outlined
            hide-details
            label="Password"
            type="password"
            @keyup.enter="login"
          />
        </v-col>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn color="primary" text link to="forgotten-password">
            Password Forgotten
          </v-btn>
          <v-btn class="ml-3" color="primary" :loading="loading" @click="login">
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'login',
  data () {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  head () {
    return {
      title: 'Login'
    }
  },
  methods: {
    async login () {
      if (this.loading) { return }
      this.loading = true

      try {
        await this.$auth.loginWith('local', { data: { mail: this.email, password: this.password } })
        await this.$router.push('/')
      } catch (err) {}

      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
