<template>
  <v-row>
    <v-col cols="12" class="pl-12 py-2">
      <v-breadcrumbs :items="breadcrumbs" class="d-inline-block" />
    </v-col>
    <v-expand-transition>
      <v-col v-if="isOrganizationAdmin" cols="12" class="text-center">
        <v-card outlined class="d-inline-block">
          <v-card-title class="d-flex justify-center">
            <div class="text-h4">
              Administration Panel
            </div>
          </v-card-title>

          <v-card-actions class="d-flex flex-column flex-sm-row justify-center">
            <v-btn color="primary" outlined @click="create_session_dialog = true">
              <v-icon left>
                mdi-clock-outline
              </v-icon>
              Add Session
            </v-btn>
            <v-btn
              color="blue-grey"
              class="mt-2 mt-sm-0"
              outlined
              link
              :to="{ name: 'groups-groupId-settings', params: { groupId: uid } }"
            >
              <v-icon left>
                mdi-cog-outline
              </v-icon>
              Settings
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-expand-transition>
    <v-col cols="12">
      <v-container>
        <v-row>
          <v-col cols="12" md="10" offset-md="1" lg="8" offset-lg="2">
            <v-expansion-panels v-model="session_groups_panels" flat mandatory>
              <v-card outlined :loading="$fetchState.pending" width="100%">
                <v-expansion-panel :key="0" class="transparent">
                  <v-expansion-panel-header>
                    Active Session
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col
                        v-for="index in $fetchState.pending && !groupSessions.signing.length ? [0, 1] : []"
                        :key="index"
                        cols="12"
                        md="6"
                        lg="4"
                        xl="3"
                      >
                        <v-card outlined>
                          <v-skeleton-loader
                            type="card-heading, list-item-three-line"
                            height="144"
                          />
                        </v-card>
                      </v-col>
                      <session-card
                        v-for="session in groupSessions.signing"
                        :key="session._id"
                        :session="session"
                        :selected-group="selected_group"
                        @delete="deleteSession"
                      />
                      <v-col v-if="!$fetchState.pending && !groupSessions.signing.length" class="grey--text">
                        No active sessions
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>
              <v-card outlined width="100%" class="my-2">
                <v-expansion-panel class="transparent">
                  <v-expansion-panel-header>Coming Sessions</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <session-card
                        v-for="session in groupSessions.coming"
                        :key="session._id"
                        :session="session"
                        :selected-group="selected_group"
                        @delete="deleteSession"
                      />
                      <v-col v-if="!groupSessions.coming.length" class="grey--text">
                        No coming sessions
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>
              <v-card outlined width="100%">
                <v-expansion-panel class="transparent">
                  <v-expansion-panel-header>Passed Sessions</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <session-card
                        v-for="session in groupSessions.passed"
                        :key="session._id"
                        :session="session"
                        :selected-group="selected_group"
                        @delete="deleteSession"
                      />
                      <v-col v-if="!groupSessions.passed.length" class="grey--text">
                        No passed sessions
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-col>

    <v-dialog v-model="create_session_dialog" max-width="600">
      <v-card :loading="create_session_loading">
        <v-card-title>
          <span class="text-h5">Create Session(s)</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-menu
                  ref="from_time_menu"
                  v-model="create_session_from_time_menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="create_session_form.from_time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="create_session_form.from_time"
                      label="From Time"
                      readonly
                      outlined
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                      @click="create_session_form.from_time = ''"
                    />
                  </template>
                  <v-time-picker
                    v-if="create_session_from_time_menu"
                    v-model="create_session_form.from_time"
                    color="primary"
                    full-width
                    scrollable
                    format="24hr"
                    @click:minute="$refs.from_time_menu.save(create_session_form.from_time)"
                  />
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="to_time_menu"
                  v-model="create_session_to_time_menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="create_session_form.to_time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="create_session_form.to_time"
                      :disabled="!create_session_form.from_time"
                      label="From Time"
                      readonly
                      outlined
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                      @click="create_session_form.to_time = ''"
                    />
                  </template>
                  <v-time-picker
                    v-if="create_session_to_time_menu"
                    v-model="create_session_form.to_time"
                    color="primary"
                    full-width
                    scrollable
                    format="24hr"
                    :min="create_session_form.from_time"
                    @click:minute="$refs.to_time_menu.save(create_session_form.to_time)"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" @click="create_session_dates_menu = true">
                <v-menu
                  ref="menu"
                  v-model="create_session_dates_menu"
                  :close-on-content-click="false"
                  :return-value.sync="create_session_form.dates"
                  transition="scale-transition"
                  min-width="auto"
                  offset-y
                >
                  <template #activator="{ on, attrs }">
                    <v-combobox
                      v-model="create_session_form.dates"
                      multiple
                      outlined
                      chips
                      readonly
                      small-chips
                      hide-details
                      label="Dates of sessions"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="create_session_form.dates"
                    multiple
                    scrollable
                    color="primary"
                    :min="minDate"
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="grey"
                      @click="create_session_dates_menu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="$refs.menu.save(create_session_form.dates)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            text
            @click="create_session_dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            :disabled="!canCreateSession"
            :loading="create_session_loading"
            color="primary"
            @click="createSessions"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import SessionCard from '~/components/SessionCard'

export default {
  name: 'GroupPage',
  components: { SessionCard },
  data () {
    return {
      sessions: [],
      session_groups_panels: [0],
      create_session_dialog: false,
      create_session_dates_menu: false,
      create_session_from_time_menu: false,
      create_session_to_time_menu: false,
      create_session_form: {
        dates: [],
        from_time: '',
        to_time: ''
      },
      create_session_loading: false,
      promote_group_dialog: false,
      promote_group_email: ''
    }
  },
  async fetch () {
    await this.fetchGroup(this.uid)
    await this.fetchOrganization(this.selected_group.organization)
    await this.fetchSessions()
  },
  head () {
    return {
      title: `Group - ${this.selected_group.name}`
    }
  },
  computed: {
    ...mapState('organizations', {
      selected_organization: state => state.selected_organization
    }),
    ...mapState('groups', {
      selected_group: state => state.selected_group
    }),
    uid () {
      return this.$route.params.uid
    },
    user () {
      return this.$auth.user
    },
    breadcrumbs () {
      return [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/'
        },
        {
          text: `Group - ${this.selected_group.name}`
        }
      ]
    },
    isOrganizationAdmin () {
      return this.user.isAdmin || (this.selected_organization.admins && this.selected_organization.admins.includes(this.user._id))
    },
    minDate () {
      return moment().format('YYYY-MM-DD')
    },
    canCreateSession () {
      return this.create_session_form.dates.length && this.create_session_form.from_time && this.create_session_form.to_time
    },
    sortedSessions () {
      return Array.from(this.sessions).sort((a, b) => moment(b.startDate).unix() - moment(a.startDate).unix())
    },
    groupSessions () {
      const types = {
        signing: [],
        coming: [],
        passed: []
      }

      this.sortedSessions.forEach((session) => {
        types[session.status].push(session)
      })

      return types
    }
  },
  methods: {
    ...mapActions('organizations', [
      'fetchOrganization'
    ]),
    ...mapActions('groups', [
      'fetchGroup',
      'fetchGroups'
    ]),
    async fetchSessions () {
      const { data: sessions } = await this.$axios.get(`/timeslots/group/${this.uid}`)
      this.sessions = sessions

      sessions.forEach((session) => {
        session.day = moment(session.startDate).format('YYYY-MM-DD')
        session.from_time = moment(session.startDate).format('HH:mm')
        session.to_time = moment(session.endDate).format('HH:mm')

        if (moment().isBetween(session.startDate, session.endDate)) {
          session.status = 'signing'
        } else if (moment().isBefore(session.endDate)) {
          session.status = 'coming'
        } else {
          session.status = 'passed'
        }
      })
    },
    createSessions () {
      const requests = []
      this.create_session_loading = true

      for (const date of this.create_session_form.dates) {
        requests.push(
          this.$axios.post(`/timeslots/group/${this.uid}`, {
            startDate: moment(`${date} ${this.create_session_form.from_time}`).format(),
            endDate: moment(`${date} ${this.create_session_form.to_time}`).format()
          }))
      }

      Promise
        .all(requests)
        .finally(() => {
          this.create_session_loading = false
          this.create_session_dialog = false
          this.create_session_form.dates = []
          this.create_session_form.from_time = ''
          this.create_session_form.to_time = ''

          this.fetchSessions()
        })
    },
    deleteSession (session) {
      this.$axios.delete(`/timeslots/${session}`)
        .then(() => {
          this.fetchSessions()
        })
    }
  }
}
</script>

<style scoped>

</style>
