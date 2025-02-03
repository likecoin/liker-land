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
        <NuxtLink
          v-if="shouldShowCrisp"
          class="mt-[12px] text-like-green font-600"
          :to="localeLocation({ name: 'bookstore' })"
        >
          {{ $t('portfolio_collected_tab_get_more_item') }}
        </NuxtLink>
        <i18n
          v-if="shouldShowCrisp"
          class="flex items-center text-medium-gray text-[14px] mt-[24px]"
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
  data() {
    return {
      crispWebsiteId: '',
    };
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
  mounted() {
    // populate crisp on mount to avoid ssr issues
    if (window.CRISP_WEBSITE_ID) this.crispWebsiteId = window.CRISP_WEBSITE_ID;
  },
  methods: {
    handleClickHelp() {
      logTrackerEvent(this, 'bookshelf', 'bookshelf_crisp_click', '', 1);
      const res = this.openCrisp(
        this.$t('nft_claim_claimed_empty_crisp_prefilled_message')
      );
      if (!res) {
        if (this.crispWebsiteId) {
          window.open(
            `https://go.crisp.chat/chat/embed/?website_id=${
              this.crispWebsiteId
            }`
          );
        } else {
          window.open(
            'https://discord.com/channels/763001015712350231/814761730349596712'
          );
        }
      }
    },
  },
};
</script>
