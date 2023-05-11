<template>
  <div class="flex flex-col justify-center flex-grow">
    <AuthRequiredView
      class="relative flex flex-col justify-center items-center w-full max-w-[962px] mx-auto mb-[48px]"
      :login-label="$t('nft_claim_login_in')"
      :login-button-label="$t('nft_claim_login_in_button')"
    >
      <NFTWidgetBaseCard class="flex justify-center items-center max-w-[400px]">
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
      <Label class="my-[16px]" :text="text" align="center" />
      <ProgressIndicator v-if="state === 'CLAIMING'" class="self-center" />
      <ButtonV2 
        v-else-if="state === 'CLAIMED'"
        :text="$t('nft_claim_claimed_view_button')" 
        preset="secondary" 
        @click="handleClickView"
      />
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
import { postStripeFiatClaim } from '~/util/api';

import alertMixin from '~/mixins/alert';
import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

const NFT_CLAIM_STATE = {
  MISSING_QS: 'MISSING_QS',
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
      state: NFT_CLAIM_STATE.CLAIMING,
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
    text() {
      switch (this.state) {
        case NFT_CLAIM_STATE.MISSING_QS:
          return this.$t('nft_claim_missing_qs');
        case NFT_CLAIM_STATE.CLAIMING:
          return this.$t('nft_claim_claiming');
        case NFT_CLAIM_STATE.CLAIMED:
          return this.$t('nft_claim_claimed');
        case NFT_CLAIM_STATE.ERROR:
          return this.error
            ? this.$t('nft_claim_error_message', { error: this.error })
            : this.$t('nft_claim_error_message_unknown');
        default:
          return '';
      }
    },
  },
  async asyncData({ query, store, error }) {
    try {
      const { class_id: classId } = query;
      await store.dispatch('lazyGetNFTClassMetadata', classId);
    } catch (err) {
      error({ statusCode: 404, message: 'NFT Class Not Found' });
    }
  },
  mounted() {
    if (!this.classId || !this.token || !this.paymentId) {
      this.state = NFT_CLAIM_STATE.MISSING_QS;
      return;
    }
    this.claim();
  },
  methods: {
    async claim() {
      try {
        const { data } = await this.$api.post(
          postStripeFiatClaim({
            wallet: this.getAddress,
            paymentId: this.paymentId,
            token: this.token,
          })
        );
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
    handleClickRetry() {
      logTrackerEvent(this, 'NFT', 'nft_claim_retry_button_clicked', '', 1);
      this.claim();
    },
  },
};
</script>
