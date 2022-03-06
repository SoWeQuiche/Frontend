<template>
  <v-container class="text-center">
    <v-row>
      <v-col cols="12" class="px-0 d-flex justify-center">
        <signature-canvas ref="canvas" @save="saveSignature" />
      </v-col>
      <v-col cols="12" />
    </v-row>
  </v-container>
</template>

<script>
import { v4 as UUIDv4 } from 'uuid'

export default {
  name: 'SignPage',
  layout: 'sign',
  head () {
    return {
      title: 'SignPage'
    }
  },
  computed: {
    uid () {
      return this.$route.params.uid
    }
  },
  mounted () {
    // this.$vuetify.theme.dark = false
  },
  methods: {
    async saveSignature (signature) {
      const signatureBlob = await fetch(signature).then(res => res.blob())

      const formData = new FormData()
      formData.append('file', signatureBlob, `${UUIDv4()}.png`)

      console.log(signature)

      // const { data } = await this.$axios.post('/files/upload', formData, {
      //   headers: { 'content-type': 'multipart/form-data' }
      // })
      //
      // console.log(data)
    }
  }
}
</script>

<style scoped>

</style>
