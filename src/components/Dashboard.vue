<template>
  <div class="container">
    <div class="row">
      <!--TODO: animation to new card-->
      <ul class="tabs center-align">
        <li class="tab">
          <router-link
            :to="{ name: 'Performance' }"
            v-bind:class="{ 'active': currentTab === 'performance'}"
            replace>
            Performance
          </router-link>
        </li>
        <li class="tab">
          <router-link
            :to="{ name: 'Algorithm' }"
            v-bind:class="{ 'active': currentTab === 'algorithm'}"
            replace>
            Algorithm
          </router-link>
        </li>
        <li class="tab">
          <router-link
            :to="{ name: 'Settings' }"
            v-bind:class="{ 'active': currentTab === 'settings'}"
            replace>
            Settings
          </router-link>
        </li>
      </ul>

      <br />

      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      currentTab: window.location.pathname.split('/')[2]
    }
  },
  mounted: function () {
    window.M.Tabs.init()
  },
  watch: {
    $route: function () {
      this.currentTab = window.location.pathname.split('/')[2]
      // de pinkify tab
      document.activeElement.blur()
    }
  }
}
</script>
