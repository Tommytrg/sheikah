<template>
  <NavigationCard
    title="Identify your wallet"
    previous-text="Back"
    next-text="Next"
    :previous-step="() => $router.push('/ftu/seed-validation')"
    :next-step="() => $router.push('/ftu/encryption-pass')"
  >
    <p class="paragraph"
      >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.</p
    >
    <div class="form-row password">
      <p>Title</p>
      <el-input v-model="title" class="password" />
    </div>

    <div class="form-row password">
      <p>Description</p>
      <el-input
        v-model="description"
        type="textarea"
        class="password"
        resize="none"
        :rows="3"
        :maxlength="300"
      />
    </div>
  </NavigationCard>
</template>

<script>
import NavigationCard from '@/components/card/NavigationCard'

export default {
  name: 'WalletSeedBackup',
  components: {
    NavigationCard,
  },
  computed: {
    title: {
      set(val) {
        this.$store.commit('setWalletDescription', { title: val })
      },
      get() {
        return this.$store.state.wallet.title
      },
    },
    description: {
      set(val) {
        this.$store.commit('setWalletDescription', { description: val })
      },
      get() {
        return this.$store.state.wallet.description
      },
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.content {
  padding: 40px;
}

.paragraph {
  margin-bottom: 32px;
}

.form-row {
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 32px;
  max-width: 500px;

  &.password {
    display: flex;
    justify-content: space-between;
    max-width: none;
  }

  &.form-row:last-of-type {
    margin: 0;
  }

  .password {
    width: 350px;
  }
}

.bold {
  font-weight: bold;
}

.label {
  color: $font-color-light;
  width: 100px;
}
</style>
