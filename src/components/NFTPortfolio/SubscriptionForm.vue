<template>
  <CardV2
    class="flex flex-col items-center gap-[24px] text-medium-gray"
    :is-outline="true"
  >
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
      <i18n :path="labelText">
        <span class="font-[600] text-like-green" place="creator">{{ formattedCreatorDisplayName }}</span>
      </i18n>
    </Label>
    <form
      v-if="!isWalletConnected || (!walletEmailUnverified && !walletEmail)"
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
        :class="[
          'font-[600]',
          { 'border-2 border-medium-gray': !email },
        ]"
        :preset="isWalletConnected ? 'primary' : 'secondary'"
        type="submit"
        :is-disabled="!email"
        :text="submitButtonText"
      >
        <template v-if="!subscriptionId && !isWalletConnected" #prepend>
          <LazyIconNotify class="w-[20px]" />
        </template>
        <template v-else-if="subscriptionId" #append>
          <LazyIconCheck width="20" height="20" />
        </template>
      </ButtonV2>
    </form>
    <div v-else-if="!walletHasVerifiedEmail">
      <ProgressIndicator v-if="isLoading" />
      <ButtonV2 v-else preset="primary" :text="$t('portfolio_subscription_follow')" @click="handleClickVerify" />
    </div>
    <div v-else-if="isWalletConnected && walletEmail">
      <ProgressIndicator v-if="isLoading" />
      <ButtonV2
        v-else
        :preset="isFollowed ? 'outline' : 'primary'"
        @click="handleClickFollow"
      >
        {{ isFollowed ? $t('portfolio_subscription_unfollow') : $t('portfolio_subscription_follow') }}
      </ButtonV2>
    </div>
    <p
      v-if="subscriptionId"
      class="text-medium-gray text-[14px] text-center"
    >{{ $t('portfolio_subscription_submitted_hint') }}</p>
    <Dialog
      v-model="shouldShowAlertDialog"
      preset="custom"
      panel-container-class="phone:max-w-[520px] laptop:w-[520px]"
      panel-component="CardV2"
    >
      <div class="flex justify-center my-[24px]">
        <div class="bg-like-cyan-light rounded-[50%] p-[12px]">
          <LazyIconEmail class="w-[32px] text-like-green" />
        </div>
      </div>
      <Label preset="h4" align="center" class="mb-[8px]" :text="$t('portfolio_subscription_verify_title')" />
      <Label class="text-dark-gray" preset="p5" align="center">
        <i18n path="portfolio_subscription_verify">
          <a v-if="!!checkEmailLink" :href="checkEmailLink" target="_blank" class="font-[600] text-like-green underline" place="email">{{ walletEmailUnverified }}</a>
          <span v-else class="font-[600] text-like-green" place="email">{{ walletEmailUnverified }}</span>
        </i18n>
      </Label>
      <p class="text-center underline text-[10px] text-medium-gray mt-[32px] cursor-pointer" @click="handleClickResend">{{ $t('portfolio_subscription_verify_sendAgain') }}</p>
    </Dialog>
  </CardV2>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { EMAIL_REGEX_STRING } from '~/constant';
import { nftMintSubscriptionAPI } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { ellipsis } from '~/util/ui';

import alertMixin from '~/mixins/alert';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'NFTPortfolioSubscriptionForm',
  mixins: [alertMixin, walletMixin],
  props: {
    creatorWalletAddress: {
      type: String,
      required: true,
    },
    creatorDisplayName: {
      type: String,
      default: '',
    },
    isWalletConnected: {
      type: Boolean,
      default: false,
    },
    isWalletLoggedIn: {
      type: Boolean,
      default: false,
    },
    isFollowed: {
      type: Boolean,
      default: false,
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
      shouldShowAlertDialog: false,
    };
  },
  computed: {
    ...mapGetters(['walletEmailUnverified']),
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
      if (!this.isWalletConnected) {
        return this.$t('portfolio_subscription_notify_button');
      }
      return this.$t('portfolio_subscription_follow');
    },
    labelText() {
      if (!this.isWalletConnected) {
        return 'portfolio_subscription_hint';
      }
      if (!this.isLoading && this.isFollowed) {
        return 'portfolio_unfollow_hint';
      }
      return 'portfolio_follow_hint';
    },
    checkEmailLink() {
      let link;
      const email = this.walletEmailUnverified;
      switch (true) {
        case email.includes('gmail'):
          link = 'https://mail.google.com/';
          break;
        case email.includes('yahoo'):
          link = 'https://mail.yahoo.com/';
          break;
        case email.includes('icloud'):
          link = 'https://www.icloud.com/';
          break;
        default:
          link = undefined;
          break;
      }
      return link;
    },
  },
  watch: {
    email() {
      this.subscriptionId = '';
    },
  },
  methods: {
    ...mapActions([
      'walletUpdateEmail',
      'walletFollowCreator',
      'walletUnfollowCreator',
    ]),
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

      if (!this.isWalletConnected) {
        await this.handleSubscribeCreator();
      } else {
        // Guard login
        if (!this.isWalletLoggedIn) {
          try {
            this.isLoading = true;
            await this.signLogin();
          } catch {
            // No-op
          } finally {
            this.isLoading = false;
          }
          if (!this.isWalletLoggedIn) {
            return;
          }
        }

        // If user is following the creator, do nothing
        if (this.isFollowed) {
          return;
        }

        // If user has verified email, follow the creator without updating email
        if (this.walletHasVerifiedEmail) {
          this.walletFollowCreator(this.creatorWalletAddress);
          return;
        }

        await this.updateWalletEmail();
      }
    },
    async handleSubscribeCreator() {
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
            language: this.$i18n.locale,
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
    async updateWalletEmail() {
      logTrackerEvent(this, 'NFT', 'nft_portfolio_update_email', this.email, 1);

      this.isLoading = true;
      try {
        await this.walletUpdateEmail({
          email: this.email,
          followee: this.creatorWalletAddress,
        });
        this.alertPromptSuccess(
          this.$t('settings_email_changing_email_submitted')
        );
        this.email = '';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isLoading = false;
        this.shouldShowAlertDialog = true;
      }
    },
    async handleClickFollow() {
      this.isLoading = true;
      try {
        if (!this.isWalletLoggedIn) {
          try {
            await this.signLogin();
          } catch {
            // No-op
          }
          if (!this.isWalletLoggedIn) {
            return;
          }
        }
        if (this.isFollowed) {
          await this.walletUnfollowCreator(this.creatorWalletAddress);
          return;
        }
        if (this.walletHasVerifiedEmail) {
          this.walletFollowCreator(this.creatorWalletAddress);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async handleClickVerify() {
      this.shouldShowAlertDialog = true;
      try {
        this.isLoading = true;
        await this.walletUpdateEmail({
          email: this.walletEmailUnverified,
          followee: this.creatorWalletAddress,
        });
        this.alertPromptSuccess(
          this.$t('settings_email_changing_email_submitted')
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async handleClickResend() {
      logTrackerEvent(
        this,
        'NFT',
        'portfolio_email_resend_verification_email',
        this.loginAddress,
        1
      );
      try {
        this.isLoading = true;
        await this.walletUpdateEmail({
          email: this.walletEmailUnverified,
          followee: this.creatorWalletAddress,
        });
        this.alertPromptSuccess(
          this.$t('settings_email_changing_email_submitted')
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
