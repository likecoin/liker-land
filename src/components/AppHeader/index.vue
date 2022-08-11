<template>
  <div
    :class="[
      'flex',
      'items-center',
      'justify-between',
      'z-10',
      'w-full',
      'py-[40px]',
      'pl-[32px]',
      'pr-[24px]',
      'laptop:pr-[32px]',
      'laptop:pl-[56px]',
    ]"
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


    <div class="relative flex items-center gap-x-[16px] laptop:gap-x-[24px]">
      <!-- locale -->
      <div class="relative">
        <ButtonV2
          class="overflow-hidden leading-0"
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

      <ButtonV2
        v-if="!getAddress"
        class="hidden laptop:flex"
        preset="secondary"
        :text="$t('header_button_connect_to_wallet')"
        @click="connectWallet"
      >
        <template #prepend>
          <IconLogin />
        </template>
      </ButtonV2>

      <ButtonV2
        v-if="!getAddress"
        class="-mr-[8px]"
        preset="plain"
        tabindex="0"
        @click="isOpenMenu = !isOpenMenu; isOpenOptions = false"
        @blur="closeMenu"
      >
        <IconNav />
      </ButtonV2>
      <Identity
        v-else
        class="relative cursor-pointer"
        :avatar-url="getAvatar"
        :avatar-size="42"
        :is-avatar-outlined="getIsCivicLiker"
        tabindex="0"
        @click="isOpenMenu = !isOpenMenu; isOpenOptions = false"
        @blur="closeMenu"
      />
      <CustomOption
        v-model="isOpenMenu"
        :default-value="getCurrentLocals"
        :options="getMenuOptions"
        @onChange="onChangeMenu"
        @clickHeader="goDaoLikeCo"
      >
        <template
          v-if="getAddress"
          #header
        >
          <div class="flex flex-col items-center px-[24px] py-[12px] cursor-pointer">
            <div class="flex flex-coltext-center text-like-green text-[32px] font-600">{{ balance }} </div>
            <div class="text-medium-gray text-[12px]">{{ $t('header_menu_LIKE') }}</div>
          </div>
          <div class="w-full h-[1px] bg-shade-gray" />
        </template>
      </CustomOption>
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
      const options = [
        { value: 'profile', name: 'Profile' },
        { value: 'civic', name: 'Civic Liker' },
      ];

      if (this.signingMethod === 'likerId') {
        options.push({ value: 'setting', name: 'Setting' });
      }

      if (this.getAddress) {
        options.push({ value: 'signOut', name: 'Sign Out' });
      }

      return options;
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
    async onChangeMenu(value) {
      switch (value) {
        case 'profile': {
          if (await this.connectWallet()) {
            this.$router.push({
              name: 'id',
              params: { id: this.getAddress },
            });
          }
          break;
        }

        case 'civic':
          this.$router.push({ name: 'civic' });
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
