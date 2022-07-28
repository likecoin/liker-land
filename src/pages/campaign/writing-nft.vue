<template>
  <div class="about-page bg-gray-f7">
    <PageHeader class="text-like-green">
      <SiteNavBar />
    </PageHeader>
    <main
      class="
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
      </section>
      <section class="px-[24px] laptop:px-[40px] max-w-[416px] laptop:max-w-full mx-auto">
        <ul>
          <li
            v-for="(nftClassId, index) in nfts"
            :key="index"
            :class="{ 'mt-[88px]': index > 0 }"
          >
            <NFTCampaignItem :class-id="nftClassId" />
          </li>
        </ul>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
import { LIKECOIN_NFT_CAMPAIGN_ITEMS } from '~/constant';
import navigationListenerMixin from '~/mixins/navigtion-listener';

export default {
  name: 'CampaignWritingNFTPage',
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
};
</script>
