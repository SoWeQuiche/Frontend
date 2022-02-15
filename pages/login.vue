<template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title>Login to SoWeQuiches</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field outlined hide-details label="Login" />
        </v-col>
        <v-col cols="12">
          <v-text-field outlined hide-details label="Password" type="password" />
        </v-col>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn color="primary" text link to="forgotten-password">
            Password Forgotten
          </v-btn>
          <v-btn class="ml-3" color="primary" @click="login">
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
  head () {
    return {
      title: 'Login'
    }
  },
  methods: {
    login () {
      // this.$router.push('/dashboard');
    }
  }
}
</script>

<style scoped>

</style>
