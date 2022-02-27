<template>
  <v-app dark>
    <v-main class="d-flex justify-center align-center">
      <v-container fluid class="text-center">
        <h1 v-if="error.statusCode === 404" class="text-h1">
          {{ pageNotFound }}
        </h1>
        <h1 v-else>
          {{ otherError }}
        </h1>
        <v-btn color="primary" to="/" class="mt-10">
          <v-icon left>
            mdi-home
          </v-icon>
          Home page
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
