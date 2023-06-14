<template>
  <div v-if="walletIsMatchedSession">
    <slot name="prepend" />
    <slot />
    <slot name="append" />
  </div>
  <div v-else class="flex flex-col justify-center flex-grow">
    <slot name="prepend" />
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
        :text="loginButtonLabel || $t('settings_page_content_with_auth_login_button')"
        preset="secondary"
        @click="onClickLogin"
      />
    </div>
    <slot name="append" />
  </div>
</template>

<script>
import walletMixin from '~/mixins/wallet';

export default {
  mixins: [walletMixin],
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
  },
  methods: {
    async onClickLogin() {
      this.$emit('click-login');
      await this.connectWallet();
      this.$emit('login');
    },
  },
};
</script>
