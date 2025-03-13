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

      <div v-if="!getSessionWallet" class="hidden laptop:flex">
        <ProgressIndicator v-if="isLoggingIn" />
        <ButtonV2
          v-else
          preset="secondary"
          :text="$t('header_button_connect_to_wallet')"
          @click="handleConnectWallet"
        >
          <template #prepend>
            <IconLogin />
          </template>
        </ButtonV2>
      </div>

      <Dropdown class="hidden laptop:block ml-[4px]">
        <template #trigger="{ toggle }">
          <div v-if="getSessionWallet" class="relative">
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
                  'mb-[-3px]',
                  'px-[4px]',
                  'pointer-events-none',
                  'bg-shade-gray',
                  { 'bg-danger': getNotificationCount },
                  'text-white',
                  'text-[10px]',
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
        v-if="!getSessionWallet"
        class="laptop:hidden"
        preset="plain"
        @click="handleOpenSlider"
      >
        <IconNav />
      </ButtonV2>
      <div v-else class="relative laptop:!hidden">
        <Identity
          class="cursor-pointer ml-[12px]"
          :avatar-url="walletUserAvatar"
          :avatar-size="42"
          :is-avatar-outlined="isWalletUserCivicLiker"
          @click="handleOpenSlider"
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
          ]"
        />
      </div>
    </div>

    <SiteMenuForMobile
      v-if="isShowMobileMenu"
      @close="isShowMobileMenu = false"
    >
      <div v-if="!getSessionWallet">
        <ProgressIndicator v-if="isLoggingIn || getIsRestoringSession" />
        <ButtonV2
          v-else
          class="w-full"
          preset="secondary"
          @click="handleConnectWallet"
          ><div class="flex gap-[12px]">
            <IconLogin />
            {{ $t('header_button_connect_to_wallet') }}
          </div>
        </ButtonV2>
      </div>
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
                  'ml-[-4px]',
                  'mb-[-3px]',
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
              :text="$t(`Locale.${currentLocale}`)"
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
      isLoggingIn: false,
    };
  },
  computed: {
    ...mapGetters([
      'getHomeRoute',
      'getUserId',
      'getNotificationCount',
      'shoppingCartBookProductList',
      'getSessionWallet',
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
    await this.restoreAuthSession();
    if (this.getRouteBaseName(this.$route) === 'index') {
      this.$router.replace(
        this.localeLocation({
          name: this.walletIsMatchedSession ? 'dashboard' : 'store',
          query: this.$route.query,
        })
      );
    }
  },
  methods: {
    ...mapActions(['updatePreferences', 'userLogout', 'restoreAuthSession']),
    handleClickGoStore() {
      logTrackerEvent(this, 'site_header', 'site_header_click_store', '', 1);
    },
    handleSelectLocale(value) {
      this.updatePreferences({ locale: value });
    },
    async handleConnectWallet() {
      try {
        this.isLoggingIn = true;
        logTrackerEvent(
          this,
          'site_menu',
          'site_menu_click_connect_wallet',
          '',
          1
        );
        await this.connectWallet();
      } catch (err) {
        console.error(err);
        this.alertPromptError(err);
      } finally {
        this.isLoggingIn = false;
      }
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
              name: 'bookshelf',
              params: { id: this.getSessionWallet },
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
    handleOpenSlider() {
      this.isShowMobileMenu = true;

      if (this.getSessionWallet) {
        logTrackerEvent(
          this,
          'site_menu',
          'site_menu_click_slider_menu',
          this.getSessionWallet,
          1
        );
      } else {
        logTrackerEvent(
          this,
          'site_menu',
          'site_menu_click_slider_login',
          '',
          1
        );
      }
    },
  },
};
</script>
