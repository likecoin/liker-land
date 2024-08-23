<template>
  <div
    :class="[
      'site-header',
      'flex',
      'items-center',
      'justify-between',
      'gap-x-[1.5em]',
      'w-full',
      'pl-[1em] sm:pl-[3.5em]',
      'pr-[.75em] sm:pr-[2em]',
      'py-[2.5em] phone:py-[28px]',
      'z-[50]',
    ]"
  >
    <div class="flex items-center gap-[40px] phone:gap-[20px]">
      <NuxtLink
        class="w-[90px] hover:scale-105 active:scale-100 transition-transform"
        :disabled="localeLocation(getHomeRoute).name === $route.name"
        :to="localeLocation(getHomeRoute)"
      >
        <Logo class="fill-current" />
      </NuxtLink>

      <ButtonV2
        :to="localeLocation({ name: 'store' })"
        preset="tertiary"
        size="mini"
        :text="$t('header_button_try_collect')"
        :class="[
          '!text-like-green',
          { '!text-white !bg-[rgba(235,235,235,0.2)]': isPlain },
        ]"
        @click.native="handleClickGoStore"
      />
    </div>

    <div class="relative flex items-center gap-x-[.75em] sm:gap-x-[1.5em]">
      <ShoppingCartSiteButton :is-plain="isPlain" />

      <Dropdown class="hidden laptop:block">
        <template #trigger="{ toggle }">
          <ButtonV2 :preset="isPlain ? 'plain' : 'tertiary'" @click="toggle">
            <GlobeIcon class="w-20 h-20 fill-current" />
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

      <Dropdown class="hidden laptop:block ml-[4px]">
        <template #trigger="{ toggle }">
          <div v-if="getAddress" class="relative">
            <Identity
              class="cursor-pointer"
              :avatar-url="walletUserAvatar"
              :avatar-size="42"
              :is-avatar-outlined="isWalletUserCivicLiker"
              @click="toggle"
            />
            <div
              v-if="getNotificationCount"
              :class="[
                'w-[12px]',
                'h-[12px]',
                'absolute',
                'top-0',
                'right-0',
                'bg-danger',
                'rounded-full',
                'hidden laptop:block',
              ]"
            />
          </div>
        </template>
        <MenuList>
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
                  'rounded-full',
                  'min-w-[20px]',
                  'min-h-[20px]',
                  'ml-[-10px]',
                  'mb-[-10px]',
                  'px-[4px]',
                  'py-[5px]',
                  'pointer-events-none',
                  'bg-shade-gray',
                  { 'bg-danger': getNotificationCount },
                  'text-white',
                  'text-[10px]',
                  'leading-[1em]',
                ]"
              >
                {{ formattedNotificationCount }}
              </div>
            </template>
          </MenuItem>
        </MenuList>
      </Dropdown>

      {{ /* phone version */ }}
      <ButtonV2
        v-if="!getAddress"
        class="laptop:hidden"
        preset="plain"
        @click="handleOpenSider"
      >
        <IconNav />
      </ButtonV2>
      <Identity
        v-if="getAddress"
        class="cursor-pointer laptop:!hidden ml-[12px]"
        :avatar-url="walletUserAvatar"
        :avatar-size="42"
        :is-avatar-outlined="isWalletUserCivicLiker"
        @click="handleOpenSider"
      />
    </div>

    <SiteMenuForMobile
      v-if="isShowMobileMenu"
      @close="isShowMobileMenu = false"
    >
      <ButtonV2
        v-if="!getAddress"
        class="w-full"
        preset="secondary"
        @click="connectWallet"
        ><div class="flex gap-[12px]">
          <IconLogin />
          {{ $t('header_button_connect_to_wallet') }}
        </div>
      </ButtonV2>
      <div v-else class="w-full">
        <ul class="w-full text-dark-gray">
          <MenuItem
            v-for="(item, i) in mainMenuItems"
            :key="i"
            class="flex items-center justify-start w-full"
            :value="item.value"
            :label="item.name"
            label-align="left"
            @select="handleSelectMenuItem"
          >
            <template #label-prepend>
              <MenuIcon :type="item.value" class="mr-[12px]" />
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
                  'rounded-full',
                  'min-w-[20px]',
                  'min-h-[20px]',
                  'ml-[-10px]',
                  'mb-[-10px]',
                  'px-[4px]',
                  'py-[5px]',
                  'pointer-events-none',
                  'bg-shade-gray',
                  { 'bg-danger': getNotificationCount },
                  'text-white',
                  'text-[10px]',
                  'leading-[1em]',
                ]"
              >
                {{ formattedNotificationCount }}
              </div>
            </template>
          </MenuItem>
        </ul>
      </div>

      <template #footer>
        <Dropdown>
          <template #trigger="{ toggle }">
            <ButtonV2
              preset="tertiary"
              :text="$t(`Locale.${currentLocale}`),"
              @click="toggle"
            >
              <template #prepend>
                <GlobeIcon class="w-20 h-20 fill-current" />
              </template>
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
      </template>
    </SiteMenuForMobile>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import walletMixin from '~/mixins/wallet';
import { ellipsis, formatNumber } from '~/util/ui';
import { logTrackerEvent } from '~/util/EventLogger';

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
  data() {
    return {
      isShowMobileMenu: false,
    };
  },
  computed: {
    ...mapGetters([
      'getHomeRoute',
      'getUserId',
      'getNotificationCount',
      'shoppingCartBookProductList',
    ]),
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
        { value: 'portfolio', name: this.$t('main_menu_my_portfolio') },
        { value: 'notifications', name: this.$t('main_menu_notification') },
        { value: 'setting', name: this.$t('main_menu_settings') },
        { value: 'signOut', name: this.$t('main_menu_sign_out') },
      ];
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
    handleClickGoStore() {
      logTrackerEvent(this, 'site_header', 'site_header_click_store', '', 1);
    },
    handleSelectLocale(value) {
      this.updatePreferences({ locale: value });
    },
    handleSelectMenuItem(value) {
      switch (value) {
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

        case 'portfolio':
          logTrackerEvent(
            this,
            'site_menu',
            'site_menu_click_book_shelf',
            '',
            1
          );
          this.$router.push(
            this.localeLocation({
              name: 'id-bookshelf',
              params: { id: this.getAddress || this.loginAddress },
              query: { tab: 'collected' },
            })
          );
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
    handleOpenSider() {
      this.isShowMobileMenu = true;

      if (this.getAddress) {
        logTrackerEvent(
          this,
          'site_menu',
          'site_menu_click_sider_menu',
          this.getAddress,
          1
        );
      } else {
        logTrackerEvent(
          this,
          'site_menu',
          'site_menu_click_sider_login',
          '',
          1
        );
      }
    },
  },
};
</script>
