<template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title>
      <v-btn icon class="mr-3" link to="/login">
        <v-icon>
          mdi-arrow-left
        </v-icon>
      </v-btn>
      Forgotten Password
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field outlined hide-details label="Login" />
        </v-col>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn class="ml-3" color="primary" @click="login">
            Send Request
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
      title: 'Forgotten Password'
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
