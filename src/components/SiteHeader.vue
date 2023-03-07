<template>
  <div
    :class="[
      'flex',
      'items-center',
      'justify-between',
      'gap-x-[24px]',
      'w-full',
      'pl-[32px]',
      'pr-[24px]',
      'py-[40px]',
      'laptop:pr-[32px]',
      'laptop:pl-[56px]',
    ]"
  >
    <NuxtLink
      class="w-[90px] hover:scale-105 active:scale-100 transition-transform"
      :disabled="localeLocation(getHomeRoute).name === $route.name"
      :to="localeLocation(getHomeRoute)"
    >
      <Logo class="fill-current" />
    </NuxtLink>

    <div class="relative flex items-center gap-x-[16px] laptop:gap-x-[24px]">
      <Dropdown>
        <template v-slot:trigger="{ toggle }">
          <ButtonV2
            preset="tertiary"
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
        preset="secondary"
        :text="$t('header_button_connect_to_wallet')"
        @click="connectWallet"
      >
        <template #prepend>
          <IconLogin />
        </template>
      </ButtonV2>

      <Dropdown>
        <template v-slot:trigger="{ toggle }">
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
            <div
              v-if="getNotificationCount"
              class="absolute top-0 right-0 bg-danger rounded-full w-[8px] h-[8px]"
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
            <template #label-append>
              <div
                v-if="item.value === 'notifications'"
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
                <div class="text-white text-[6px]">
                  {{ getNotificationCount }}
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
        { value: 'civic', name: this.$t('main_menu_civic_liker') },
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
