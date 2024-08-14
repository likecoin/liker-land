<template>
  <div v-if="walletIsMatchedSession">
    <slot name="prepend" />

    <MobileStickyCard :is-sticky="isStickToBottomAtMobile">
      <slot />
      <slot name="append" />
    </MobileStickyCard>
  </div>
  <div v-else class="flex flex-col justify-center flex-grow">
    <slot name="prepend" />

    <MobileStickyCard
      class="flex flex-col justify-center"
      :is-sticky="isStickToBottomAtMobile"
    >
      <Label
        class="text-medium-gray"
        align="center"
        :text="loginLabel || $t('settings_page_content_with_auth_login_label')"
      />
      <div class="flex flex-col items-center mt-[24px]">
        <template v-if="isLoadingStartImmediately || walletIsLoggingIn">
          <ProgressIndicator />
          <Label
            class="text-medium-gray w-full mt-[4px]"
            align="center"
            preset="p6"
            :text="$t('auth_required_view_hint_label_loading')"
          />
        </template>
        <ButtonV2
          v-else
          :text="
            loginButtonLabel ||
              $t('settings_page_content_with_auth_login_button')
          "
          preset="secondary"
          @click="onClickLogin"
        />
      </div>
      <slot name="append" />
    </MobileStickyCard>
  </div>
</template>

<script>
import walletMixin from '~/mixins/wallet';
import walletLoginMixin from '~/mixins/wallet-login';

export default {
  mixins: [walletMixin, walletLoginMixin],
  props: {
    loginLabel: {
      type: String,
      default: '',
    },
    loginButtonLabel: {
      type: String,
      default: '',
    },
    isLoadingStartImmediately: {
      type: Boolean,
      default: false,
    },
    isStickToBottomAtMobile: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const { login } = this.$route.query;
    if (!this.walletIsMatchedSession && login) {
      this.onClickLogin();
    }
  },
  methods: {
    async onClickLogin() {
      this.$emit('click-login');
      if (this.hasConnectedWallet) {
        await this.initIfNecessary();
      } else {
        await this.connectWallet();
      }
      this.$emit('login');
    },
  },
};
</script>
