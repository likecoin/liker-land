<template>
  <Page
    :class="[
      'w-full',
      'max-w-[960px]',
      'mx-auto',
      'px-[.75em] laptop:px-[2em]',
      'pb-[8em]',
      'text-[0.75em] sm:text-[1em]',
    ]"
  >
    <h1
      :class="[
        'w-full',
        'mb-[0.5em]',
        'text-[#3AB7A2]',
        'text-[1.5rem] sm:text-[3rem]',
        'text-left',
        'font-proxima',
        'font-[600]',
      ]"
    >
      {{ $t('shopping_cart_title') }}
    </h1>

    <CardV2
      v-if="shoppingCartNFTClassList.length"
      class="w-full laptop:px-[2em]"
    >
      <header
        :class="[
          'grid',
          'grid-cols-12',
          'gap-[1em]',
          'pl-[1em]',
          'p-[0.5em]',
          'border-b-gray-d8',
          'border-b',
          'text-gray-9b',
        ]"
      >
        <div class="col-start-1 col-end-8">
          {{ $t('shopping_cart_list_header_item') }}
        </div>
        <!--
        <div class="col-start-8 col-end-10 text-center">{{ $t('shopping_cart_list_header_price') }}</div>
        -->
        <div class="col-start-10 col-end-12 text-center">
          {{ $t('shopping_cart_list_header_price') }}
        </div>
        <!--
        <div class="col-start-10 col-end-12 text-center">{{ $t('shopping_cart_list_header_quantity') }}</div>
        -->
      </header>
      <ul :class="['border-b', 'border-b-gray-d8']">
        <li
          v-for="(item, index) in shoppingCartNFTClassList"
          :key="item.classId"
        >
          <ShoppingCartListRow
            :index="index + 1"
            :class-id="item.classId"
            :quantity="item.quantity"
            @remove="handleClickRemoveButton"
          />
        </li>
      </ul>
      <footer class="mt-[1em] text-right">
        <div class="grid grid-cols-6 items-center gap-[1em]">
          <div class="col-start-2 sm:col-start-4 sm:col-span-1 text-gray-4a">
            {{ $t('shopping_cart_list_total_price') }}
          </div>
          <div
            class="col-span-4 sm:col-span-2 text-like-green font-proxima font-[600] leading-1 text-[2em]"
          >
            {{ totalNFTPriceInUSD | formatNumberWithUSD }}
          </div>
        </div>
      </footer>

      <div class="flex justify-end mt-[2em]">
        <div class="flex items-end gap-4">
          <EventModalCollectMethodButton
            :title="$t('shopping_cart_checkout_button_by_card')"
            type="stripe"
            :price="formattedFiatPrice"
            @click="handleClickCheckoutByFiatButton"
          />
        </div>
      </div>
      <div class="flex justify-end mt-[1em]">
        <div class="flex items-end gap-4">
          <EventModalCollectMethodButton
            :title="$t('shopping_cart_checkout_button_by_LIKE')"
            type="crypto"
            :price="LIKEPrice | formatNumberWithLIKE"
            :is-disabled="isInsufficientAmount"
            @click="handleClickCheckoutByLIKEButton"
          />
        </div>
      </div>
      <i18n
        v-if="getAddress && isInsufficientAmount"
        :class="['mt-[1rem]', 'font-proxima', 'text-danger', 'text-right']"
        tag="div"
        path="shopping_cart_error_insufficient_balance"
      >
        <span class="font-[600]" place="balance">{{
          walletLIKEBalance | formatNumberWithLIKE
        }}</span>
      </i18n>
    </CardV2>

    <CardV2
      v-else
      :class="[
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'w-full',
        'min-h-[20vh]',
      ]"
    >
      <div>{{ $t('shopping_cart_empty_notice') }}</div>
      <ButtonV2
        class="mt-[2em]"
        preset="secondary"
        :text="$t('shopping_cart_empty_notice_button')"
        :to="localeLocation({ name: 'store' })"
        @click="handleClickEmptyNoticeButton"
      />
    </CardV2>
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { TX_STATUS } from '~/constant';

import { postNFTPurchase } from '~/util/api';
import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { signGrant, broadcastTx, NFT_TYPE_FILTER_OPTIONS } from '~/util/nft';
import { formatNumberWithLIKE, formatNumberWithUSD } from '~/util/ui';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import walletLoginMixin from '~/mixins/wallet-login';

export default {
  name: 'ShoppingCartPage',
  filters: {
    formatNumberWithLIKE,
    formatNumberWithUSD,
  },
  mixins: [nftMixin, walletMixin, walletLoginMixin],
  data() {
    return {
      LIKEPrice: 0,
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassPurchaseInfoById',
      'getNFTClassListingInfoById',
      'getNFTClassMetadataById',
      'shoppingCartNFTClassList',
    ]),
    purchaseEventParams() {
      return {
        price: this.totalNFTPriceInUSD,
        currency: 'USD',
        items: [
          {
            classId: this.classIdList,
            price: this.classIdList.map(
              classId => this.getNFTClassPurchaseInfoById(classId)?.price
            ),
            name: this.classIdList.map(
              classId => this.getNFTClassMetadataById(classId)?.name
            ),
          },
        ],
      };
    },
    classIdList() {
      return this.shoppingCartNFTClassList.map(item => item.classId);
    },
    totalNFTPriceInUSD() {
      return this.shoppingCartNFTClassList.reduce((totalPrice, item) => {
        const purchaseInfo = this.getNFTClassPurchaseInfoById(item.classId);
        return totalPrice + (purchaseInfo?.price * item.quantity || 0);
      }, 0);
    },
    formattedFiatPrice() {
      return formatNumberWithUSD(this.totalNFTPriceInUSD);
    },
    isInsufficientAmount() {
      return this.walletLIKEBalance && this.walletLIKEBalance < this.LIKEPrice;
    },
  },
  watch: {
    classIdList() {
      this.updateLIKEPrice();
    },
  },
  mounted() {
    this.updateLIKEPrice();
    logPurchaseFlowEvent(this, 'add_to_cart', this.purchaseEventParams);
    logPurchaseFlowEvent(this, 'view_cart', this.purchaseEventParams);
  },
  methods: {
    ...mapActions([
      'clearShoppingCart',
      'removeNFTClassFromShoppingCart',
      'walletFetchLIKEBalance',
      'fetchNFTPaymentPriceInfoByClassId',
      'uiSetTxError',
      'uiSetTxStatus',
      'uiToggleCollectModal',
    ]),
    handleClickRemoveButton(item) {
      const { classId } = item;
      logPurchaseFlowEvent(this, 'remove_from_cart', {
        items: [item],
        price: item.price * item.quantity,
        currency: 'USD',
      });
      this.removeNFTClassFromShoppingCart({ classId });
    },
    async handleClickCheckoutByLIKEButton() {
      logTrackerEvent(
        this,
        'NFT',
        'shopping_cart_click_checkout_button',
        this.getAddress,
        1
      );
      try {
        if (!this.getSessionWallet) {
          const isConnected = await this.connectWallet();
          if (!isConnected) return;
        } else {
          await this.initIfNecessary();
        }

        logPurchaseFlowEvent(
          this,
          'add_shipping_info',
          this.purchaseEventParams
        );
        await this.walletFetchLIKEBalance();
        if (this.isInsufficientAmount) {
          this.uiToggleCollectModal({
            classId: this.classIdList,
            status: TX_STATUS.INSUFFICIENT,
          });
          this.uiSetTxError('INSUFFICIENT_BALANCE');
          return;
        }

        this.uiToggleCollectModal({
          classId: this.classIdList,
          status: TX_STATUS.SIGN,
        });
        logPurchaseFlowEvent(this, 'begin_checkout', this.purchaseEventParams);

        const signData = await signGrant({
          senderAddress: this.getAddress,
          amountInLIKE: this.LIKEPrice,
          signer: this.getSigner,
        });

        this.uiSetTxStatus(TX_STATUS.PROCESSING);

        const { txHash, code } = await broadcastTx(signData, this.getSigner);
        if (code !== 0) {
          throw new Error(`TX_FAILED_WITH_CODE_${code}`);
        }
        if (!txHash) {
          throw new Error('TX_FAILED_WITHOUT_TX_HASH');
        }

        await this.$api.post(
          postNFTPurchase({
            wallet: this.getAddress,
            txHash,
            classId: this.classIdList,
            ts: Date.now(),
          })
        );
        logPurchaseFlowEvent(this, 'purchase', this.purchaseEventParams);
        this.$router.replace(
          this.localeLocation({
            name: 'id',
            params: { id: this.getAddress },
            // NOTE: Filter Writing NFTs for users to see the NFTs they just purchased
            query: { type: NFT_TYPE_FILTER_OPTIONS.WRITING_NFT },
          })
        );
        this.clearShoppingCart();
        this.uiSetTxStatus(TX_STATUS.COMPLETED);
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      } finally {
        this.walletFetchLIKEBalance();
      }
    },
    async handleClickCheckoutByFiatButton() {
      try {
        logTrackerEvent(
          this,
          'NFT',
          'NFTCollectPaymentMethod(Stripe)',
          this.classIdList,
          1
        );
        logPurchaseFlowEvent(this, 'begin_checkout', this.purchaseEventParams);
        await this.collectNFTWithStripe(this.classIdList);
      } catch (error) {
        this.uiSetTxError(error.response?.data || error.toString());
        this.uiSetTxStatus(TX_STATUS.FAILED);
      }
    },
    handleClickEmptyNoticeButton() {
      logTrackerEvent(
        this,
        'NFT',
        'shopping_cart_click_empty_notice_button',
        this.getAddress,
        1
      );
    },
    async updateLIKEPrice() {
      const { LIKEPrice } = await this.fetchNFTPaymentPriceInfoByClassId(
        this.classIdList
      );
      this.LIKEPrice = LIKEPrice;
    },
  },
};
</script>
