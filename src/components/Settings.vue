<template>
  <div class="card">
    <div class="card-content">
      <div class="row">
        <!--TODO: figure out basic info situation-->
        <!--TODO: colors, address info, submit buttons and form validation-->
        <!--Basic account info-->
        <!--
        <input id="email" type="text" v-model="email"/>
        <label for="email">Email</label>
        <input id="password" type="password" v-model="password"/>
        <label for="password">New Password</label>
        -->
        <!--Funding source table/dropdown thingy-->
        <div class="row">
          <div class="col s12">
            <table>
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th colspan="3">Options</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in bankAccounts" :key="b._id">
                  <td>{{ b.accountNickname }}</td>
                  <td>
                    <div class="switch">
                      <label>
                        <input
                          type="checkbox"
                          v-on:click="setBankAccountDefault(b._id)"
                          v-bind:checked="b.default"
                          class="filled-in"/>
                        <span class="lever"></span>
                        Default
                      </label>
                    </div>
                  </td>
                  <td>
                    <a
                      class="btn-floating black"
                      v-on:click="removeBankAccount(b._id)">
                      <i class="material-icons">clear</i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--new account drop-->
        <div class="row">
          <div v-if="!showNewBankAccountForm">
            <p class="center-align">
              <a
                class="btn-floating black"
                v-on:click="() => showNewBankAccountForm = true">
                <i class="material-icons">add</i>
              </a>
            </p>
          </div>
          <div v-else>
            <p class="center-align">
              <a
                class="btn-floating black"
                v-on:click="() => showNewBankAccountForm = false">
                <i class="material-icons">expand_less</i>
              </a>
            </p>
            <transition name="push" mode="out-in">
              <div class="container">
                <input id="account-nickname" type="text" v-model="newBankAccountNickname"/>
                <label for="account-nickname">Account Nickname</label>

                <input id="routing-number" type="text" v-model="newBankAccountRoutingNumber"/>
                <label for="routing-number">Routing Number</label>

                <input id="account-number" type="text" v-model="newBankAccountNumber"/>
                <label for="account-number">Account Number</label>

                <p class="right-align">
                  <a
                    class="btn-floating black"
                    v-on:click="saveNewBankAccount">
                    <i class="material-icons">save</i>
                  </a>
                </p>
              </div>
            </transition>
          </div>
        </div>
        <!--Notifications boxes-->
        <div class="container">
          <div class="col s6">
            <h6>Send Me:</h6>
            <div class="row">
              <label>
                <input
                  type="checkbox"
                  v-model="notifications.methods.email"
                  v-on:click="setNotificationMethodEmail">
                <span>Email</span>
              </label>
            </div>
            <div class="row">
              <label>
                <input
                  type="checkbox"
                  v-model="notifications.methods.sms"
                  v-on:click="setNotificationMethodSms">
                <span>Text Message</span>
              </label>
            </div>
          </div>
          <div class="col s6">
            <h6>Notifications About:</h6>
            <div class="row">
              <label>
                <input
                  type="checkbox"
                  v-model="notifications.topics.announcements"
                  v-on:click="setNotificationTopicAnnouncements">
                <span>Announcements</span>
              </label>
            </div>
            <div class="row">
              <label>
                <input
                  type="checkbox"
                  v-model="notifications.topics.account"
                  v-on:click="setNotificationTopicAccount">
                <span>My Account</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      // email: '',
      // password: '',
      newBankAccountNickname: '',
      newBankAccountRoutingNumber: '',
      newBankAccountNumber: '',
      showNewBankAccountForm: false,
      bankAccounts: [],
      notifications: {
        topics: {
          announcements: false,
          account: false
        },
        methods: {
          email: false,
          sms: false
        }
      }
    }
  },
  methods: {
    getUser: function () {
      const self = this
      const query = `{
        User(token: "${this.$store.state.userToken}") {
          notifications {
            topics {
              announcements
              account
            }
            methods {
              email
              sms
            }
          }
          bankAccounts {
            _id
            accountNickname
            default
          }
        }
      }`

      this.$graphQLClient.request(query)
        .then(data => {
          self.notifications.topics.announcements = data.User.notifications.topics.announcements
          self.notifications.topics.account = data.User.notifications.topics.account
          self.notifications.methods.email = data.User.notifications.methods.email
          self.notifications.methods.sms = data.User.notifications.methods.sms
          self.bankAccounts = data.User.bankAccounts
        })
        .catch(err => {
          console.error(err)
        })
    },
    saveNewBankAccount: function () {
      const self = this
      const query = `
        mutation {
          createBankAccount (
            accountNickname: "${this.newBankAccountNickname}",
            routingNumber: ${this.newBankAccountRoutingNumber},
            accountNumber: ${this.newBankAccountNumber},
            token: "${this.$store.state.userToken}"
          ) {
            _id
            accountNickname
            default
          }
        }
      `

      self.$graphQLClient.request(query)
        .then(data => {
          console.log(data)
          self.bankAccounts.push(data.createBankAccount)
          self.showNewBankAccountForm = false
          self.newBankAccountNickname = ''
          self.newBankAccountRoutingNumber = null
          self.newBankAccountNumber = null
        })
        .catch(err => {
          console.error(err)
        })
    },
    setBankAccountDefault: async function (_id) {
      const self = this

      this.bankAccounts = this.bankAccounts.map(ba => {
        ba.default = ba._id === _id
        return ba
      })

      this.bankAccounts.forEach(ba => {
        const query = `
          mutation {
            setBankAccountDefault (
              token: "${self.$store.state.userToken}",
              _id: "${ba._id}",
              default: ${_id === ba._id}
            ) {
              default
            }
          }
        `

        self.$graphQLClient.request(query)
          .catch(err => console.error(err))
      })
    },
    removeBankAccount: function (id) {
      const self = this
      const query = `
        mutation {
          deleteBankAccount (
            token: "${this.$store.state.userToken}",
            _id: "${id}"
          )
        }
      `

      this.$graphQLClient.request(query)
        .then(_ => {
          const i = self.bankAccounts.findIndex(e => e._id === id)
          self.bankAccounts.splice(i, 1)
        })
        .catch(err => {
          console.error(err)
        })
    },
    setNotificationMethodEmail: function () {
      // NOTE: state is changed after onclick method is fired
      const query = `
        mutation {
          setNotificationMethodEmail(
            token: "${String(this.$store.state.userToken)}",
            allow: ${!this.notifications.methods.email}) {
              notifications {
                methods {
                  email
                }
              }
            }
        }`

      this.$graphQLClient.request(query)
        .catch(err => {
          console.error(err)
        })
    },
    setNotificationMethodSms: function () {
      const query = `
        mutation {
          setNotificationMethodSms(
            token: "${String(this.$store.state.userToken)}",
            allow: ${!this.notifications.methods.sms}) {
              notifications {
                methods {
                  sms
                }
              }
            }
        }`

      this.$graphQLClient.request(query)
        .catch(err => {
          console.error(err)
        })
    },
    setNotificationTopicAnnouncements: function () {
      const query = `
        mutation {
          setNotificationTopicAnnouncements(
            token: "${String(this.$store.state.userToken)}",
            allow: ${!this.notifications.topics.announcements}) {
              notifications {
                topics {
                  announcements
                }
              }
            }
        }`

      this.$graphQLClient.request(query)
        .catch(err => {
          console.error(err)
        })
    },
    setNotificationTopicAccount: function () {
      const query = `
        mutation {
          setNotificationTopicAccount(
            token: "${String(this.$store.state.userToken)}",
            allow: ${!this.notifications.topics.account}) {
              notifications {
                topics {
                  account
                }
              }
            }
        }`

      this.$graphQLClient.request(query)
        .catch(err => {
          console.error(err)
        })
    }
  },
  created: function () {
    this.getUser()
  }
}
</script>

<style>
  label {
    display: block;
    text-align: left;
    width: 90%;
  }

  th, td, td label {
    text-align: center;
  }

  .push-enter, .push-leave-to {
    opacity: 0;
  }

  .push-leave-active {
    transition: .3s;
    transform: translateY(-30px)
  }
</style>
