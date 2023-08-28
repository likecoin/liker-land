<template>
  <main>
    <div class="w-full max-w-[400px] mx-auto p-[1rem] laptop:p-0 pt-0">
      <NFTWidgetBaseCard>
        <NuxtLink :to="localeLocation({ name: 'nft-class-classId', params: { classId } })" target="_blank">
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
    </div>

    <MobileStickyCard class="flex flex-col justify-center items-center w-full laptop:max-w-[400px] mx-auto py-[1.5rem]">
      <template v-if="!claimingAddress">
        <template v-if="walletIsLoggingIn">
          <ProgressIndicator />
          <Label
            class="text-medium-gray w-full mt-[4px]"
            preset="p6"
            align="center"
            :text="$t('auth_required_view_hint_label_loading')"
          />
        </template>
        <template v-else>
          <Label
            class="text-medium-gray"
            preset="p6"
            :text="$t('nft_claim_enter_address_label')"
            align="center"
          />
          <div class="flex justify-center w-full gap-[12px] mt-[6px]">
            <div class="flex w-full py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]">
              <input
                v-model="claimingAddressInput"
                class="w-full bg-transparent border-0 focus-visible:outline-none"
                :placeholder="$t('nft_claim_enter_address_placeholder')"
                type="input"
              >
            </div>
            <ButtonV2
              v-if="!claimingAddressInput"
              class="flex-shrink-0"
              :text="$t('settings_page_content_with_auth_login_button')"
              preset="secondary"
              @click="onClickLogin"
            />
          </div>
          <ButtonV2
            class="self-center mt-[24px]"
            :text="$t('nft_claim_claim')"
            preset="secondary"
            :is-disabled="!claimingAddressInput || !isValidAddress(claimingAddressInput)"
            @click="onEnterClaimingAddress"
          />
        </template>
      </template>
      <template v-else>
        <Label v-if="text" class="mb-[16px]" :text="text" align="center" />
        <template v-if="state === 'INITIAL'">
          <Label preset="p6" class="text-medium-gray mt-[12px] mb-[6px]" :text="$t('nft_collect_modal_leave_message')" />
          <div class="flex w-full py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]">
            <IconMessage class="text-dark-gray" />
            <input
              v-model="collectorMessage"
              class="w-full bg-transparent border-0 focus-visible:outline-none"
              :placeholder="$t('nft_collect_modal_leave_message_to_name', { name: creatorDisplayName })"
              type="input"
              @input.once="onInputCollectorMessage"
            >
          </div>
          <ButtonV2 class="self-center mt-[24px]" :text="$t('nft_claim_claim')" preset="secondary" @click="claim" />
        </template>
        <ProgressIndicator v-else-if="state === 'CLAIMING'" class="self-center" />
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
      </template>
    </MobileStickyCard>
  </main>
</template>

<script>
import {
  logTrackerEvent,
  logPurchaseFlowEvent,
  logPurchaseNFTBookEvent,
} from '~/util/EventLogger';
import {
  postStripeFiatPendingClaim,
  getNFTBookClaimEndpoint,
  getNFTBookPaymentStatusEndpoint,
} from '~/util/api';
import { isValidAddress } from '~/util/cosmos';

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
  data() {
    return {
      nftId: '',
      state: NFT_CLAIM_STATE.INITIAL,
      error: '',
      collectorMessage: '',
      claimingAddressInput: this.loginAddress || this.getAddress,
      claimingAddress: '',
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
        !this.claimingAddress ||
        [NFT_CLAIM_STATE.CLAIMING, NFT_CLAIM_STATE.CLAIMED].includes(this.state)
      );
    },
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.iscnOwner)?.displayName || 'creator'
      );
    },
  },
  watch: {
    getAddress() {
      this.claimingAddressInput = this.getAddress;
    },
    loginAddress() {
      this.claimingAddressInput = this.loginAddress;
      this.claimingAddress = this.loginAddress;
    },
  },
  async mounted() {
    const { redirect, ...query } = this.$route.query;
    if (redirect && query.type === 'nft_book') {
      let price;
      try {
        const { data } = await this.$api.get(
          getNFTBookPaymentStatusEndpoint({
            classId: this.classId,
            paymentId: this.paymentId,
          })
        );
        ({ price } = data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      logPurchaseFlowEvent(this, 'purchase', {
        items: [
          {
            name: this.NFTName,
            classId: this.classId,
            price,
          },
        ],
        price,
        currency: 'USD',
        isNFTBook: true,
      });
      logPurchaseNFTBookEvent(this, {
        name: this.NFTName,
        currency: 'USD',
        classId: this.classId,
        price,
      });
      this.$router.replace({
        ...this.$route,
        query,
      });
    }
  },
  methods: {
    isValidAddress,
    onEnterClaimingAddress() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_nft_book_on_address_entered',
        this.classId
      );
      this.claimingAddress = this.claimingAddressInput;
    },
    async onClickLogin() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_nft_book_on_login_clicked',
        this.classId
      );
      await this.connectWallet();
    },
    async claim() {
      if (this.shouldBlockClaim) {
        return;
      }

      logTrackerEvent(this, 'NFT', 'nft_claim_claim_button_clicked', '', 1);

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
            wallet: this.claimingAddress,
            paymentId: this.paymentId,
            token: this.token,
          })
        );
        const { data } = await this.claimPromise;
        this.claimPromise = undefined;
        this.nftId = data.nftId;
        this.state = NFT_CLAIM_STATE.CLAIMED;
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_fiat_purchase_claimed',
          this.classId
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_fiat_purchase_claim_error',
          this.classId
        );
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
            wallet: this.claimingAddress,
            message: this.collectorMessage,
          }
        );
        await this.claimPromise;
        this.claimPromise = undefined;
        this.state = NFT_CLAIM_STATE.CLAIMED;
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_nft_book_claimed',
          this.classId
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_nft_book_claim_error',
          this.classId
        );
        this.alertPromptError(
          this.$t('settings_email_verify_error_message', {
            error: this.error,
          })
        );
        this.state = NFT_CLAIM_STATE.ERROR;
      }
    },
    onInputCollectorMessage() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_collector_message_input',
        this.classId
      );
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
