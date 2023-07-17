<template>
  <div
    :class="[
      'flex',
      'items-center',
      'justify-between',
      'gap-x-[1.5em]',
      'w-full',
      'pl-[1em] sm:pl-[3.5em]',
      'pr-[.75em] sm:pr-[2em]',
      'py-[2.5em]',
    ]"
  >
    <NuxtLink
      class="w-[90px] hover:scale-105 active:scale-100 transition-transform"
      :disabled="localeLocation(getHomeRoute).name === $route.name"
      :to="localeLocation(getHomeRoute)"
    >
      <Logo class="fill-current" />
    </NuxtLink>

    <div class="relative flex items-center gap-x-[.75em] sm:gap-x-[1.5em]">

      <!--
      <ShoppingCartSiteButton />
      -->

      <div v-if="loginAddress" class="relative">
        <ButtonV2
          :preset="isPlain ? 'plain' : 'tertiary'"
          :to="localeLocation({ name: 'notifications' })"
        >
          <IconBell class="w-20 h-20 text-like-green" />
        </ButtonV2>
        <div
          v-if="getNotificationCount > 0"
          :class="[
            'absolute',
            'bottom-full',
            'left-full',
            'flex',
            'justify-center',
            'items-center',
            'bg-danger',
            'rounded-full',
            'min-w-[20px]',
            'min-h-[20px]',
            'ml-[-10px]',
            'mb-[-10px]',
            'px-[4px]',
            'py-[5px]',
            'pointer-events-none',
          ]"
        >
          <span class="text-white text-[10px] leading-[1em]">
            {{ formattedNotificationCount }}
          </span>
        </div>
      </div>

      <Dropdown>
        <template #trigger="{ toggle }">
          <ButtonV2
            :preset="isPlain ? 'plain' : 'tertiary'"
            @click="toggle"
          >
            <GlobeIcon class="w-20 h-20 fill-like-green" />
          </ButtonV2>
        </template>
        <MenuList>
          <MenuItem
            v-for="(item, i) in availableLocales"
            :key="i"
            :value="item.value"
            :label="item.name"
            :selected-value="currentLocale"
            @select="handleSelectLocale"
          />
        </MenuList>
      </Dropdown>

      <ButtonV2
        v-if="!getAddress"
        class="hidden laptop:flex"
        :preset="isPlain ? 'outline' : 'secondary'"
        :text="$t('header_button_connect_to_wallet')"
        @click="connectWallet"
      >
        <template #prepend>
          <IconLogin />
        </template>
      </ButtonV2>

      <Dropdown>
        <template #trigger="{ toggle }">
          <ButtonV2
            v-if="!getAddress"
            class="-mr-[8px]"
            preset="plain"
            @click="toggle"
          >
            <IconNav />
          </ButtonV2>
          <div v-else class="relative">
            <Identity
              class="cursor-pointer"
              :avatar-url="walletUserAvatar"
              :avatar-size="42"
              :is-avatar-outlined="isWalletUserCivicLiker"
              @click="toggle"
            />
          </div>
        </template>
        <MenuList>
          <template
            v-if="getAddress"
          >
            <a
              class="flex flex-col items-center px-[24px] py-[12px] cursor-pointer"
              href="https://dao.like.co/"
              target="_blank"
              rel="noopener"
            >
              <div
                class="text-center text-like-green text-[32px] font-600"
              >{{ walletLIKEBalance | formatNumber }}</div>
              <div
                class="text-medium-gray text-[12px] leading-[1]"
              >{{ $t('header_menu_LIKE') }}</div>
            </a>
          </template>
          <MenuItem
            v-for="(item, i) in mainMenuItems"
            :key="i"
            :value="item.value"
            :label="item.name"
            label-align="left"
            @select="handleSelectMenuItem"
          >
            <template #label-prepend>
              <MenuIcon :type="item.value" />
            </template>
            <template
              v-if="item.value === 'notifications' && getNotificationCount > 0"
              #label-append
            >
              <div
                :class="[
                  'flex',
                  'justify-center',
                  'items-center',
                  'bg-shade-gray',
                  { 'bg-danger': getNotificationCount },
                  'rounded-full',
                  'min-w-[24px]',
                  'px-[8px]',
                  'py-[4px]'
                ]"
              >
                <div class="text-white text-[10px]">
                  {{ formattedNotificationCount }}
                </div>
              </div>
            </template>
          </MenuItem>
        </MenuList>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import walletMixin from '~/mixins/wallet';
import { ellipsis, formatNumber } from '~/util/ui';
import { logTrackerEvent } from '~/util/EventLogger';
import { APP_LIKE_CO_URL_BASE } from '~/constant';

import Logo from '~/assets/icons/logo.svg?inline';
import GlobeIcon from '~/assets/icons/globe.svg?inline';

export default {
  name: 'SiteHeader',
  filters: {
    ellipsis,
    formatNumber,
  },
  components: {
    Logo,
    GlobeIcon,
  },
  mixins: [walletMixin],
  props: {
    isPlain: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['getHomeRoute', 'getUserId', 'getNotificationCount']),
    currentLocale() {
      return this.$i18n.locale;
    },
    availableLocales() {
      return this.$i18n.locales.map(locale => ({
        value: locale.code,
        name: this.$t(`Locale.${locale.code}`),
      }));
    },
    mainMenuItems() {
      const options = [
        { value: 'dashboard', name: this.$t('main_menu_my_dashboard') },
        { value: 'mintNft', name: this.$t('main_menu_mint_nft') },
      ];

      if (this.getAddress || this.getUserId) {
        options.push(
          { value: 'notifications', name: this.$t('main_menu_notification') },
          { value: 'setting', name: this.$t('main_menu_settings') },
          { value: 'signOut', name: this.$t('main_menu_sign_out') }
        );
      }

      return options;
    },
    formattedNotificationCount() {
      const { getNotificationCount: count } = this;
      return `${Math.min(count, 99)}${count > 99 ? '+' : ''}`;
    },
  },
  async mounted() {
    await this.restoreSession();
  },
  methods: {
    ...mapActions(['updatePreferences', 'userLogout']),
    handleSelectLocale(value) {
      this.updatePreferences({ locale: value });
    },
    async handleSelectMenuItem(value) {
      switch (value) {
        case 'dashboard': {
          logTrackerEvent(this, 'site_menu', 'site_menu_click_dashboad', '', 1);
          await this.navigateToMyDashboard();
          break;
        }

        case 'civic':
          logTrackerEvent(this, 'site_menu', 'site_menu_click_civic', '', 1);
          this.$router.push(this.localeLocation({ name: 'civic' }));
          break;

        case 'mintNft':
          logTrackerEvent(this, 'site_menu', 'site_menu_click_mint_nft', '', 1);
          window.open(`${APP_LIKE_CO_URL_BASE}/nft`, '_blank');
          break;

        case 'notifications':
          logTrackerEvent(
            this,
            'site_menu',
            'site_menu_click_notifications',
            '',
            1
          );
          this.$router.push(this.localeLocation({ name: 'notifications' }));
          break;

        case 'setting':
          logTrackerEvent(this, 'site_menu', 'site_menu_click_settings', '', 1);
          this.$router.push(this.localeLocation({ name: 'settings' }));
          break;

        case 'signOut':
          logTrackerEvent(this, 'site_menu', 'site_menu_click_signout', '', 1);
          this.disconnectWallet();
          if (this.getUserId) {
            this.userLogout();
          }
          break;

        default:
          break;
      }
    },
  },
};
</script>
