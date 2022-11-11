<template>
  <div class="flex flex-col items-center gap-[24px] text-medium-gray bg-shade-gray rounded-[24px] px-[32px] py-[24px]">
    <Label
      preset="h2"
      :text="$t(isEmpty ? 'portfolio_subscription_title_empty' : 'portfolio_subscription_title')"
    />
    <Label v-if="isEmpty" preset="p5" align="center">
      <i18n path="portfolio_subscription_description_empty">
        <span class="font-[600] text-like-green" place="creator">{{ formattedCreatorDisplayName }}</span>
      </i18n>
    </Label>
    <Label class="text-dark-gray" preset="p6">
      <i18n path="portfolio_subscription_hint">
        <span class="font-[600] text-like-green" place="creator">{{ formattedCreatorDisplayName }}</span>
      </i18n>
    </Label>
    <form
      class="flex gap-[16px] items-center"
      @submit="submitEmail"
    >
      <TextField
        ref="emailTextField"
        type="email"
        :placeholder="$t('portfolio_subscription_email_placeholder')"
        :is-disabled="isLoading"
        @input="handleEmailInput"
      />
      <ProgressIndicator v-if="isLoading" />
      <ButtonV2
        v-else
        :key="subscriptionId"
        class="font-[600]"
        preset="secondary"
        :text="submitButtonText"
        @click="submitEmail"
      >
        <template v-if="!subscriptionId" #prepend>
          <IconNotify class="w-[20px]" />
        </template>
        <template v-else #append>
          <IconCheck width="20" height="20" />
        </template>
      </ButtonV2>
    </form>
    <p
      v-if="subscriptionId"
      class="text-medium-gray text-[14px] text-center"
    >{{ $t('portfolio_subscription_submitted_hint') }}</p>
  </div>
</template>

<script>
import { nftMintSubscriptionAPI } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { ellipsis } from '~/util/ui';

import alertMixin from '~/mixins/alert';

export default {
  name: 'NFTPortfolioSubscriptionForm',
  mixins: [alertMixin],
  props: {
    creatorWalletAddress: {
      type: String,
      required: true,
    },
    creatorDisplayName: {
      type: String,
      default: '',
    },
    isEmpty: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      isLoading: false,
      subscriptionId: '',
    };
  },
  computed: {
    formattedCreatorDisplayName() {
      return ellipsis(this.creatorDisplayName || this.creatorWalletAddress);
    },
    submitButtonText() {
      if (this.subscriptionId) {
        return this.$t('portfolio_subscription_notify_button_submitted');
      }
      return this.$t('portfolio_subscription_notify_button');
    },
  },
  watch: {
    email() {
      this.subscriptionId = '';
    },
  },
  methods: {
    handleEmailInput(email) {
      this.email = email;
    },
    async submitEmail(e) {
      e.preventDefault();
      if (!this.email || this.subscriptionId) {
        const { emailTextField } = this.$refs;
        if (emailTextField) {
          emailTextField.focus();
        }
        return;
      }

      logTrackerEvent(
        this,
        'NFT',
        'nft_mint_subscription_submit',
        this.wallet,
        1
      );

      this.isLoading = true;
      try {
        const res = await this.$api.post(
          nftMintSubscriptionAPI({
            email: this.email,
            wallet: this.creatorWalletAddress,
          })
        );
        this.subscriptionId = res.data.subscriptionId;
        this.alertPromptSuccess(
          this.$t('portfolio_subscription_notify_success_alert', {
            creator: this.formattedCreatorDisplayName,
          })
        );
      } catch (err) {
        if (err.response.data === 'ALREADY_SUBSCRIBED') {
          this.alertPromptError(
            this.$t('portfolio_subscription_notify_duplicated_alert', {
              creator: this.formattedCreatorDisplayName,
            })
          );
        } else {
          // eslint-disable-next-line no-console
          console.error(err);
          this.alertPromptError(
            this.$t('portfolio_subscription_notify_error_alert', {
              creator: this.formattedCreatorDisplayName,
              error: err.response.data,
            })
          );
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
