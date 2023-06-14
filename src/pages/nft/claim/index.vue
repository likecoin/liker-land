<template>
  <div class="flex flex-col justify-center flex-grow">
    <AuthRequiredView
      class="relative flex flex-col justify-center items-center w-full max-w-[962px] mx-auto mb-[48px]"
      :login-label="$t('nft_claim_login_in')"
      :login-button-label="$t('nft_claim_login_in_button')"
      @login="claim"
    >
      <template #prepend>
        <NFTWidgetBaseCard class="flex justify-center items-center max-w-[400px] mb-[16px]">
          <NuxtLink
            :to="localeLocation({ name: 'nft-class-classId', params: { classId } })"
            target="_blank"
          >
            <NFTWidgetContentPreview
              :class="[
                'transition-shadow',
                'cursor-pointer',
                'min-h-[300px]',
                'w-full',
              ]"
              :title="NFTName"
              :description="NFTDescription"
              :img-src="NFTImageUrl"
              @click="handleClickViewDetails"
            />
          </NuxtLink>
        </NFTWidgetBaseCard>
      </template>
      <Label class="mb-[16px]" :text="text" align="center" />
      <ProgressIndicator v-if="state === 'CLAIMING'" class="self-center" />
      <template v-else-if="state === 'CLAIMED'">
        <ButtonV2
          v-if="nftId"
          :text="$t('nft_claim_claimed_view_button')"
          preset="tertiary"
          @click="handleClickView"
        />
        <ButtonV2
          v-else
          :text="$t('nft_claim_claimed_view_class_button')"
          preset="tertiary"
          @click="handleClickViewClass"
        />
      </template>

      <ButtonV2
        v-else-if="state === 'ERROR'"
        :text="$t('nft_claim_claimed_retry_button')"
        preset="outline"
        @click="handleClickRetry"
      />
    </AuthRequiredView>
  </div>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';
import {
  postStripeFiatPendingClaim,
  getNFTBookClaimEndpoint,
} from '~/util/api';

import alertMixin from '~/mixins/alert';
import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

const NFT_CLAIM_STATE = {
  INITIAL: 'INITIAL',
  CLAIMING: 'CLAIMING',
  CLAIMED: 'CLAIMED',
  ERROR: 'ERROR',
};

export default {
  name: 'NFTClaimPage',
  mixins: [alertMixin, nftMixin, walletMixin],
  data() {
    return {
      nftId: '',
      state: NFT_CLAIM_STATE.INITIAL,
      error: '',
    };
  },
  computed: {
    classId() {
      return this.$route.query.class_id;
    },
    paymentId() {
      return this.$route.query.payment_id;
    },
    token() {
      return this.$route.query.claiming_token;
    },
    isNFTBook() {
      return this.$route.query.type === 'nft_book';
    },
    text() {
      switch (this.state) {
        case NFT_CLAIM_STATE.CLAIMING:
          return this.$t('nft_claim_claiming');
        case NFT_CLAIM_STATE.CLAIMED:
          if (this.isNFTBook && !this.nftId) {
            return this.$t('nft_claim_claimed_nft_book');
          }
          return this.$t('nft_claim_claimed');
        case NFT_CLAIM_STATE.ERROR:
          return this.error
            ? this.$t('nft_claim_error_message', { error: this.error })
            : this.$t('nft_claim_error_message_unknown');
        default:
          return '';
      }
    },
    shouldBlockClaim() {
      return (
        !this.loginAddress ||
        [NFT_CLAIM_STATE.CLAIMING, NFT_CLAIM_STATE.CLAIMED].includes(this.state)
      );
    },
  },
  async asyncData({ query, store, error, i18n }) {
    const {
      class_id: classId,
      payment_id: paymentId,
      claiming_token: token,
    } = query;
    if (!classId || !token || !paymentId) {
      error({ statusCode: 400, message: i18n.t('nft_claim_missing_qs') });
      return;
    }
    try {
      await store.dispatch('lazyGetNFTClassMetadata', classId);
    } catch (err) {
      error({ statusCode: 404, message: i18n.t('nft_claim_class_not_found') });
    }
  },
  mounted() {
    if (this.loginAddress) {
      this.claim();
    }
  },
  methods: {
    async claim() {
      if (this.shouldBlockClaim) {
        return;
      }

      if (this.isNFTBook) {
        await this.claimNFTBookPurchase();
      } else {
        await this.claimFiatPurchase();
      }
    },
    async claimFiatPurchase() {
      try {
        if (this.claimPromise) return;
        this.state = NFT_CLAIM_STATE.CLAIMING;
        this.claimPromise = this.$api.post(
          postStripeFiatPendingClaim({
            wallet: this.loginAddress,
            paymentId: this.paymentId,
            token: this.token,
          })
        );
        const { data } = await this.claimPromise;
        this.claimPromise = undefined;
        this.nftId = data.nftId;
        this.state = NFT_CLAIM_STATE.CLAIMED;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        this.alertPromptError(
          this.$t('settings_email_verify_error_message', {
            error: this.error,
          })
        );
        this.state = NFT_CLAIM_STATE.ERROR;
      }
    },
    async claimNFTBookPurchase() {
      try {
        if (this.claimPromise) return;
        this.state = NFT_CLAIM_STATE.CLAIMING;
        this.claimPromise = this.$api.post(
          getNFTBookClaimEndpoint({
            classId: this.classId,
            paymentId: this.paymentId,
            token: this.token,
          }),
          {
            paymentId: this.paymentId,
            wallet: this.loginAddress,
          }
        );
        await this.claimPromise;
        this.claimPromise = undefined;
        this.state = NFT_CLAIM_STATE.CLAIMED;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        this.alertPromptError(
          this.$t('settings_email_verify_error_message', {
            error: this.error,
          })
        );
        this.state = NFT_CLAIM_STATE.ERROR;
      }
    },
    handleClickViewDetails() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_view_details_clicked',
        this.classId,
        1
      );
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
    handleClickViewClass() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_view_class_button_clicked',
        '',
        1
      );
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId',
          params: {
            classId: this.classId,
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
