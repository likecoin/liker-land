<template>
  <NFTPortfolioCard class="!bg-shade-gray">
    <div class="p-[8px] w-full h-[140px]">
      <div
        class="z-[5] h-full w-full bg-repeat-space"
        :style="{
          backgroundImage: `url(/images/NFT/background_cross.png)`,
        }"
      />
    </div>
    <div class="w-full pb-[32px] bg-shade-gray border-t-[1px] border-white">
      <div class="flex flex-col justify-center items-center mt-[-21px]">
        <div
          class="w-[42px] h-[42px] rounded-[50%] bg-shade-gray border-[2px] border-white"
        />
        <Label class="text-medium-gray mt-[12px]" :text="cardText" />
        <i18n
          v-if="shouldShowCrisp"
          class="flex items-center text-medium-gray text-[14px] mt-[12px]"
          path="nft_claim_claimed_empty_collected_help"
        >
          <button
            place="help"
            class="cursor-pointer text-like-green font-600 mx-[4px] hover:underline"
            @click="handleClickHelp"
          >
            {{ $t('nft_claim_claimed_help') }}
          </button>
        </i18n>
      </div>
    </div>
  </NFTPortfolioCard>
</template>

<script>
import crispMixin from '~/mixins/crisp';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'NFTPortfolioEmpty',
  mixins: [crispMixin],
  props: {
    // The preset of empty card, option: collected and created
    preset: {
      type: String,
      default: 'collected',
    },
  },
  computed: {
    cardText() {
      return this.preset === 'collected'
        ? this.$t('portfolio_collected_tab_no_item')
        : this.$t('portfolio_created_tab_no_item');
    },
    shouldShowCrisp() {
      return (
        this.$route.name.includes('bookshelf') && this.preset === 'collected'
      );
    },
  },
  methods: {
    handleClickHelp() {
      logTrackerEvent(this, 'bookshelf', 'bookshelf_crisp_click', '', 1);
      if (this.$crisp) {
        this.showCrisp();
        this.$crisp.push(['do', 'chat:open']);
      }
    },
  },
};
</script>
