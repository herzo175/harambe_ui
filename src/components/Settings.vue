<template>
  <div class="card">
    <div class="card-content">
      <div class="row">
        <!--TODO: colors, address info, submit buttons and form validation-->
        <!--Basic account info-->
        <div class="input-field col s12">
          <input id="username" type="text" v-model="username"/>
          <label for="username">Username</label>
        </div>
        <div class="input-field col s12">
          <input id="password" type="password" v-model="password"/>
          <label for="password">New Password</label>
        </div>
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
                <tr v-for="s in sources" :key="s.id">
                  <td>{{ s.name }}</td>
                  <td>
                    <div class="switch">
                      <label>
                        <input
                          type="checkbox"
                          v-on:click="setSourceDefault(s.id)"
                          v-bind:checked="s.default"
                          class="filled-in"/>
                        <span class="lever"></span>
                        Default
                      </label>
                    </div>
                  </td>
                  <td>
                    <a
                      class="btn-floating black"
                      v-on:click="removeSource(s.id)">
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
          <div v-if="!showNewSourceForm">
            <p class="center-align">
              <a
                class="btn-floating black"
                v-on:click="() => showNewSourceForm = true">
                <i class="material-icons">add</i>
              </a>
            </p>
          </div>
          <div v-else>
            <p class="center-align">
              <a
                class="btn-floating black"
                v-on:click="() => showNewSourceForm = false">
                <i class="material-icons">expand_less</i>
              </a>
            </p>
            <transition name="push" mode="out-in">
              <div class="container">
                <input id="account-nickname" type="text" v-model="sourceNickname"/>
                <label for="account-nickname">Account Nickname</label>

                <input id="routing-number" type="text" v-model="sourceRoutingNumber"/>
                <label for="routing-number">Routing Number</label>

                <input id="account-number" type="text" v-model="sourceAccountNumber"/>
                <label for="account-number">Account Number</label>
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
                <input type="checkbox">
                <span>Email</span>
              </label>
            </div>
            <div class="row">
              <label>
                <input type="checkbox">
                <span>Text Message</span>
              </label>
            </div>
          </div>
          <div class="col s6">
            <h6>Notifications About:</h6>
            <div class="row">
              <label>
                <input type="checkbox">
                <span>Announcements</span>
              </label>
            </div>
            <div class="row">
              <label>
                <input type="checkbox">
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
      username: '',
      password: '',
      sourceNickname: '',
      sourceRoutingNumber: '',
      sourceAccountNumber: '',
      showNewSourceForm: false,
      sources: [
        {
          id: 1,
          name: 'test1',
          default: false
        },
        {
          id: 2,
          name: 'test2',
          default: true
        }
      ]
    }
  },
  methods: {
    setSourceDefault: function (id) {
      this.sources.forEach(e => {
        if (e.id === id) {
          e.default = true
        } else {
          e.default = false
        }
      })

      // save changes
    },
    removeSource: function (id) {
      const i = this.sources.findIndex(e => e.id === id)
      this.sources.splice(i, 1)

      // save changes
    }
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
