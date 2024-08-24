<template>
  <header
    :class="[
      'flex',
      'items-center',
      'w-full',
      isDisabledBackButton ? 'h-[0]' : 'h-[66px]',
      'desktop:h-auto',
      'transition-all duration-[0.5s] ease-in-out',
    ]"
  >
    <button
      :class="[
        'absolute',
        'p-8',
        'hover:opacity-50 active:opacity-25',
        'transition-all duration-[0.5s] ease-in-out',
        { 'opacity-0 translate-x-[-100%]': isDisabledBackButton },
        { 'pointer-events-none': isDisabledBackButton },
      ]"
      @click="onClickBackButton"
    >
      <ArrowLeftIcon class="w-[8px] h-[16px]" />
    </button>

    <h3
      :class="[
        { 'opacity-0 desktop:opacity-100': isDisabledBackButton },

        'text-[28px]',
        'font-500',

        { 'scale-75 translate-x-[12px]': !isDisabledBackButton },
        'transition-all duration-[0.5s] ease-in-out',
      ]"
    >
      {{ title }}
    </h3>
  </header>
</template>

<script>
import ArrowLeftIcon from '~/assets/icons/arrow-left.svg?inline';

export default {
  name: 'SettingsPageHeader',
  components: {
    ArrowLeftIcon,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    isShowBack: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isDisabledBackButton() {
      return !this.isShowBack;
    },
  },
  methods: {
    onClickBackButton() {
      const backRouteName = this.getRouteBaseName(this.$route)
        .split('-')
        .slice(0, -1)
        .join('-');
      if (backRouteName) {
        this.$router.push(this.localeLocation({ name: backRouteName }));
      }
    },
  },
};
</script>
