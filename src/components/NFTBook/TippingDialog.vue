<template>
  <Dialog
    :open="open"
    panel-container-class="phone:w-full laptop:w-full max-w-[400px]"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg"
    @close="$emit('close')"
  >
    <div class="flex flex-col items-center">
      <div class="relative">
        <img
          class="object-cover w-full"
          src="~/assets/images/nft/tip-background.png"
        />
        <div
          class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-30%] flex flex-col items-center gap-[4px]"
        >
          <Avatar :url="creatorAvatar" :display-name="displayName" :size="88" />
          <div v-if="displayName" class="text-[12px] text-like-green">
            {{ displayName }}
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center gap-[6px] mt-[36px] mb-[24px]">
        <Label preset="h4" class="text-dark-gray">{{
          $t('nft_tipping_title')
        }}</Label>
        <p class="text-dark-gray font-200 text-[14px]">
          {{ $t('nft_tipping_description') }}
        </p>
      </div>
      <div class="flex flex-col items-center w-full px-[40px]">
        <div class="flex items-center justify-between w-full">
          <ButtonV2
            v-for="(tipping, i) of getDefaultTipping(currency)"
            :key="`${tipping}-${currency}`"
            preset="outline"
            :class="[
              { '!border-like-green': selectedIndex === i && !inputValue },
              'min-h-[60px]',
              'min-w-[8-px]',
            ]"
            @click.prevent="
              () => {
                handleSelectTipping(i);
              }
            "
          >
            <div class="flex flex-col items-center justify-center">
              <Label class="text-dark-gray" preset="h4">{{ tipping }}</Label>
              <Label preset="h6" class="text-medium-gray">{{ currency }}</Label>
            </div>
          </ButtonV2>
        </div>
        <div class="flex justify-center w-full mt-[8px]">
          <NFTBookTippingInput
            v-model="inputValue"
            :fixed-text="currency"
            @input="handleInputChange"
            @on-focus="selectedIndex = -1"
          />
        </div>
        <div class="flex flex-col items-center justify-center w-full mt-[48px]">
          <ButtonV2
            class="w-full"
            preset="secondary"
            :is-disabled="selectedIndex === -1 && !inputValue"
            @click.prevent="handleSubmit"
            >{{ $t('nft_tipping_button_continue') }}</ButtonV2
          >
          <ButtonV2
            class="mt-[12px] w-full"
            preset="plain"
            @click.prevent="handleSkip"
            >{{ $t('nft_tipping_button_skip') }}</ButtonV2
          >
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';
import Avatar from '../Identity/Identity.avatar';

const DEFAULT_TIPPING_PRICES_BY_CURRENCY = {
  HKD: [40, 200, 1000],
  USD: [5, 20, 100],
};

export default {
  name: 'NFTBookTippingDialog',
  components: {
    Avatar,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    creatorAvatar: {
      type: String,
      default: undefined,
    },
    displayName: {
      type: String,
      default: undefined,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    classId: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      selectedIndex: 1,
      tipPrice: 100,
      inputValue: undefined,
      customPrice: 0,
    };
  },
  methods: {
    getDefaultTipping(currency) {
      return DEFAULT_TIPPING_PRICES_BY_CURRENCY[currency];
    },
    handleSelectTipping(i) {
      this.selectedIndex = i;
      this.inputValue = undefined;
      this.customPrice = this.getDefaultTipping(this.currency)[i];
      logTrackerEvent(
        this,
        'NFT',
        'NFTTippingSelectOptions',
        this.customPrice,
        1
      );
    },
    handleInputChange(value) {
      this.customPrice = value;
    },
    handleSubmit() {
      logTrackerEvent(this, 'NFT', 'NFTTippingSubmit', this.classId, 1);
      this.$emit('on-submit', this.customPrice);
    },
    handleSkip() {
      logTrackerEvent(this, 'NFT', 'NFTTippingSkip', this.classId, 1);
      this.$emit('on-skip', this.customPrice);
    },
  },
};
</script>
