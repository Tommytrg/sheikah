<template>
  <div class="container">
    <div class="center">
      <div class="filling-icon">
        <font-awesome-icon
          v-if="setupMessage === 'Downloading wallet'"
          class="icon"
          icon="wallet"
        />
        <font-awesome-icon
          v-if="setupMessage === 'Running wallet'"
          class="icon"
          icon="cogs"
        />
        <font-awesome-icon
          v-if="setupMessage === 'loaded'"
          class="icon"
          icon="check"
        />
        <div class="banner" />
      </div>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="percentage"
        :format="format"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'WalletNotFound',
  computed: {
    ...mapState({
      setupMessage: state => state.uiInteractions.setupMessage,
      client: state => state.wallet.api.client,
    }),
    percentage() {
      if (this.setupMessage === 'Downloading wallet') {
        return 33
      } else if (this.setupMessage === 'Running wallet') {
        return 66
      } else if (this.setupMessage === 'loaded') {
        return 100
      } else {
        return 0
      }
    },
  },
  beforeDestroy() {
    this.cleanMessage()
  },
  methods: {
    ...mapMutations({
      cleanMessage: 'cleanMessage',
    }),
    format(percentage) {
      if (percentage <= 33) {
        return 'Downloading wallet...'
      } else if (percentage <= 70) {
        return 'Running wallet...'
      } else if (percentage > 70) {
        return 'We are preparing Sheikah...'
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/_colors.scss';
@import '@/styles/theme.scss';

.container {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;

  .center {
    min-width: 500px;

    .filling-icon {
      align-items: center;
      display: flex;
      justify-content: center;
      margin-bottom: 24px;

      .icon {
        color: $alt-blue;
        font-size: 50px;
        position: absolute;
        z-index: 100;
      }
    }
  }
}

.banner {
  background: transparent;
  border: 4px solid $alt-blue;
  border-radius: 50%;
  height: 100px;
  overflow: hidden;
  position: relative;
  width: 100px;
}

.banner::before {
  animation: wipe 5s cubic-bezier(0.2, 0.6, 0.8, 0.4) both;
  animation-iteration-count: infinite;
  background: $purple-4;
  bottom: 0;
  content: '';
  position: absolute;
  width: 100%;
}

@keyframes wipe {
  from {
    height: 0;
  }

  to {
    height: 100%;
  }
}
</style>
