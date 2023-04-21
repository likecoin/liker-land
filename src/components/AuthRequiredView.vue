<template>
  <div v-if="walletIsMatchedSession">
    <slot />
  </div>
  <div v-else class="flex flex-col justify-center flex-grow">
    <Label
      class="text-medium-gray"
      align="center"
      :text="loginLabel || $t('settings_page_content_with_auth_login_label')"
    />
    <div class="flex flex-col items-center mt-[24px]">
      <template v-if="isLoadingAtStart || walletIsLoggingIn">
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
        @click="connectWallet"
      />
    </div>
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
    isLoadingAtStart: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
