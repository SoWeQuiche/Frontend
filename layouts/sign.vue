<template>
  <v-app>
    <v-main class="pb-4 d-flex align-center">
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>SoWeQuiches &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'SignLayout',
  middleware: 'auth'
}
</script>

<style scoped>

</style>
