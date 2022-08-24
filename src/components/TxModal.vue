<template>
  <Dialog
    :open="isOpen"
    :has-close-button="hasCloseButton"
    :header-text="headerText"
    panel-class="shadow-lg bg-white phone:min-w-[380px] w-[520px] w-full p-[48px] rounded-[24px]"
    :is-disabled-backdrop-click="true"
    @close="$emit('close')"
  >
    <template #header-prepend>
      <slot name="header-prepend" />
    </template>

    <div v-if="!showConfirm || uiTxNFTStatus === 'processing'">
      <!-- Main -->

      <slot name="default" />

      <!-- Message -->
      <div
        v-if="!uiTxErrorMessage"
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
            v-if="uiTxErrorMessage === 'INSUFFICIENT_BALANCE'"
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
      <div class="flex flex-col items-center justify-center w-full mt-[34px]">
        <ProgressIndicator
          v-if="uiTxNFTStatus === 'sign' || uiTxNFTStatus === 'processing'"
          class="mb-[24px]"
        />
        <ButtonV2
          v-if="uiTxNFTStatus !== 'processing' && buttonText"
          :preset="getButtonState.preset"
          :is-disabled="getButtonState.isDisable"
          @click="onClick"
        >
          {{ buttonText }}
        </ButtonV2>
      </div>

      <!-- Attention -->
      <div
        v-if="uiTxNFTStatus === 'sign' && attentionText"
        class="mt-[48px] border-0 border-dashed border-t-[2px] border-t-shade-gray"
      >
        <AttentionSign :attention-text="attentionText">
          <template #icon>
            <IconLedger v-if="walletMethodType === 'keplr'" />
            <IconLikerLandApp v-if="walletMethodType === 'liker-id'" :class="['w-[32px]', 'h-[32px]']" />
          </template>
        </AttentionSign>
      </div>
    </div>

    <!-- Confirm -->
    <div v-else>
      <div
        v-t="'tx_modal_quitAlert_content'"
        class="max-w-[336px] text-center text-medium-gray text-[16px] font-500 mx-auto"
      />
      <div class="mx-auto mt-[24px] grid grid-flow-col gap-x-[12px] text-center">
        <ButtonV2
          preset="outline"
          class="text-danger border-danger"
          :text="$t('tx_modal_quitAlert_confirm')"
          @click="$emit('close');showConfirm = false"
        >
          <template #prepend>
            <IconBin class="w-[20px]" />
          </template>
        </ButtonV2>
        <ButtonV2
          preset="outline"
          :text="$t('tx_modal_quitAlert_continue')"
          @click="showConfirm = false"
        />
      </div>
    </div>

  </Dialog>
</template>

<script>
import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';
import { mapGetters } from 'vuex';

export default {
  mixins: [nftMixin, walletMixin, alertMixin],
  props: {
    // Dialog
    isOpen: {
      type: Boolean,
      default: false,
    },
    hasCloseButton: {
      type: Boolean,
      default: true,
    },
    headerText: {
      type: String,
      default: undefined,
    },
    completeText: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return { showConfirm: false };
  },
  computed: {
    ...mapGetters([
      'uiTxNFTStatus',
      'uiTxErrorMessage',
      'uiCollectOwnedCount',
      'walletMethodType',
    ]),
    formattedErrorMessage() {
      switch (this.uiTxErrorMessage) {
        case 'INSUFFICIENT_BALANCE':
          return this.$t('snackbar_error_insufficient');

        default:
          return this.uiTxErrorMessage;
      }
    },
    formattedStatusTitle() {
      switch (this.uiTxNFTStatus) {
        case 'sign':
          switch (this.walletMethodType) {
            case 'keplr':
              return this.$t('tx_modal_status_sign_title_keplr');

            case 'keplr-mobile':
              return this.$t('tx_modal_status_sign_title_keplrMobile');

            case 'cosmostation':
              return this.$t('tx_modal_status_sign_title_cosmostation');

            case 'liker-id':
              return this.$t('tx_modal_status_sign_title_likerId');

            default:
              return undefined;
          }
        case 'processing':
          return this.$t('tx_modal_status_processing_title');
        case 'completed':
          return this.$t('tx_modal_status_complete_title');
        default:
          return undefined;
      }
    },
    formattedStatusText() {
      switch (this.uiTxNFTStatus) {
        case 'sign':
          return this.$t('tx_modal_status_sign_text');
        case 'processing':
          return this.$t('tx_modal_status_processing_text');

        case 'completed':
          return this.completeText;
        default:
          return undefined;
      }
    },
    attentionText() {
      switch (this.walletMethodType) {
        case 'keplr':
          return this.$t('attention_ledger_not_support');

        case 'keplr-mobile':
          return this.$t('attention_keplrMobile_openApp');

        case 'liker-id':
          return this.$t('attention_likerland_openApp');

        case 'cosmostation':
        default:
          return undefined;
      }
    },
    buttonText() {
      switch (this.uiTxNFTStatus) {
        case 'sign':
          return this.$t('tx_modal_button_cancel');

        case 'completed':
          return this.$t('tx_modal_button_ok');

        case 'insufficient':
        case 'failed':
          return this.$t('tx_modal_button_Close');
        default:
          return undefined;
      }
    },
    getButtonState() {
      return {
        preset: this.uiTxNFTStatus === 'sign' ? 'tertiary' : 'outline',
        text: this.buttonText,
      };
    },
  },
  methods: {
    onClick() {
      switch (this.uiTxNFTStatus) {
        case 'sign':
          this.showConfirm = true;
          break;
        case 'insufficient':
        case 'failed':
        case 'completed':
        default:
          this.$emit('close');
          this.showConfirm = false;
          break;
      }
    },
  },
};
</script>
