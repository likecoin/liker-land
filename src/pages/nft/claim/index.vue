<template>
  <div class="flex flex-col justify-center flex-grow">
    <AuthRequiredView
      class="flex flex-col relative w-full max-w-[962px] mx-auto mb-[48px]"
      :login-label="$t('nft_claim_login_in', { className })"
      :login-button-label="$t('nft_claim_login_in_button')"
    >
      <div
        v-if="!isLoading && !isClaimed"
        class="flex flex-col justify-center gap-[16px] mt-[16px]"
      >
        <Label :text="$t('nft_claim_claim', { className, wallet: getAddress })" align="center" />
        <ButtonV2 :text="$t('nft_claim_claim_button')" preset="secondary" @click="claim" />
      </div>
      <div v-else-if="isLoading">
        <Label :text="$t('nft_claim_claiming', { className })" align="center" />
        <ProgressIndicator class="self-center mt-[16px]" />
      </div>
      <div v-else-if="isClaimed">
        <Label :text="$t('nft_claim_claimed', { className })" align="center" />
        <ButtonV2 :text="$t('nft_claim_claimed_view_button')" preset="secondary" @click="handleClickView" />
      </div>
      <Label v-else-if="error" align="center">
        {{ $t('nft_claim_error_message', { error }) }}
      </Label>
      <Label v-else align="center">
        {{ $t('nft_claim_error_message_unknown') }}
      </Label>
      <div class="flex justify-center gap-[16px] mt-[16px]">
        <ButtonV2
          v-if="!isLoading && !isClaimed && error"
          :text="$t('nft_claim_claimed_retry_button')"
          preset="outline"
          @click="handleClickRetry"
        />
      </div>
    </AuthRequiredView>
  </div>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';
import { postStripeFiatClaim } from '~/util/api';

import alertMixin from '~/mixins/alert';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'NFTClaimPage',
  mixins: [alertMixin, walletMixin],
  data() {
    return {
      classId: '',
      nftId: '',
      isLoading: false,
      error: '',
    };
  },
  computed: {
    className() {
      return decodeURIComponent(this.$route.query.name);
    },
    paymentId() {
      return this.$route.query.id;
    },
    token() {
      return this.$route.query.token;
    },
    isClaimed() {
      return this.classId && this.nftId;
    },
  },
  methods: {
    async claim() {
      try {
        this.isLoading = true;
        if (!this.paymentId) {
          throw new Error('id is required');
        }
        if (!this.token) {
          throw new Error('token is required');
        }
        const { data } = await this.$api.post(
          postStripeFiatClaim({
            wallet: this.getAddress,
            paymentId: this.paymentId,
            token: this.token,
          })
        );
        this.classId = data.classId;
        this.nftId = data.nftId;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        this.alertPromptError(
          this.$t('settings_email_verify_error_message', {
            error: this.error,
          })
        );
      } finally {
        this.isLoading = false;
      }
    },
    handleClickView() {
      logTrackerEvent(this, 'NFT', 'nft_claim_view_button_clicked', '', 1);
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId-nftId',
          params: {
            classId: this.classId,
            nftId: this.nftId,
          },
        })
      );
    },
    handleClickRetry() {
      logTrackerEvent(this, 'NFT', 'nft_claim_retry_button_clicked', '', 1);
      this.claim();
    },
  },
};
</script>
