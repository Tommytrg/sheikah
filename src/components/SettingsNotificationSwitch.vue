<template>
  <el-switch
    v-model="toggle"
    class="notification"
    data-test="action-try"
  ></el-switch>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'NotificationsSettings',
  props: {
    /**
     * type of the notification to toggle
     */
    title: {
      required: true,
      type: String,
    },
  },
  computed: {
    ...mapState({
      notifications: state => state.wallet.notifications,
    }),
    toggle: {
      set() {
        this.toggleNotification(this.title)
      },
      get() {
        return this.notifications[this.title]
      },
    },
  },
  created() {
    this.getNotifications()
  },
  methods: {
    ...mapMutations({
      toggleNotification: 'toggleNotification',
    }),
    ...mapActions({
      getNotifications: 'getNotifications',
    }),
  },
}
</script>
