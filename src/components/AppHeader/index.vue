<template>
  <div
    class="w-full flex items-center justify-between pl-[56px] py-[40px] pr-[32px] z-10"
  >
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
      <!-- locale -->
      <div class="relative">
        <ButtonV2
          class="overflow-hidden leading-0 mr-[24px]"
          preset="tertiary"
          @click="isOpenOptions = !isOpenOptions; isOpenMenu = false"
          @blur="closeOptions"
        >
          <GlobeIcon class="w-20 h-20 fill-like-green" />
        </ButtonV2>
        <CustomOption
          v-model="isOpenOptions"
          :default-value="getCurrentLocals"
          :options="formatLocales"
          @onChange="onChangeLocale"
        />
      </div>
      <!-- Avatar -->
      <div
        class="relative"
        tabindex="0"
        @blur="closeMenu"
      >
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
        <Identity
          v-else
          class="relative cursor-pointer"
          :avatar-url="getAvatar"
          :avatar-size="42"
          :is-avatar-outlined="getIsCivicLiker"
          @click="isOpenMenu = !isOpenMenu; isOpenOptions = false"
        />
        <CustomOption
          v-model="isOpenMenu"
          :default-value="getCurrentLocals"
          :options="getMenuOptions"
          @onChange="onChangeMenu"
          @clickHeader="goDaoLikeCo"
        >
          <template #header>
            <div class="flex flex-col items-center px-[24px] py-[12px] cursor-pointer">
              <div class="flex flex-coltext-center text-like-green text-[32px] font-600">{{ balance }} </div>
              <div class="text-medium-gray text-[12px]">{{ $t('header_menu_LIKE') }}</div>
            </div>
            <div class="w-full h-[1px] bg-shade-gray" />
          </template>
        </CustomOption>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ellipsis } from '~/util/ui';
import { getAccountBalance } from '~/util/nft';

import Logo from '~/assets/icons/logo.svg?inline';
import GlobeIcon from '~/assets/icons/globe.svg?inline';

export default {
  name: 'AppHeader',
  filters: {
    ellipsis,
  },
  components: {
    Logo,
    GlobeIcon,
  },
  // mixins: [walletMixin],
  props: {
    isDisabledNav: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpenOptions: false,
      isOpenMenu: false,
      balance: 0,
      signingMethod: 'keplr',
    };
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
    getCurrentLocals() {
      return this.$t(`Locale.${this.getLocale}`);
    },
    formatLocales() {
      return this.getAvailableLocales.map(locale => ({
        value: locale,
        name: this.$t(`Locale.${locale}`),
      }));
    },
    getMenuOptions() {
      return this.signingMethod === 'likerId'
        ? [
            { value: 'portfolio', name: 'Portfolio' },
            { value: 'civic', name: 'Civic Liker' },
            { value: 'setting', name: 'Setting' },
            { value: 'signOut', name: 'Sign Out' },
          ]
        : [
            { value: 'portfolio', name: 'Portfolio' },
            { value: 'civic', name: 'Civic Liker' },
            { value: 'signOut', name: 'Sign Out' },
          ];
    },
  },
  watch: {
    getAddress: {
      immediate: true,
      handler(newAddress) {
        if (newAddress) this.fetchBalance(newAddress);
      },
    },
  },
  async mounted() {
    await this.initIfNecessary();
  },
  methods: {
    ...mapActions([
      'toggleSlidingMenu',
      'updatePreferences',
      'connectWallet',
      'disconnectWallet',
      'initIfNecessary',
    ]),
    onChangeLocale(value) {
      this.$i18n.locale = value;
      this.updatePreferences({ locale: value });
    },
    closeOptions() {
      setTimeout(() => (this.isOpenOptions = false), 100);
    },
    closeMenu() {
      setTimeout(() => (this.isOpenMenu = false), 100);
    },
    goDaoLikeCo() {
      window.open('https://dao.like.co/', '_blank');
    },
    onChangeMenu(value) {
      switch (value) {
        case 'portfolio':
          this.$router.push({
            name: 'id',
            params: { id: this.getAddress },
          });
          break;
        case 'civic':
          this.$router.push({ name: 'civic-dashboard' });
          break;

        case 'setting':
          this.$router.push({ name: 'setting' });
          break;

        case 'signOut':
          this.disconnectWallet();
          break;

        default:
          break;
      }
    },
    async fetchBalance() {
      const num = await getAccountBalance(this.getAddress);
      this.balance = Number(num).toFixed(2);
    },
  },
};
</script>

<style lang="scss">
.site-nav-bar {
  &__logo {
    @apply text-inherit-color;
  }
}
</style>
