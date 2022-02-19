<template>
  <v-row>
    <v-col cols="12" class="pl-12 py-2">
      <v-breadcrumbs :items="breadcrumbs" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  computed: {
    breadcrumbs () {
      return [
        {
          text: 'Dashboard'
        }
      ]
    }

  }
}
</script>
