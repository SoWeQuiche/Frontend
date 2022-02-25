<template>
  <v-col cols="12" md="6" lg="4" xl="3">
    <v-card
      class="hoverScale"
      outlined
      link
      :to="{ name: 'groups-groupId-sessionId', params: { groupId: selectedGroup._id, sessionId: session._id } }"
      :color="session.status | cardColor"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            {{ selectedGroup.name }}
          </v-list-item-title>
          <v-list-item-subtitle />
        </v-list-item-content>

        <v-tooltip :color="session.status | cardIconColor" left>
          <template #activator="{ on, attrs }">
            <v-list-item-avatar tile size="64" v-bind="attrs" v-on="on">
              <v-icon :color="session.status | cardIconColor" large>
                {{ session.status | cardIcon }}
              </v-icon>
            </v-list-item-avatar>
          </template>
          <span>{{ session.status | cardIconDescription }}</span>
        </v-tooltip>
      </v-list-item>

      <v-card-text class="pt-0 d-flex flex-column flex-sm-row align-center">
        <div>
          <v-chip color="grey darken-2" dark>
            {{ session.day }}
          </v-chip>
          <span class="mx-1">from</span>
        </div>
        <div class="mt-2 mt-sm-0">
          <v-chip color="grey darken-2" dark>
            {{ session.from_time }}
          </v-chip>
          <span class="mx-1">to</span>
          <v-chip color="grey darken-2" dark>
            {{ session.to_time }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'SessionCard',
  filters: {
    cardColor (status) {
      switch (status) {
        case 'signing':
          return '#2196F333'
        case 'coming':
          return '#00968833'
        case 'passed':
          return '#42424233'
        default:
          return ''
      }
    },
    cardIcon (status) {
      switch (status) {
        case 'signing':
          return 'mdi-draw'
        case 'coming':
          return 'mdi-clock-outline'
        case 'passed':
          return 'mdi-progress-clock'
        default:
          return ''
      }
    },
    cardIconColor (status) {
      switch (status) {
        case 'signing':
          return 'primary'
        case 'coming':
          return 'teal'
        case 'passed':
          return 'grey darken-3'
        default:
          return ''
      }
    },
    cardIconDescription (status) {
      switch (status) {
        case 'signing':
          return 'Signing'
        case 'coming':
          return 'To come'
        case 'passed':
          return 'Ended'
        default:
          return ''
      }
    }
  },
  props: {
    session: {
      type: Object,
      required: true
    },
    selectedGroup: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
