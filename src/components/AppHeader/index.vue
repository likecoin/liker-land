<template>
  <div class="w-full flex items-center justify-between px-[24px] py-[16px]">
    <NuxtLink
      :class="{
        'site-logo site-nav-bar__logo': true,
        'site-logo--disabled': isDisabledNav || getHomeRoute.name === $route.name,
      }"
      :to="getHomeRoute"
    >
      <Logo />
    </NuxtLink>


    <div class="flex items-center">
      <ButtonV2
        class="relative overflow-hidden leading-0 mr-[24px] text-like-green"
        preset="tertiary"
      >
        <GlobeIcon class="w-20 h-20 fill-like-green" />
        <select
          class="absolute inset-y-0 right-0 opacity-0"
          :value="getLocale"
          @change="onChangeLocale"
        >
          <option
            v-for="locale in getAvailableLocales"
            :key="locale"
            class="p-[12px] rounded-[8px]"
            :value="locale"
          >{{ $t(`Locale.${locale}`) }}</option> 
          
        </select>
        
      </ButtonV2>
      <ButtonV2
        v-if="!getAddress"
        preset="secondary"
        :text="$t('header_button_connect_to_wallet')"
        @click="connectWallet"
      >
        <template #prepend>
          <IconLogin />
        </template>
      </ButtonV2>
      <NuxtLink
        v-else
        :to="`/${getAddress}`"
      >
        <Identity
          class="cursor-pointer"
          :avatar-url="getAvatar"
          :avatar-size="42"
          :is-avatar-outlined="getIsCivicLiker"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ellipsis } from '~/util/ui';

export default {
  name: 'AppHeader',
  filters: {
    ellipsis,
  },
  components: {
    Logo: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/logo.svg'),
    GlobeIcon: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/globe.svg'),
  },
  // mixins: [walletMixin],
  props: {
    isDisabledNav: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      'getHomeRoute',
      'getAvailableLocales',
      'getLocale',
      'getAddress',
      'getSigner',
      'getLikerInfo',
    ]),
    getDisplayName() {
      return this.getLikerInfo && this.getLikerInfo.displayName;
    },
    getAvatar() {
      return (
        (this.getLikerInfo && this.getLikerInfo.avatar) ||
        `https://avatars.dicebear.com/api/identicon/${this.getAddress}.svg`
      );
    },
    getIsCivicLiker() {
      return this.getLikerInfo && this.getLikerInfo.isSubscribedCivicLiker;
    },
  },
  async mounted() {
    const ans = await this.initIfNecessary();
  },
  methods: {
    ...mapActions([
      'toggleSlidingMenu',
      'updatePreferences',
      'connectWallet',
      'disconnectWallet',
      'initIfNecessary',
    ]),
    onChangeLocale(event) {
      const { value: locale } = event.target;
      this.$i18n.locale = locale;
      this.updatePreferences({ locale });
    },
  },
};
</script>

<style lang="scss">
.site-nav-bar {
  &__menu-button {
    transition-property: transform, opacity;
    transition-duration: 0.2s;
    transition-timing-function: ease;

    &:hover {
      opacity: 0.6;
    }
    &:active {
      transform: scale(0.9);

      opacity: 0.3;
    }
  }

  &__logo {
    @apply text-inherit-color;
  }
}
</style>
