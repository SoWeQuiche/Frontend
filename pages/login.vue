<template>
  <v-card class="mx-auto" outlined max-width="500">
    <v-card-title>Login to SoWeQuiches</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            outlined
            hide-details
            label="Email"
            type="email"
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
            Forgotten Password
          </v-btn>
          <v-btn class="ml-3" color="primary" :loading="loading" @click="login">
            Login
          </v-btn>
          <v-btn class="ml-3" :color="$vuetify.theme.dark ? 'white' : 'black'" :loading="loading_apple" @click="loginApple">
            <v-icon :color="$vuetify.theme.dark ? 'black' : 'white'">
              mdi-apple
            </v-icon>
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
      loading: false,
      loading_apple: false
    }
  },
  head () {
    return {
      title: 'Login',
      script: [
        {
          src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
        }
      ],
      meta: [
        {
          name: 'appleid-signin-client-id',
          content: this.$config.APPLE_CLIENT_ID
        },
        {
          name: 'appleid-signin-scope',
          content: 'name email'
        },
        {
          name: 'appleid-signin-redirect-uri',
          content: this.$config.APPLE_REDIRECT_URI
        },
        {
          name: 'appleid-signin-use-popup',
          content: true
        }
      ]
    }
  },
  methods: {
    async login () {
      if (this.loading) { return }
      this.loading = true

      try {
        await this.$auth.loginWith('local', { data: { mail: this.email, password: this.password } })
      } catch (err) {}

      this.loading = false
    },
    async loginApple () {
      if (this.loading_apple) { return }
      this.loading_apple = true

      try {
        // eslint-disable-next-line no-undef
        const data = await AppleID.auth.signIn()
        await this.$auth.loginWith('apple', { data })
      } catch (error) {}

      this.loading_apple = false
    }
  }
}
</script>

<style scoped>

</style>
