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
    >{{ $t('shopping_cart_title') }}</h1>

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
        <div class="col-start-1 col-end-8">{{ $t('shopping_cart_list_header_item') }}</div>
        <!--
        <div class="col-start-8 col-end-10 text-center">{{ $t('shopping_cart_list_header_price') }}</div>
        -->
        <div class="col-start-10 col-end-12 text-center">{{ $t('shopping_cart_list_header_price') }}</div>
        <!--
        <div class="col-start-10 col-end-12 text-center">{{ $t('shopping_cart_list_header_quantity') }}</div>
        -->
      </header>
      <ul
        :class="[
          'border-b',
          'border-b-gray-d8',
        ]"
      >
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
          <div class="col-start-2 sm:col-start-4 sm:col-span-1 text-gray-4a">{{ $t('shopping_cart_list_total_price') }}</div>
          <div class="col-span-4 sm:col-span-2 text-like-green font-proxima font-[600] leading-1 text-[2em]">{{ totalNFTPrice | formatNumberWithLIKE }}</div>
        </div>
      </footer>

      <div class="flex justify-end mt-[2em]">
        <div class="flex items-end gap-4">
          <EventModalCollectMethodButton
            :title="$t('shopping_cart_checkout_button_by_LIKE')"
            type="crypto"
            @click="handleClickCheckoutByLIKEButton"
          /> 
        </div>
      </div>
      <div class="flex justify-end mt-[1em]">
        <div class="flex items-end gap-4">
          <EventModalCollectMethodButton
            :title="$t('shopping_cart_checkout_button_by_card')"
            type="stripe"
            @click="handleClickCheckoutByFiatButton"
          /> 
        </div>
      </div>
      <i18n
        v-if="getAddress && isInsufficientAmount"
        :class="['mt-[1rem]', 'font-proxima', 'text-danger', 'text-right']"
        tag="div"
        path="shopping_cart_error_insufficient_balance"
      >
        <span class="font-[600]" place="balance">{{ walletLIKEBalance | formatNumberWithLIKE }}</span>
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
import { formatNumberWithLIKE } from '~/util/ui';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import walletLoginMixin from '~/mixins/wallet-login';

export default {
  name: 'ShoppingCartPage',
  filters: {
    formatNumberWithLIKE,
  },
  mixins: [nftMixin, walletMixin, walletLoginMixin],
  computed: {
    ...mapGetters([
      'getNFTClassPurchaseInfoById',
      'getNFTClassListingInfoById',
      'getNFTClassMetadataById',
      'LIKEPriceInUSD',
      'shoppingCartNFTClassList',
    ]),
    purchaseEventParams() {
      return {
        price: this.totalNFTPrice * this.LIKEPriceInUSD,
        currency: 'USD',
        items: [
          {
            classId: this.classIdList,
            price: this.classIdList
              .map(classId => this.getNFTClassPurchaseInfoById(classId)?.price)
              .map(p => p && p * this.LIKEPriceInUSD),
            name: this.classIdList.map(
              classId => this.getNFTClassMetadataById(classId)?.name
            ),
          },
        ],
      };
    },
    classIdList() {
      return this.shoppingCartNFTClassList
        .filter(
          item => this.getNFTClassPurchaseInfoById(item.classId)?.totalPrice > 0
        )
        .map(item => item.classId);
    },
    totalNFTPrice() {
      return this.shoppingCartNFTClassList.reduce((totalPrice, item) => {
        const purchaseInfo = this.getNFTClassPurchaseInfoById(item.classId);
        return totalPrice + (purchaseInfo?.price * item.quantity || 0);
      }, 0);
    },
    grantAmount() {
      return this.shoppingCartNFTClassList.reduce((totalPrice, item) => {
        const purchaseInfo = this.getNFTClassPurchaseInfoById(item.classId);
        return totalPrice + purchaseInfo?.totalPrice * item.quantity;
      }, 0);
    },
    isInsufficientAmount() {
      return (
        this.walletLIKEBalance && this.walletLIKEBalance < this.grantAmount
      );
    },
  },
  async mounted() {
    await this.lazyFetchLIKEPrice();
    logPurchaseFlowEvent(this, 'add_to_cart', this.purchaseEventParams);
  },
  methods: {
    ...mapActions([
      'clearShoppingCart',
      'removeNFTClassFromShoppingCart',
      'walletFetchLIKEBalance',
      'uiSetTxError',
      'uiSetTxStatus',
      'uiToggleCollectModal',
      'lazyFetchLIKEPrice',
    ]),
    handleClickRemoveButton(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'shopping_cart_remove_item',
        this.getAddress,
        1
      );
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
        if (!this.getAddress) {
          const isConnected = await this.connectWallet({
            shouldSkipLogin: true,
          });
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
          amountInLIKE: this.grantAmount,
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
  },
};
</script>
