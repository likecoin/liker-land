<template>
  <section id="partners" class="flex flex-col gap-[72px] pt-[72px] pb-[96px]">
    <h2
      :class="[
        'text-like-green',
        'text-[2rem] laptop:text-[3rem]',
        'text-center',
        'font-serif',
        'font-[600]',
      ]"
      v-text="$t('section_partners_title')"
    />

    <div v-for="section in sections" :key="section.id">
      <h3
        class="text-[24px] laptop:text-[32px] text-center font-serif font-[600]"
        v-text="section.title"
      />

      <ul
        :class="[
          'grid',
          'grid-cols-2 laptop:grid-cols-4',
          section.items.length % 2 === 0
            ? 'min-1280:grid-cols-6'
            : 'min-1280:grid-cols-7',

          'justify-items-center',

          'gap-[20px]',
          { 'gap-y-[40px]': section.id === 'authors' },

          'mt-[48px]',
        ]"
      >
        <li v-for="item in section.items" :key="item.id">
          <component :is="item.props.is" class="group" v-bind="item.props">
            <img
              :src="item.logo"
              :alt="item.name"
              :class="[
                section.id === 'authors'
                  ? ['w-[80px]', 'h-[80px]', 'object-cover', 'rounded-full']
                  : ['w-[120px]', 'h-[120px]', 'object-contain'],

                { 'group-hover:scale-105': item.props.to },
                'transition-transform',
              ]"
            />

            <div
              v-if="section.id === 'authors'"
              :class="[
                'mt-[8px]',

                'text-[#8B8B8B]',
                { 'group-hover:text-like-green': item.props.to },
                'text-[14px]',
                'text-center',
                'font-sans',

                'transition-color',
              ]"
              v-text="item.name"
            />
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
const getPartnerLogoSrc = require.context('~/assets/images/partners');

export default {
  name: 'PartnersSection',
  computed: {
    publishers() {
      return [
        {
          id: 'breakthrough',
          name: this.$t('section_partners_publisher_breakthrough'),
          wallet: 'like1a7rtmu438s43nzhk7efct092qfna39ksqxvdp4',
        },
        {
          id: 'bbluesky',
          name: this.$t('section_partners_publisher_bbluesky'),
          wallet: 'like1w399ffzqhxxhhwny3ckt9naezn6l9uv77kurd9',
        },
        {
          id: 'nowhere',
          name: this.$t('section_partners_publisher_nowhere'),
          wallet: 'like14dlwfjpgps7nsz9cez5ht2j7xklxp9k73muedr',
        },
        {
          id: 'enrich',
          name: this.$t('section_partners_publisher_enrich'),
          wallet: 'like10fwqdc8xr8d7dsmlrwmvt8sj2604hkd7jadsc0',
        },
        {
          id: 'eduhk',
          name: this.$t('section_partners_publisher_eduhk'),
          wallet: 'like1uljzmgmreka9qarm6w46plm8s8vmnzfsdkrpj4',
        },
        {
          id: 'kubrick',
          name: this.$t('section_partners_publisher_kubrick'),
          wallet: 'like1cfz3cpmnq4tvxqec77mxr3ygqtet3vqtqmejwm',
        },
        {
          id: 'boundary',
          name: this.$t('section_partners_publisher_boundary'),
          wallet: 'like1grh03rygyqhvef2mqj63gru8jfe4wxrt6dks5e',
        },
        {
          id: 'goodmorningpress',
          name: this.$t('section_partners_publisher_goodmorningpress'),
          wallet: 'like1v28pe8cmydv8n96uyrrd8yjvae5cd02e7a835z',
        },
      ].map(this.populatePartnerItem);
    },
    bookstores() {
      return [
        {
          id: 'hkreader',
          name: this.$t('section_partners_bookstore_hkreader'),
        },
        {
          id: 'hunter',
          name: this.$t('section_partners_bookstore_hunter'),
        },
        {
          id: 'stay',
          name: this.$t('section_partners_bookstore_stay'),
        },
        {
          id: 'punch',
          name: this.$t('section_partners_bookstore_punch'),
        },
        {
          id: '1bookstore',
          name: this.$t('section_partners_bookstore_1bookstore'),
        },
        {
          id: 'nowhere',
          name: this.$t('section_partners_bookstore_nowhere'),
          wallet: 'like14dlwfjpgps7nsz9cez5ht2j7xklxp9k73muedr',
        },
        {
          id: 'dionysus',
          name: this.$t('section_partners_bookstore_dionysus'),
        },
      ].map(this.populatePartnerItem);
    },
    authors() {
      return [
        {
          id: 'dungkaicheung',
          name: this.$t('section_partners_author_dungkaicheung'),
          wallet: 'like19fqws220rwcmacn5dgt0dtwts8c05ty58mcr3a',
        },
        {
          id: 'tseringwoeser',
          name: this.$t('section_partners_author_tseringwoeser'),
          keyword: '唯色',
        },
        {
          id: 'wanglixiong',
          name: this.$t('section_partners_author_wanglixiong'),
          keyword: '王力雄',
        },
        {
          id: 'eglenweyl',
          name: this.$t('section_partners_author_eglenweyl'),
          classId:
            'likenft1cxcpmtg7wz7xu7pnlpmxvfj82c44j3uc8634rgz6zddpew8fkx7smut5cl',
        },
        {
          id: 'audreytang',
          name: this.$t('section_partners_author_audreytang'),
          classId:
            'likenft1cxcpmtg7wz7xu7pnlpmxvfj82c44j3uc8634rgz6zddpew8fkx7smut5cl',
        },
        {
          id: 'allenau',
          name: this.$t('section_partners_author_allenau'),
          keyword: '區家麟',
        },
        {
          id: 'kinko',
          name: this.$t('section_partners_author_kinko'),
          wallet: 'like13f4glvg80zvfrrs7utft5p68pct4mcq7t5atf6',
        },
        {
          id: 'francislee',
          name: this.$t('section_partners_author_francislee'),
          keyword: '李立峯',
        },
        {
          id: 'chankinman',
          name: this.$t('section_partners_author_chankinman'),
          classId:
            'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
        },
      ].map(this.populatePartnerItem);
    },
    sections() {
      return [
        {
          id: 'publishers',
          title: this.$t('section_partners_publisher_title'),
          items: this.publishers,
        },
        {
          id: 'bookstores',
          title: this.$t('section_partners_bookstore_title'),
          items: this.bookstores,
        },
        {
          id: 'authors',
          title: this.$t('section_partners_author_title'),
          items: this.authors,
        },
      ];
    },
  },
  methods: {
    populatePartnerItem(partner) {
      const props = { is: 'div' };

      if (partner.wallet || partner.classId || partner.keyword) {
        props.is = 'NuxtLink';

        if (partner.wallet) {
          props.to = this.localeLocation({
            name: 'id',
            params: { id: partner.wallet },
          });
        } else if (partner.classId) {
          props.to = this.localeLocation({
            name: 'nft-class-classId',
            params: { classId: partner.classId },
          });
        } else if (partner.keyword) {
          props.to = this.localeLocation({
            name: 'store',
            query: { q: partner.keyword },
          });
        }
      }

      return {
        props,
        logo: getPartnerLogoSrc(`./${partner.id}.png`),
        ...partner,
      };
    },
  },
};
</script>
