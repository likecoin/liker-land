import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['nftBookstoreItemsFromCMSForLandingPage']),
    bookstoreListItemForLandingPage() {
      return this.filterBookstoreListItemsByLocale(
        this.nftBookstoreItemsFromCMSForLandingPage
      );
    },
  },
  methods: {
    ...mapActions(['fetchBookstoreItemsFromCMSForLandingPage']),
    checkBookstoreListItemIsMatchedLocale(items) {
      if (Array.isArray(items.locales)) {
        items.locales.some(l => this.$i18n.locale.includes(l));
      }
      return this.$i18n.locale.includes(items.locales);
    },
    filterBookstoreListItemsByLocale(books) {
      return books.filter(this.checkBookstoreListItemIsMatchedLocale);
    },
  },
};
