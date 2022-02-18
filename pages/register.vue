<template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title>
      <v-btn icon class="mr-3" link to="/login">
        <v-icon>
          mdi-arrow-left
        </v-icon>
      </v-btn>
      Register to SoWeQuiches
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            disabled
            outlined
            hide-details
            label="Email"
            type="email"
            @keyup.enter="register"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="firstname"
            outlined
            hide-details
            label="First Name"
            @keyup.enter="register"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="lastname"
            outlined
            hide-details
            label="Last Name"
            @keyup.enter="register"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            outlined
            label="Password"
            type="password"
            :hide-details="!passwordNotIdenticalMessage"
            :error-messages="passwordNotIdenticalMessage"
            @keyup="passwordNotIdentical = false"
            @keyup.enter="register"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="passwordConfirm"
            outlined
            label="Confirm Password"
            type="password"
            :hide-details="!passwordNotIdenticalMessage"
            :error-messages="passwordNotIdenticalMessage"
            @keyup="passwordNotIdentical = false"
            @keyup.enter="register"
          />
        </v-col>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn class="ml-3" color="primary" :loading="loading" @click="register">
            Register
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
      code: '',
      email: 'john@doe.mail',
      firstname: '',
      lastname: '',
      password: '',
      passwordConfirm: '',
      passwordNotIdentical: false,
      loading: false
    }
  },
  head () {
    return {
      title: 'Register'
    }
  },
  computed: {
    passwordNotIdenticalMessage () {
      return this.passwordNotIdentical ? 'Passwords do not match' : ''
    }
  },
  mounted () {
    this.code = this.$route.query.code
    this.email = this.$route.query.mail

    if (!this.code && !this.email) { this.$router.push('/login') }
  },
  methods: {
    register () {
      if (this.loading) { return }

      if (this.password !== this.passwordConfirm) {
        this.passwordNotIdentical = true
        return
      }

      this.loading = true

      this.$axios.post('/auth/activate', {
        code: this.code,
        firstname: this.firstname,
        lastname: this.lastname,
        password: this.password
      }).then(() => {
        this.$router.push('/login')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
