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
      return items.locales.some(l => this.$i18n.locale.includes(l));
    },
    filterBookstoreListItemsByLocale(books) {
      return books.filter(this.checkBookstoreListItemIsMatchedLocale);
    },
  },
};
