<template>
  <main
    class="
      about-page
      page-content
      text-gray-4a
      leading-[1.25]
      max-w-[1024px]
      w-full
      mx-auto
      pb-[132px]
    "
  >
    <section class="relative py-[32px] px-[24px]">
      <NFTCampaignHero class="absolute inset-0" />
      <div class="relative mx-auto">
        <h1
          class="
            font-proxima font-[300]
            text-like-green text-[32px]
            laptop:text-[64px]
            leading-[1.25]
            text-center
          "
        >
          <span class="whitespace-nowrap">{{
            $t('campaign_nft_page_tagline_1')
          }}</span>
          <span class="whitespace-nowrap">{{
            $t('campaign_nft_page_tagline_2')
          }}</span>
        </h1>
        <p
          v-t="'campaign_nft_page_description'"
          class="mt-[16px] max-w-[536px] mx-auto"
        />
        <svg
          class="mt-[24px] mx-auto text-like-green"
          width="40"
          height="86"
          viewBox="0 0 40 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21 82.0858L38.2929 64.7929C38.6834 64.4024 39.3166 64.4024 39.7071 64.7929C40.0976 65.1834 40.0976 65.8166 39.7071 66.2071L20.7071 85.2071C20.3166 85.5976 19.6834 85.5976 19.2929 85.2071L0.292893 66.2071C-0.0976312 65.8166 -0.0976308 65.1834 0.292893 64.7929C0.683417 64.4024 1.31658 64.4024 1.70711 64.7929L19 82.0858L19 1C19 0.447715 19.4477 0 20 0C20.5523 0 21 0.447715 21 1L21 82.0858Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <a
        class="flex items-center justify-center mt-[24px] text-medium-gray hover:text-like-cyan-dark text-[12px] leading-[5/3] underline transition-colors cursor-pointer"
        href="https://likecoin.github.io/likecoin-nft-dashboard/"
        target="_blank"
        rel="noopener"
      >{{ $t('campaign_nft_view_nft_dashboard') }}</a>
    </section>
    <section
      class="
        w-full
        max-w-[416px]
        laptop:max-w-full
        mx-auto
        px-[24px]
        laptop:px-[40px]
      "
    >
      <ul>
        <li
          v-for="(nftClassId, index) in nfts"
          :id="nftClassId"
          :key="index"
          :class="{ 'mt-[88px]': index > 0 }"
        >
          <NFTCampaignItem :class-id="nftClassId" />
        </li>
      </ul>
    </section>
    <section class="mt-[88px] px-[24px]">
      <h1 class="font-proxima font-[600] text-[32px] leading-[2] text-center text-like-green">{{ $t('campaign_nft_upcoming') }}</h1>
      <img
        loading="lazy"
        class="mt-[16px] max-w-[696px] w-full max-h-[316px] border-shade-gray border-[2px] rounded-[24px] mx-auto object-cover"
        src="~/assets/images/nft/upcoming.jpg"
      >
      <a
        class="flex items-center justify-center mt-[8px] text-medium-gray hover:text-like-cyan-dark text-[12px] leading-[5/3] underline transition-colors cursor-pointer"
        href="https://likecoin.github.io/likecoin-nft-dashboard/"
        target="_blank"
        rel="noopener"
      >{{ $t('campaign_nft_view_nft_dashboard') }}</a>
    </section>
  </main>
</template>

<script>
import { LIKECOIN_NFT_CAMPAIGN_ITEMS } from '~/constant';
import navigationListenerMixin from '~/mixins/navigation-listener';

export default {
  name: 'CampaignWritingNFTPage',
  layout: 'default',
  mixins: [navigationListenerMixin],
  head() {
    const title = this.$t('campaign_nft_page_title');
    const description = this.$t('campaign_nft_page_description');
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/writing-nft.jpg',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
  computed: {
    nfts() {
      return LIKECOIN_NFT_CAMPAIGN_ITEMS;
    },
  },
  mounted() {
    const { hash } = this.$route;
    if (hash) {
      try {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch {
        // No-op
      }
    }
  },
};
</script>
