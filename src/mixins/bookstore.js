import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['nftBookstoreCMSProductsForLandingPage']),
    bookstoreListItemForLandingPage() {
      return this.filterBookstoreListItemsByLocale(
        this.nftBookstoreCMSProductsForLandingPage
      );
    },
  },
  methods: {
    ...mapActions(['fetchBookstoreCMSProductsForLandingPage']),
    checkBookstoreListItemIsMatchedLocale(items) {
      if (Array.isArray(items.locales)) {
        items.locales.some(l => this.$i18n.locale.includes(l));
      }
      return this.$i18n.locale.includes(items.locales);
    },
    filterBookstoreListItemsByLocale(books) {
      return Array.isArray(books)
        ? books.filter(this.checkBookstoreListItemIsMatchedLocale)
        : [];
    },
  },
};
