<template>
  <v-row>
    <v-col cols="12" class="pl-12 py-2">
      <v-breadcrumbs :items="breadcrumbs" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'GroupPage',
  head () {
    return {
      title: 'Group ' + this.uid
    }
  },
  computed: {
    uid () {
      return this.$route.params.uid
    },
    breadcrumbs () {
      return [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/'
        },
        {
          text: 'Group ' + this.$route.params.uid
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
