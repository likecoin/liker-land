<template>
  <header class="settings-page-header">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <button
          :class="backButtonClass"
          @click="onClickBackButton"
        >
          <SettingsIcon />
        </button>

        <transition name="fade">
          <span v-if="!isShowBack">{{ $t('SettingsPage.title') }}</span>
        </transition>
      </div>

      <Button
        v-if="$route.name === 'settings-support'"
        preset="primary-outline"
        :title="$t('civicLiker.about')"
        :to="{ name: 'civic' }"
      />
    </div>
  </header>
</template>

<script>
import Button from '~/components/Button/Button';
import SettingsIcon from '~/assets/icons/cog.svg';

export default {
  name: 'SettingsPageHeader',
  components: {
    Button,
    SettingsIcon,
  },
  props: {
    isShowBack: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    backButtonClass() {
      return {
        'settings-page-header__back-button': true,
        'settings-page-header__back-button--disabled': !this.isShowBack,
      };
    },
  },
  methods: {
    onClickBackButton() {
      const backRouteName = this.$route.name
        .split('-')
        .slice(0, -1)
        .join('-');
      if (backRouteName) this.$router.push({ name: backRouteName });
    },
  },
};
</script>

<style lang="scss">
.settings-page-header {
  @apply text-like-green;
  @apply text-16;
  @apply font-600;

  @apply mb-24;
  @apply px-8;

  &__back-button {
    line-height: 0;

    transition-property: width, opacity, margin-left;
    transition-duration: 0.25s;
    transition-timing-function: ease;

    @apply relative;

    @apply text-like-cyan;
    @apply fill-current;

    @apply mr-16;

    @apply w-24;

    &:hover {
      @apply opacity-50;
    }
    &:active {
      @apply opacity-25;
    }

    &::before {
      content: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' viewBox='0 0 8.7 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,7.9L0,7.9c0,0.4,0.1,0.7,0.3,0.9l6.2,6.7C6.9,16,7.8,16,8.3,15.6c0.5-0.5,0.6-1.3,0.1-1.8L3,7.9l5.4-5.8c0.5-0.5,0.4-1.3-0.1-1.8S7-0.1,6.5,0.4L0.3,7.1C0.1,7.2,0,7.5,0,7.9L0,7.9z' fill='%2328646E' fill-rule='evenodd'/%3E%3C/svg%3E%0A");

      top: 50%;
      right: 100%;

      box-sizing: content-box;

      transform: translateY(-50%);

      transition-property: opacity;
      transition-duration: inherit;
      transition-timing-function: inherit;

      @apply absolute;

      @apply w-8;
      @apply h-16;

      @apply px-8;
    }

    &:not(&--disabled) {
      @apply ml-16;
    }

    &#{&}--disabled {
      @apply w-40;

      @apply pointer-events-none;

      &::before {
        @apply opacity-0;
      }
    }
  }
}
</style>
