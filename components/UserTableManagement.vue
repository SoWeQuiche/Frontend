<template>
  <v-card outlined>
    <v-card-title>
      {{ title }}
      <v-spacer />
      <v-btn
        dark
        :color="isPromoteColor"
        @click="add_user_dialog = true"
        v-text="isPromoteText"
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="users"
    >
      <template #[`item.actions`]="{ item }">
        <v-menu nudge-right="-10" offset-x left>
          <template #activator="{ on }">
            <v-btn
              dark
              icon
              outlined
              color="red"
              v-on="on"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>

          <v-btn
            color="red"
            dark
            @click="deleteUser(item)"
          >
            <v-icon left>
              mdi-alert-outline
            </v-icon>
            Confirm Delete
          </v-btn>
        </v-menu>
      </template>
    </v-data-table>
    <v-dialog
      v-model="add_user_dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5" v-text="isPromoteText" />
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-if="!addExistingUser"
                  v-model="add_user_email"
                  label="Email"
                  type="email"
                  hide-details
                  required
                  outlined
                  @keyup.enter="addUser"
                />
                <v-autocomplete
                  v-else
                  v-model="add_user_email"
                  label="Email"
                  type="email"
                  hide-details
                  required
                  outlined
                  item-value="mail"
                  item-text="mail"
                  :items="availableExistingUsers"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="add_user_dialog = false">
            Close
          </v-btn>
          <v-btn :color="isPromoteColor" @click="addUser">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: 'UserTableManagement',
  props: {
    title: {
      type: String,
      default: 'Table Name',
      required: true
    },
    isPromote: {
      type: Boolean,
      default: false
    },
    addExistingUser: {
      type: Boolean,
      default: false
    },
    existingUsers: {
      type: Array,
      default: () => []
    },
    users: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      headers: [
        { text: 'Last Name', value: 'lastname' },
        { text: 'First Name', value: 'firstname' },
        { text: 'Email', value: 'mail' },
        { text: 'Actions', value: 'actions', align: 'right' }
      ],
      add_user_dialog: false,
      add_user_email: ''
    }
  },
  computed: {
    availableExistingUsers () {
      return this.existingUsers.filter((user) => {
        return this.users.findIndex(u => u.mail === user.mail) === -1
      })
    },
    isPromoteColor () {
      if (this.isPromote) {
        return 'green'
      }
      return 'primary'
    },
    isPromoteText () {
      if (this.isPromote) {
        return 'Promote User'
      }
      return 'Add User'
    }
  },
  methods: {
    addUser () {
      if (this.add_user_email.length > 0) {
        this.$emit('user:add', this.add_user_email)
        this.add_user_dialog = false
        this.add_user_email = ''
      }
    },
    deleteUser (user) {
      this.$emit('user:delete', user._id)
    }
  }
}
</script>

<style scoped>

</style>
