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
                <tr v-for="b in brokers" :key="b.Id">
                  <td>{{ b.name }}</td>
                  <td>
                    <div class="switch">
                      <label>
                        <input
                          type="checkbox"
                          v-on:click="setBrokerAccountDefault(b.Id)"
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
                      v-on:click="removeBrokerAccount(b.Id)">
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
          <div v-if="!showBrokerList">
            <p class="center-align">
              <a
                class="btn-floating black"
                v-on:click="() => { showBrokerList = true; getBrokerList(); }">
                <i class="material-icons">add</i>
              </a>
            </p>
          </div>
          <div v-else>
            <div class="center-align">
              <div class="container">
                <div>
                  <ul class="collection">
                    <li v-for="b in availableBrokers" v-bind:key="b" class="collection-item">
                      <div>
                        {{ b }}
                        <a href="#" class="secondary-content" v-on:click="loginBroker(b)">
                          <i class="material-icons">add</i>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <a
                class="btn-floating black"
                v-on:click="() => showBrokerList = false">
                <i class="material-icons">expand_less</i>
              </a>
            </div>
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
                  v-on:click="() => setNotification('methods', 'email', !notifications.methods.email)">
                <span>Email</span>
              </label>
            </div>
            <div class="row">
              <label>
                <input
                  type="checkbox"
                  v-model="notifications.methods.sms"
                  v-on:click="() => setNotification('methods', 'sms', !notifications.methods.sms)">
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
                  v-on:click="() => setNotification('topics', 'announcements', !notifications.topics.announcements)">
                <span>Announcements</span>
              </label>
            </div>
            <div class="row">
              <label>
                <input
                  type="checkbox"
                  v-model="notifications.topics.account"
                  v-on:click="() => setNotification('topics', 'account', !notifications.topics.account)">
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
      newBrokerAccountNickname: '',
      newBrokerAccountRoutingNumber: '',
      newBrokerAccountNumber: '',
      showBrokerList: false,
      availableBrokers: [],
      brokers: [],
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
      const query = `
        {
          user(token: "${this.$store.state.userToken}") {
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
            brokers {
              Id
              name
              default
            }
          }
        }
      `

      this.$graphQLClient.request(query)
        .then(data => {
          self.notifications.topics.announcements = data.user.notifications.topics.announcements
          self.notifications.topics.account = data.user.notifications.topics.account
          self.notifications.methods.email = data.user.notifications.methods.email
          self.notifications.methods.sms = data.user.notifications.methods.sms
          self.brokers = data.user.brokers
        })
        .catch(err => {
          console.error(err)
        })
    },
    getBrokerList: function () {
      const self = this
      const query = `
        {
          availableBrokers {
            shortName
          }
        }
      `

      const currentBrokerNames = this.brokers.map(b2 => b2.brokerName)

      this.$graphQLClient.request(query)
        .then(data => {
          self.availableBrokers = data.availableBrokers
            .filter(b => !currentBrokerNames.includes(b.shortName))
            .map(b => b.shortName)
        })
        .catch(err => {
          console.error(err)
        })
    },
    loginBroker: function (brokerName) {
      const self = this
      const query = `
        mutation {
          createBrokerLoginUrl(brokerName: "${brokerName}") {
            url
          }
        }
      `

      this.$graphQLClient.request(query)
        .then(data => {
          const receiveMessage = e => {
            const data = JSON.parse(e.data)
            const oAuthVerifier = data.oAuthVerifier

            const query2 = `
              mutation {
                createBrokerAccount(
                  brokerName: "${brokerName}",
                  oAuthVerifier: "${oAuthVerifier}",
                  token: "${self.$store.state.userToken}"
                ) {
                  broker {
                    Id
                    name
                    default
                  }
                }
              }
            `

            self.$graphQLClient.request(query2)
              .then(data => {
                self.brokers.push(data.createBrokerAccount.broker)
                self.showBrokerList = false
              })
              .catch(err => {
                console.error(err)
              })
          }

          addEventListener('message', receiveMessage, false)

          window.open(data.createBrokerLoginUrl.url)
        })
        .catch(err => {
          console.error(err)
        })
    },
    setBrokerAccountDefault: async function (Id) {
      const self = this

      this.brokers = this.brokers.map(ba => {
        ba.default = ba.Id === Id
        return ba
      })

      this.brokers.forEach(ba => {
        const query = `
          mutation {
            setBrokerAccountDefault (
              token: "${self.$store.state.userToken}",
              Id: "${ba.Id}",
              default: ${Id === ba.Id}
            ) {
              broker {
                default
              }
            }
          }
        `

        self.$graphQLClient.request(query)
          .catch(err => console.error(err))
      })
    },
    removeBrokerAccount: function (id) {
      const self = this
      const query = `
        mutation {
          removeBrokerAccount (
            token: "${this.$store.state.userToken}",
            Id: "${id}"
          ) {
            result
          }
        }
      `

      this.$graphQLClient.request(query)
        .then(_ => {
          const i = self.brokers.findIndex(e => e._id === id)
          self.brokers.splice(i, 1)
        })
        .catch(err => {
          console.error(err)
        })
    },
    setNotification: function (type, method, allow) {
      const query = `
        mutation {
          setNotification(
            token: "${this.$store.state.userToken}",
            type: "${type}",
            method: "${method}",
            allow: ${allow}
          ) {
            success
          }
        }
      `

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
