<template>
  <div>
    <NavigationCard
      ref="navCard"
      data-test="header-4"
      class="wallet-seed-validation"
      title="Repeated mnemonics"
      previous-text="Back"
      next-text="Next"
      :previous-step="previousStep"
      :next-step="nextStep"
    >
      <p
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacus
        erat, sodales at finibus quis, auctor vitae neque. Donec molestie
        suscipit mauris, scelerisque dictum eros egestas eget. Phasellus
        facilisis urna id venenatis interdum. Proin nec lorem a risus facilisis
        fringilla sit amet quis magna. Suspendisse vitae mollis mauris. Praesent
        dignissim vel tellus et lobortis. Proin cursus sapien a enim rhoncus
        condimentum.</p
      >
    </NavigationCard>
  </div>
</template>

<script>
import NavigationCard from '@/components/card/NavigationCard'

export default {
  name: 'WalletAlreadyImported',
  components: {
    NavigationCard,
  },
  methods: {
    nextStep() {
      this.$router.push(`/ftu/wallet-description?import=true`)
    },
    previousStep() {
      this.$store.commit('setRepeatedMnemonics', { exist: null })
      this.$router.push('/ftu/import-wallet')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';
@import '@/styles/_colors.scss';

.content {
  padding: 40px;
}

.seed {
  align-items: center;
  border: $input_big-border;
  border-radius: $input_big-border-radius;
  box-sizing: border-box;
  color: $input_big-color;
  display: inline-flex;
  font-size: 22px;
  line-break: auto;
  line-height: 1.5em;
  margin: 24px 0;
  padding: 16px;
  width: 100%;
}

.match-error {
  color: $red-2;
}

.paragraph {
  margin-top: 16px;
}
</style>
