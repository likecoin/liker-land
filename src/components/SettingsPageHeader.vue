<template>
  <header class="px-8 mb-24 text-like-green text-16 font-600">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <button
          :class="[
            'relative',
            'mr-16',
            'text-like-cyan leading-[0] fill-current',
            'hover:opacity-50 active:opacity-25',
            'transition-all duration-[0.25s] ease-in-out',
            isDisabledBackButton
              ? 'w-40 pointer-events-none'
              : 'w-24 ml-16',
          ]"
          @click="onClickBackButton"
        >
          <ArrowLeftIcon
            :class="[
              'absolute top-[50%] right-[100%]',
              'w-[8px] h-[16px] px-[8px]',
              'text-like-green',
              'box-content',
              'translate-y-[-50%]',
              'transition-opacity duration-[0.25s] ease-in-out',
              { 'opacity-0': isDisabledBackButton }
            ]"
          />
          <SettingsIcon />
        </button>

        <transition name="fade">
          <span v-if="isDisabledBackButton">{{ $t('SettingsPage.title') }}</span>
        </transition>
      </div>

      <Button
        v-if="$route.name === 'settings-support'"
        preset="primary-outline"
        :title="$t('civicLiker.about')"
        :to="localeLocation({ name: 'civic' })"
      />
    </div>
  </header>
</template>

<script>
import Button from '~/components/LegacyButton/Button';
import SettingsIcon from '~/assets/icons/cog.svg?inline';
import ArrowLeftIcon from '~/assets/icons/arrow-left.svg?inline';

export default {
  name: 'SettingsPageHeader',
  components: {
    ArrowLeftIcon,
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
