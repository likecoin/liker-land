<template>
  <Dialog
    :open="uiIsOpenCollectModal"
    :has-close-button="false"
    :header-text="$t('nft_details_page_title_collect')"
    panel-class="shadow-lg bg-white phone:min-w-[380px] min-w-[520px] w-full p-[48px] rounded-[24px]"
    :is-disabled-backdrop-click="true"
    @close="handleClickCloseButton"
  >
    <template #header-prepend>
      <IconPrice />
    </template>

    <!-- Owned Count -->
    <div
      :class="[
        'flex',
        'justify-center',
        'items-center',
        'w-full',
        'py-[16px]',
        'my-[34px]',
        'border-[2px]',
        'border-shade-gray',
        {'border-like-cyan-darker': uiCollectNFTStatus === 'completed'},
        'rounded-[16px]',
      ]"
    >
      <Label
        preset="h5"
        :text="$t('nft_details_page_label_owning')"
        class="text-like-green font-600"
      >
        <template #prepend>
          <IconCreativeWork />
        </template>
        <template #default>
          <div class="flex items-center">
            <Label preset="h5" :text="$t('nft_details_page_label_owning')" />
            <Label
              preset="h4"
              :text="uiCollectOwnedCount.toString() || '-'"
              class="font-[900] ml-[20px]"
            />
          </div>
        </template>
      </Label>
    </div>

    <!-- Message -->
    <div
      v-if="!uiCollectErrorMessage"
      class="flex flex-col items-center justify-center mb-[12px]"
    >
      <Label
        class="text-like-green font-600"
        preset="h4"
        :text="formattedStatusTitle"
      />
      <Label
        class="text-medium-gray mt-[12px]"
        preset="h6"
        :text="formattedStatusText"
      />
    </div>

    <div v-else class="flex items-center justify-center mb-[12px] text-danger">
      <Label class="text-danger" :text="formattedErrorMessage" preset="p6">
        <template #prepend>
          <IconError />
        </template>
        <template
          v-if="uiCollectErrorMessage === 'INSUFFICIENT_BALANCE'"
          #append
        >
          <LinkV2
            class="text-danger"
            href="https://docs.like.co/general-guides/trade"
          >
            {{ $t('snackbar_error_buyLIKE') }}
          </LinkV2>
        </template>
      </Label>
    </div>

    <!-- Button -->
    <div class="flex items-center justify-center w-full mt-[34px]">
      <ButtonV2
        v-if="uiCollectNFTStatus !== 'processing'"
        :preset="getButtonState.preset"
        :is-disabled="getButtonState.isDisable"
        @click="onClick"
      >
        {{ getButtonText }}
      </ButtonV2>
      <ProgressIndicator v-else />
    </div>

    <!-- Attention -->
    <div
      v-if="uiCollectNFTStatus === 'sign'"
      class="mt-[48px] border-0 border-dashed border-t-[2px] border-t-shade-gray"
    >
      <AttentionsLedger v-if="walletMethodType === 'keplr'" />
      <AttentionsOpenLikerLandApp v-if="walletMethodType === 'liker-id'" />
    </div>
  </Dialog>
</template>

<script>
import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';
import { mapActions, mapGetters } from 'vuex';

export default {
  mixins: [nftMixin, walletMixin, alertMixin],
  data() {
    return {
      showConfirm: false,
      isOpenKeplr: false,
    };
  },
  computed: {
    ...mapGetters([
      'uiIsOpenCollectModal',
      'uiCollectNFTStatus',
      'uiCollectErrorMessage',
      'uiCollectOwnedCount',
      'walletMethodType',
    ]),
    formattedErrorMessage() {
      switch (this.uiCollectErrorMessage) {
        case 'INSUFFICIENT_BALANCE':
          return this.$t('snackbar_error_insufficient');

        default:
          return this.uiCollectErrorMessage;
      }
    },
    formattedStatusTitle() {
      switch (this.uiCollectNFTStatus) {
        case 'sign':
        case 'processing':
          switch (this.walletMethodType) {
            case 'keplr':
              return 'Waiting for signature on your Keplr wallet ...';

            case 'keplr-mobile':
              return 'Waiting for signature on your keplr-mobile wallet ...';

            case 'cosmostation':
              return 'Waiting for signature on your cosmostation wallet ...';

            case 'liker-id':
              return 'Waiting for signature on your Liker Land App ...';

            default:
              return 'Waiting for signature on your Keplr wallet ...';
          }
        case 'completed':
          return 'Complete!';
        default:
          return '';
      }
    },
    formattedStatusText() {
      switch (this.uiCollectNFTStatus) {
        case 'processing':
          return 'Transaction broadcasted. There is no need to send another until it has been complete.';

        case 'completed':
          return 'Congratulations! you collected this Writing NFT';
        case 'sign':
        default:
          return '';
      }
    },
    getButtonText() {
      switch (this.uiCollectNFTStatus) {
        case 'sign':
          switch (this.walletMethodType) {
            case 'keplr':
              return 'Opening Keplr ...';

            case 'keplr-mobile':
              return 'Opening Keplr-mobile ...';

            case 'cosmostation':
              return 'Opening cosmostation ...';

            case 'liker-id':
              return 'Opening Liker Land APP ...';

            default:
              return 'Opening Keplr ...';
          }

        case 'completed':
          return 'OK';

        case 'insufficient':
        case 'failed':
        default:
          return 'CLOSE';
      }
    },
    getButtonState() {
      return {
        preset: this.uiCollectNFTStatus === 'sign' ? 'tertiary' : 'outline',
        text: this.getButtonText,
        isDisable: this.uiCollectNFTStatus === 'sign',
      };
    },
  },
  methods: {
    ...mapActions(['uiCloseCollectModal']),
    handleClickCloseButton() {
      this.uiCloseCollectModal();
    },
    onClick() {
      switch (this.uiCollectNFTStatus) {
        case 'insufficient':
        case 'failed':
        case 'completed':
        default:
          this.uiCloseCollectModal();
          break;
      }
    },
    retry() {
      this.collectNFT();
    },
  },
};
</script>
