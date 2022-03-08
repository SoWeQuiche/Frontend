<template>
  <v-row>
    <v-col cols="12" class="pl-12 pr-6 py-2 d-flex justify-center justify-sm-space-between align-center">
      <v-breadcrumbs v-if="!isMobile" :items="breadcrumbs" class="d-inline-block" />
      <v-card v-else outlined width="70vw" class="mb-4">
        <v-card-title class="text-center" style="word-break: break-word;">
          {{ mobileTitle }}
        </v-card-title>
        <v-card-subtitle class="text-center mt-2">
          <span class="grey--text">Time Left:</span>
          <span v-if="!isTimerEnded" class="pl-1 text-h6">{{ time_left.hours | addZero }}h {{ time_left.minutes | addZero }}m {{ time_left.seconds | addZero }}s</span>
          <span v-else class="pl-1 text-h6">Session Ended</span>
        </v-card-subtitle>
      </v-card>
      <div v-if="!isMobile" style="min-width: 200px;">
        <span class="grey--text">Time Left:</span>
        <span v-if="!isTimerEnded" class="pl-1 text-h6">{{ time_left.hours | addZero }}h {{ time_left.minutes | addZero }}m {{ time_left.seconds | addZero }}s</span>
        <span v-else class="pl-1 text-h6">Session Ended</span>
      </div>
    </v-col>
    <v-col cols="12" class="pl-8 d-flex justify-center justify-md-start align-center flex-column flex-md-row">
      <span class="mb-4 mb-md-0 mr-md-3">Signature mode:</span>
      <v-btn-toggle
        v-model="sign_mode"
        mandatory
        dense
        color="primary"
        @change="updateQRCode"
      >
        <v-btn value="none" class="px-4">
          <v-icon :left="!isMobile" :color="sign_mode === 'none' ? 'primary' : ''">
            mdi-eye-off-outline
          </v-icon>
          <span class="d-none d-sm-inline-block">Hide</span>
        </v-btn>
        <v-btn value="qrcode" class="px-4">
          <v-icon :left="!isMobile" :color="sign_mode === 'qrcode' ? 'primary' : ''">
            mdi-qrcode-scan
          </v-icon>
          <span class="d-none d-sm-inline-block">QR Code</span>
        </v-btn>
        <v-btn value="link" class="px-4" disabled>
          <v-icon :left="!isMobile" :color="sign_mode === 'link' ? 'primary' : ''">
            mdi-link
          </v-icon>
          <span class="d-none d-sm-inline-block">Link</span>
        </v-btn>
        <v-btn value="code" class="px-4">
          <v-icon :left="!isMobile" :color="sign_mode === 'code' ? 'primary' : ''">
            mdi-barcode
          </v-icon>
          <span class="d-none d-sm-inline-block">Code</span>
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="12">
      <v-divider />
    </v-col>
    <v-col cols="12" class="pl-8">
      <div class="d-flex align-center flex-column flex-md-row">
        <div class="d-flex align-center">
          <div>
            Participants
            <span class="ml-2 blue--text">{{ attendances.length }}</span>
          </div>
          <v-divider vertical class="mx-5" />
          <div>
            Signed
            <span class="ml-2 green--text">{{ globalInfos.signed }}</span>
          </div>
          <v-divider vertical class="mx-5" />
          <div>
            Present
            <span class="ml-2 green--text">{{ globalInfos.present }}</span>
          </div>
        </div>
        <v-divider vertical class="mx-5" />
        <div class="d-flex align-center my-3 my-md-0">
          <div>
            Away
            <span class="ml-2 red--text">{{ globalInfos.away }}</span>
          </div>
          <v-divider vertical class="mx-5" />
          <div>
            Not Informed
            <span class="ml-2 grey--text">{{ globalInfos.not_informed }}</span>
          </div>
        </div>
        <v-spacer />
        <v-tooltip color="green" bottom :position-x="10">
          <template #activator="{ on, attrs }">
            <v-btn color="green" dark v-bind="attrs" v-on="on" @click="makeAllPresent">
              <v-icon>mdi-check</v-icon>
              All Present
            </v-btn>
          </template>
          <span>Make all participants Present</span>
        </v-tooltip>
      </div>
    </v-col>
    <v-col cols="12">
      <v-row class="d-flex">
        <v-col v-if="$fetchState.pending" cols="12" class="text-center">
          <v-progress-circular size="64" indeterminate />
        </v-col>
        <v-col :cols="usersDisplaySize.global.cols" :md="usersDisplaySize.global.md" :lg="usersDisplaySize.global.lg">
          <v-row>
            <v-col
              v-for="attendance in attendances"
              :key="attendance._id"
              :cols="usersDisplaySize.users.cols"
              :md="usersDisplaySize.users.md"
              :lg="usersDisplaySize.users.lg"
              :xl="usersDisplaySize.users.xl"
            >
              <v-card class="mx-auto" outlined :color="attendance.isPresent | presentColor">
                <v-card-actions>
                  <v-list-item class="grow">
                    <v-list-item-content>
                      <v-list-item-title :title="`${attendance.user.lastname.toUpperCase()} ${attendance.user.firstname}`">
                        {{ attendance.user.lastname.toUpperCase() }} {{ attendance.user.firstname }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="grey--text" :title="attendance.user.mail">
                        {{ attendance.user.mail }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-row
                      align="center"
                      justify="end"
                      style="max-width: 140px"
                    >
                      <v-btn
                        color="green"
                        outlined
                        icon
                        :disabled="attendance.isPresent === true"
                        @click="updateAttendancePresence(attendance, true)"
                      >
                        <v-icon>mdi-account-check-outline</v-icon>
                      </v-btn>
                      <v-btn
                        color="red"
                        outlined
                        icon
                        class="ml-3 mr-2"
                        :disabled="attendance.isPresent === false"
                        @click="updateAttendancePresence(attendance, false)"
                      >
                        <v-icon>mdi-account-remove-outline</v-icon>
                      </v-btn>
                      <v-btn color="grey" icon>
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </v-row>
                  </v-list-item>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <!-- QRCode Card -->
        <v-col
          v-if="sign_mode === 'qrcode'"
          ref="qrcodeCanvasContainer"
          v-resize="windowResize"
          cols="12"
          md="6"
          class="d-flex justify-center"
          order="first"
          order-md="0"
        >
          <v-avatar
            rounded
            size="100%"
            class="align-start"
          >
            <v-img
              :src="qr_code_img"
              class="rounded"
              contain
              :max-height="qr_code_max_size"
              :max-width="qr_code_max_size"
              style="border: 1px solid #0000001F; max-width: 100%;"
            />
          </v-avatar>
        </v-col>
        <!-- Code Card -->
        <v-col
          v-if="sign_mode === 'code'"
          cols="12"
          md="6"
          lg="4"
          order="first"
          order-md="0"
        >
          <v-card class="text-center py-8" outlined>
            <div class="text-h4 mb-4">
              Session Code
            </div>
            <div class="text-h2" style="letter-spacing: 10px !important;">
              {{ session_code }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { debounce } from 'lodash'
import moment from 'moment'
import QRCode from 'qrcode'
const TimeBasedToken = require('~/scripts/generate-tbt.js')

export default {
  name: 'SessionPage',
  fetchOnServer: false,
  filters: {
    presentColor (value) {
      if ([null, undefined].includes(value)) { return '' }
      if (value) { return '#4CAF5033' }
      return '#F4433633'
    },
    addZero (i) {
      if (i < 10) { i = '0' + i }
      return i
    }
  },
  data () {
    return {
      session: {
        day: '',
        from_time: '',
        to_time: ''
      },
      attendances: [],
      sign_mode: 'none',
      session_code: '000000',
      qr_code_secret: 'secret',
      qr_code_data: '',
      qr_code_img: '',
      qr_code_max_size: 0,
      qr_code_interval: undefined,
      time_left: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
  },
  async fetch () {
    await this.fetchGroup(this.$route.params.groupId)
    await this.fetchOrganization(this.selected_group.organization)

    const { data: session } = await this.$axios.get(`/timeslots/${this.uid}`)
    this.session = session
    this.session.day = moment(session.startDate).format('dddd Do MMMM YYYY')

    if (!moment(session.startDate).isSame(moment(session.endDate), 'day')) {
      this.session.other_day = moment(session.endDate).format('dddd Do MMMM YYYY')
    }

    this.session.from_time = moment(session.startDate).format('HH:mm')
    this.session.to_time = moment(session.endDate).format('HH:mm')

    this.updateTimeLeft()

    await this.fetchAttendances()
  },
  head () {
    return {
      title: `Group - ${this.selected_group.name}, Session - ${this.displayDate}`
    }
  },
  computed: {
    ...mapState('groups', {
      selected_group: state => state.selected_group
    }),
    uid () {
      return this.$route.params.sessionId
    },
    isMobile () {
      return this.$vuetify.breakpoint.xs
    },
    globalInfos () {
      return this.attendances
        .reduce((acc, attendance) => {
          const { isPresent, signDate } = attendance

          if (isPresent === true) { acc.present++ }
          if (isPresent === false) { acc.away++ }
          if (isPresent !== false && isPresent !== true) { acc.not_informed++ }
          if (isPresent && signDate) { acc.signed++ }

          return acc
        }, {
          present: 0,
          away: 0,
          not_informed: 0,
          signed: 0
        })
    },
    usersDisplaySize () {
      switch (this.sign_mode) {
        case 'none':
          return {
            global: {
              cols: '12',
              md: '12',
              lg: '12'
            },
            users: {
              cols: '12',
              md: '6',
              lg: '4',
              xl: '3'
            }
          }
        case 'qrcode':
          return {
            global: {
              cols: '12',
              md: '6',
              lg: '6'
            },
            users: {
              cols: '12',
              md: '12',
              lg: '6',
              xl: '4'
            }
          }
        case 'link':
        case 'code':
          return {
            global: {
              cols: '12',
              md: '6',
              lg: '8'
            },
            users: {
              cols: '12',
              md: '12',
              lg: '6',
              xl: '4'
            }
          }
        default:
          return { }
      }
    },
    mobileTitle () {
      return `${this.session.day} from ${this.session.from_time} to ${this.session.to_time}`
    },
    isTimerEnded () {
      return this.time_left.hours === 0 && this.time_left.minutes === 0 && this.time_left.seconds === 0
    },
    breadcrumbs () {
      return [
        {
          text: 'Dashboard',
          to: '/'
        },
        {
          text: `Group - ${this.selected_group.name}`,
          link: true,
          exact: true,
          to: {
            name: 'groups-uid',
            params: {
              uid: this.$route.params.groupId
            }
          }
        },
        {
          text: `Session - ${this.displayDate}`
        }
      ]
    },
    displayDate () {
      if (this.session.other_day) {
        return `From ${this.session.day} ${this.session.from_time} to ${this.session.other_day} ${this.session.to_time}`
      }
      return `${this.session.day} from ${this.session.from_time} to ${this.session.to_time}`
    }
  },
  mounted () {
    this.qr_code_interval = setInterval(() => {
      this.windowResize()
    }, 1000)

    this.updateTimeLeft()
  },
  beforeDestroy () {
    clearInterval(this.qr_code_interval)
  },
  methods: {
    ...mapActions('organizations', [
      'fetchOrganization'
    ]),
    ...mapActions('groups', [
      'fetchGroup'
    ]),
    async fetchAttendances (secondFetch = false) {
      const { data } = await this.$axios.get(`/attendances/timeslot/${this.uid}`)

      this.attendances = data.map((attendance) => {
        attendance.isPresent = attendance.isPresent || null
        attendance.signDate = attendance.signDate || null
        return attendance
      })

      if (!data.length && !secondFetch && !this.isTimerEnded) {
        await this.$axios.post(`/attendances/timeslot/${this.uid}`)
        await this.fetchAttendances(true)
      }
    },
    windowResize: debounce(function () {
      if (this.sign_mode === 'qrcode' && this.$refs.qrcodeCanvasContainer) {
        this.qr_code_max_size = Math.min(this.$refs.qrcodeCanvasContainer.clientWidth - 24, Math.min(window.innerHeight - 300, this.$refs.qrcodeCanvasContainer.clientWidth - 24))
        this.updateQrCodeThrottle()
      }
    }, 20),
    updateQrCodeThrottle: debounce(function () {
      this.updateQRCode()
    }, 100),
    updateQRCode () {
      this.qr_code_data = TimeBasedToken(this.qr_code_secret, 30, 8)

      if (this.sign_mode === 'qrcode' && this.$refs.qrcodeCanvasContainer) {
        QRCode
          .toDataURL(this.qr_code_data, {
            width: this.qr_code_max_size,
            height: this.qr_code_max_size,
            margin: 1
          }, (err, dataUrl) => {
            if (!err) {
              this.qr_code_img = dataUrl
            }
          })
      }
    },
    updateTimeLeft () {
      const duration = moment(this.session.endDate).diff(moment(), 'seconds')
      if (duration > 0) {
        const timeLeft = moment.duration(duration, 'seconds')

        this.time_left = {
          hours: timeLeft.hours(),
          minutes: timeLeft.minutes(),
          seconds: timeLeft.seconds()
        }

        setTimeout(() => {
          this.updateTimeLeft()
        }, 1000)
      }
    },
    makeAllPresent () {
      this.attendances.forEach((attendance) => { this.updateAttendancePresence(attendance, true) })
    },
    async updateAttendancePresence (attendance, present) {
      const oldPresent = attendance.isPresent
      attendance.isPresent = present

      try {
        await this.$axios.patch(`/attendances/${attendance._id}/define-presence`, { isPresent: present })
      } catch (e) {
        attendance.isPresent = oldPresent
      }
    }
  }
}
</script>

<style scoped>

</style>
