<template>
  <v-col cols="12" md="6" lg="4" xl="3">
    <v-card
      class="hoverScale"
      outlined
      link
      :to="{ name: 'groups-groupId-sessionId', params: { groupId: selectedGroup._id, sessionId: session._id } }"
      :color="session.status | cardColor"
      @contextmenu.stop.prevent="showMenu"
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

    <v-menu
      v-model="menu.show"
      :position-x="menu.x"
      :position-y="menu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item>
          <v-btn outlined color="red" @click="deleteSession">
            <v-icon left>
              mdi-delete
            </v-icon>
            Delete
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-col>
</template>

<script>
export default {
  name: 'SessionCard',
  filters: {
    cardColor (status) {
      const returnColor = {
        signing: '#2196F333',
        coming: '#00968833',
        passed: '#42424233'
      }

      return returnColor[status] || ''
    },
    cardIcon (status) {
      const returnIcon = {
        signing: 'mdi-draw',
        coming: 'mdi-clock-outline',
        passed: 'mdi-progress-clock'
      }

      return returnIcon[status] || ''
    },
    cardIconColor (status) {
      const returnIconColor = {
        signing: 'primary',
        coming: 'teal',
        passed: 'grey darken-3'
      }

      return returnIconColor[status] || ''
    },
    cardIconDescription (status) {
      const returnIconDescription = {
        signing: 'Signing',
        coming: 'To come',
        passed: 'Ended'
      }

      return returnIconDescription[status] || ''
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
  },
  data () {
    return {
      menu: {
        show: false,
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    showMenu (e) {
      this.menu.show = true
      this.menu.x = e.clientX
      this.menu.y = e.clientY

      this.$nextTick(() => {
        this.menu.show = true
      })
    },
    deleteSession () {
      this.$emit('delete', this.session._id)
    }
  }
}
</script>

<style scoped>

</style>
