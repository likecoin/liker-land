<template>
  <Dialog
    :open="isOpen"
    :has-close-button="hasCloseButton"
    :header-text="headerText"
    panel-container-class="phone:max-w-[520px] laptop:w-[520px]"
    panel-class="shadow-lg bg-white w-full p-[48px] phone:px-[18px] rounded-[24px]"
    :is-disabled-backdrop-click="true"
    @close="$emit('close')"
  >
    <template #header-prepend>
      <slot name="header-prepend" />
    </template>

    <slot name="top" />

    <template v-if="!isShowQuitConfirm || ['processing', 'completed'].includes(uiTxNFTStatus)">
      <!-- Title & Message -->
      <div
        v-if="formattedStatusTitle || formattedStatusText || $slots.title || $slots.message"
        class="flex flex-col items-center justify-center"
      >
        <slot v-if="$slots.title" name="title" />
        <Label
          v-else-if="formattedStatusTitle"
          class="text-like-green font-600"
          preset="h4"
          align="center"
          :text="formattedStatusTitle"
        />
        <slot v-if="$slots.message" name="message" />
        <Label
          v-else-if="formattedStatusText"
          class="text-medium-gray mt-[12px]"
          preset="h6"
          align="center"
          :text="formattedStatusText"
        />
      </div>

      <slot name="default" />

      <ProgressIndicator
        v-if="['sign', 'processing'].includes(uiTxNFTStatus)"
        class="mt-[32px] mx-auto"
      />

      <!-- Button -->
      <div
        v-if="buttonText || $slots.button"
        class="flex items-center justify-center w-full mt-[24px]"
      >
        <slot v-if="$slots.button" name="button" />
        <ButtonV2
          v-else
          :preset="getButtonState.preset"
          :is-disabled="getButtonState.isDisable"
          @click="onClick"
        >
          {{ buttonText }}
        </ButtonV2>
      </div>

      <div
        v-if="formattedErrorMessage"
        class="flex items-center justify-center my-[12px] text-danger"
      >
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

      <!-- Attention -->
      <div
        v-if="uiTxNFTStatus === 'sign' && attentionText"
        class="mt-[48px] border-0 border-dashed border-t-[2px] border-t-shade-gray"
      >
        <AttentionSign
          class="pb-0"
          :attention-text="attentionText"
        >
          <template #icon>
            <IconLedger v-if="walletMethodType === 'keplr'" />
            <IconLikerLandApp v-if="walletMethodType === 'liker-id'" />
            <IconKeplrMobile v-if="walletMethodType === 'keplr-mobile'" />
          </template>
        </AttentionSign>
      </div>
    </template>

    <!-- Quit Confirm -->
    <template v-else>
      <div
        v-t="'tx_modal_quitAlert_content'"
        class="max-w-[336px] text-center text-medium-gray text-[16px] font-500 mx-auto"
      />
      <div class="mx-auto mt-[24px] grid grid-flow-col gap-x-[12px] text-center">
        <ButtonV2
          preset="outline"
          class="text-danger border-danger"
          :text="$t('tx_modal_quitAlert_confirm')"
          @click="handleCancel"
        >
          <template #prepend>
            <IconBin class="w-[20px]" />
          </template>
        </ButtonV2>
        <ButtonV2
          preset="outline"
          :text="$t('tx_modal_quitAlert_continue')"
          @click="handleContinue"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import { mapGetters } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

import alertMixin from '~/mixins/alert';
import nftMixin from '~/mixins/nft';

export default {
  mixins: [alertMixin, nftMixin],
  props: {
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
    // Preset of modal, option: collect and transfer
    preset: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return { isShowQuitConfirm: false };
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
          if (
            this.walletMethodType === 'keplr' ||
            this.walletMethodType === 'cosmostation'
          ) {
            return this.$t('tx_modal_status_sign_text');
          }
          return undefined;

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

        case 'insufficient':
        case 'failed':
          return this.$t('tx_modal_button_Close');

        case 'completed':
          if (this.preset === 'collect' && this.$slots.button) {
            return undefined;
          }
          return this.$t('tx_modal_button_ok');

        case 'processing':
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
          logTrackerEvent(this, 'NFT', 'ShowCancelModal', this.classId, 1);
          this.isShowQuitConfirm = true;
          break;
        case 'insufficient':
        case 'failed':
        case 'completed':
        default:
          logTrackerEvent(this, 'NFT', 'ClickModalClose', this.classId, 1);
          this.$emit('close');
          this.isShowQuitConfirm = false;
          break;
      }
    },
    handleContinue() {
      logTrackerEvent(this, 'NFT', 'ClickContinue', this.classId, 1);
      this.isShowQuitConfirm = false;
    },
    handleCancel() {
      logTrackerEvent(this, 'NFT', 'Cancel', this.classId, 1);
      this.$emit('close');
      this.isShowQuitConfirm = false;
    },
  },
};
</script>
