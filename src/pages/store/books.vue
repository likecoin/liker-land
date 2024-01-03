<template>
  <Page
    :class="[
      'w-full',
      'max-w-[960px]',
      'mx-auto',
      'laptop:px-[2rem]',
      'space-y-[3rem]',
      'px-[0.75rem]',
      'pb-[8rem]',
    ]"
  >
    <h2
      class="text-[#3AB7A2] text-[2rem] desktop:text-[3rem] font-proxima font-[600] desktop:w-full"
    >
      {{ $t('store_books_page_header') }}
    </h2>

    <nav class="flex items-center justify-center">
      <ul
        :class="[
          'flex',
          'justify-center',
          'items-center',
          'p-[4px]',
          'bg-shade-gray',
          'rounded-[14px]',
        ]"
      >
        <li
          v-for="(item, index) in tabMenuItemList"
          :key="item.value"
          class="flex items-center"
        >
          <MenuButtonDivider v-if="index > 0" />
          <MenuButton
            :text="item.text"
            :is-selected="item.value === currentTab"
            @click="handleTabClick(item.value)"
          />
        </li>
      </ul>
    </nav>

    <Nuxt />

    <footer class="flex flex-wrap justify-center items-center gap-[0.5rem]">
      <ButtonV2
        preset="secondary"
        :text="$t('backToHome')"
        :to="localeLocation({ name: 'store' })"
      />
    </footer>
  </Page>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'StoreBooksPage',
  computed: {
    currentTab() {
      const routeName = this.getRouteBaseName(this.$route);
      switch (routeName) {
        case 'store-books-paid':
          return 'paid';

        case 'store-books-free':
          return 'free';

        case 'store-books':
        default:
          return 'featured';
      }
    },
    tabMenuItemList() {
      return [
        {
          text: this.$t('store_books_page_tab_featured'),
          value: 'featured',
        },
        {
          text: this.$t('store_books_page_tab_paid'),
          value: 'paid',
        },
        {
          text: this.$t('store_books_page_tab_free'),
          value: 'free',
        },
      ];
    },
  },
  methods: {
    handleTabClick(tab) {
      logTrackerEvent(this, 'Store', `StoreBooksSwitchTab_${tab}`, tab, 1);
      this.$router.push(this.localeLocation({ name: `store-books-${tab}` }));
    },
  },
};
</script>
