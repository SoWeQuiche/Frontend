<template>
  <v-row>
    <v-col cols="12" class="pl-12 pr-6 py-2 d-flex justify-center justify-sm-space-between align-center">
      <v-breadcrumbs v-if="!isMobile" :items="breadcrumbs" class="d-inline-block" />
      <div style="min-width: 200px;">
        <span class="grey--text">Time Left:</span>
        <span class="pl-1 text-h6">{{ time_left }}</span>
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
            <span class="ml-2 blue--text">{{ users.length }}</span>
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
              v-for="user in users"
              :key="user._id"
              :cols="usersDisplaySize.users.cols"
              :md="usersDisplaySize.users.md"
              :lg="usersDisplaySize.users.lg"
              :xl="usersDisplaySize.users.xl"
            >
              <v-card class="mx-auto" outlined :color="user.present | presentColor">
                <v-card-actions>
                  <v-list-item class="grow">
                    <v-list-item-content>
                      <v-list-item-title :title="`${user.lastname.toUpperCase()} ${user.firstname}`">
                        {{ user.lastname.toUpperCase() }} {{ user.firstname }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="grey--text" :title="user.mail">
                        {{ user.mail }}
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
                        :disabled="user.present === true"
                        @click="user.present = true"
                      >
                        <v-icon>mdi-account-check-outline</v-icon>
                      </v-btn>
                      <v-btn
                        color="red"
                        outlined
                        icon
                        class="ml-3 mr-2"
                        :disabled="user.present === false"
                        @click="user.present = false"
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
          v-resize="updateQrCodeThrottle"
          cols="12"
          md="6"
          class="d-flex justify-center"
          order="first"
          order-md="0"
        >
          <canvas ref="qrcodeCanvas" class="rounded" style="border: 1px solid #0000001F; max-width: 100%;" />
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
import debounce from 'lodash.debounce'
import moment from 'moment'
import QRCode from 'qrcode'

function addZero (i) {
  if (i < 10) { i = '0' + i }
  return i
}

export default {
  name: 'SessionPage',
  filters: {
    presentColor (value) {
      if (value !== null) {
        if (value) {
          return '#4CAF5033'
        } else {
          return '#F4433633'
        }
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      users: [],
      sign_mode: 'none',
      session_code: '000000',
      session_end: moment().add(10, 'hours').toDate(),
      qr_code_data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      qr_code_interval: null,
      time_left: '00:00:00',
      time_left_interval: null
    }
  },
  async fetch () {
    this.$axios.get('https://randomuser.me/api/?results=20')
      .then(({ data: { results } }) => {
        this.users = results.map(({ login, name, email }) => ({
          _id: login.uuid,
          firstname: name.first,
          lastname: name.last,
          mail: email,
          present: Math.random() > 0.3 ? Math.random() > 0.5 : null,
          signed: Math.random() > 0.5
        }))
      })

    await this.fetchGroup(this.$route.params.groupId)
  },
  head () {
    return {
      title: 'Group ' + this.uid
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
      const globalInfos = {
        signed: 0,
        present: 0,
        away: 0,
        not_informed: 0
      }

      this.users.forEach((user) => {
        if (user.present === true) {
          globalInfos.present++
        } else if (user.present === false) {
          globalInfos.away++
        } else {
          globalInfos.not_informed++
        }

        if (user.present && user.signed) {
          globalInfos.signed++
        }
      })

      return globalInfos
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
          text: `Session - ${this.$route.params.sessionId}`
        }
      ]
    }
  },
  mounted () {
    this.qr_code_interval = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 10000)
      this.qr_code_data = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQ${randomNumber}`
      this.updateQrCodeThrottle()
    }, 5000)

    this.time_left_interval = setInterval(() => {
      this.updateTimeLeft()
    }, 1000)

    this.updateTimeLeft()
  },
  beforeDestroy () {
    clearInterval(this.qr_code_interval)
    clearInterval(this.time_left_interval)
  },
  methods: {
    ...mapActions('groups', [
      'fetchGroup'
    ]),
    updateQrCodeThrottle: debounce(function () {
      this.updateQRCode()
    }, 20),
    updateQRCode () {
      this.$nextTick(() => {
        if (this.$refs.qrcodeCanvas) {
          const qrSize = Math.min(this.$refs.qrcodeCanvasContainer.clientWidth - 24, Math.min(window.innerHeight - 400, this.$refs.qrcodeCanvasContainer.clientWidth - 24))

          QRCode.toCanvas(this.$refs.qrcodeCanvas, this.qr_code_data, {
            width: qrSize,
            height: qrSize,
            margin: 1
          })
        }
      })
    },
    updateTimeLeft () {
      const duration = moment(this.session_end).diff(moment(), 'seconds')
      if (duration > 0) {
        const hours = Math.floor(duration / 3600)
        const minutes = Math.floor((duration - hours * 3600) / 60)
        const seconds = duration - hours * 3600 - minutes * 60

        this.time_left = `${addZero(hours)}h ${addZero(minutes)}m ${addZero(seconds)}s`
      } else {
        this.time_left = '00h 00m 00s'
        clearInterval(this.time_left_interval)
      }
    },
    makeAllPresent () {
      this.users.forEach((user) => {
        user.present = true
      })
    }
  }
}
</script>

<style scoped>

</style>
