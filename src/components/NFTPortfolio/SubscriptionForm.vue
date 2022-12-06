<template>
  <div class="flex flex-col items-center gap-[24px] text-medium-gray bg-shade-gray rounded-[24px] px-[32px] py-[24px]">
    <Label
      preset="h4"
      align="center"
      :text="$t(isEmpty ? 'portfolio_subscription_title_empty' : 'portfolio_subscription_title')"
    />
    <Label v-if="isEmpty" preset="p5" align="center">
      <i18n path="portfolio_subscription_description_empty">
        <span class="font-[600] text-like-green" place="creator">{{ formattedCreatorDisplayName }}</span>
      </i18n>
    </Label>
    <Label class="text-dark-gray" preset="p6" align="center">
      <i18n path="portfolio_subscription_hint">
        <span class="font-[600] text-like-green" place="creator">{{ formattedCreatorDisplayName }}</span>
      </i18n>
    </Label>
    <form
      class="flex phone:flex-col gap-[16px] items-center justify-center flex-wrap"
      @submit="submitEmail"
    >
      <TextField
        ref="emailTextField"
        type="email"
        :pattern="emailRegexString"
        :placeholder="$t('portfolio_subscription_email_placeholder')"
        :is-disabled="isLoading"
        :required="true"
        @input="handleEmailInput"
      />
      <ProgressIndicator v-if="isLoading" />
      <ButtonV2
        v-else
        :key="subscriptionId"
        class="font-[600]"
        preset="secondary"
        type="submit"
        :text="submitButtonText"
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
import { EMAIL_REGEX_STRING } from '~/constant';
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
    emailRegexString() {
      return EMAIL_REGEX_STRING;
    },
    emailRegex() {
      return new RegExp(this.emailRegexString);
    },
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

      if (!this.emailRegex.test(this.email)) {
        this.alertPromptError(
          this.$t('portfolio_subscription_notify_invalid_email_alert')
        );
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
        const errorMessage = err.response?.data;
        switch (errorMessage) {
          case 'ALREADY_SUBSCRIBED':
          case 'SUBSCRIBE_IN_COOLDOWN':
            this.alertPromptError(
              this.$t(
                errorMessage === 'ALREADY_SUBSCRIBED'
                  ? 'portfolio_subscription_notify_duplicated_alert'
                  : 'portfolio_subscription_notify_cooldown_alert',
                {
                  creator: this.formattedCreatorDisplayName,
                }
              )
            );
            break;

          default:
            // eslint-disable-next-line no-console
            console.error(err);
            this.alertPromptError(
              this.$t('portfolio_subscription_notify_error_alert', {
                creator: this.formattedCreatorDisplayName,
                error: errorMessage || err.toString(),
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
