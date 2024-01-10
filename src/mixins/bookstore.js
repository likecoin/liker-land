import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['nftGetBookstoreListItems']),
    bookstoreListItemsInHighlighted() {
      return this.filterBookstoreListItemsByLocale(
        this.nftGetBookstoreListItems('highlighted')
      );
    },
    bookstoreListItemsInHighlightedClassIdSet() {
      return new Set(
        this.bookstoreListItemsInHighlighted.map(item => item.classId)
      );
    },
    bookstoreListItemsInFeatured() {
      return this.sortBookstoreListItemsByLocale(
        this.nftGetBookstoreListItems('featured').filter(
          item =>
            !this.bookstoreListItemsInHighlightedClassIdSet.has(item.classId)
        )
      );
    },
  },
  methods: {
    checkBookstoreListItemIsMatchedLocale(items) {
      return items.locales.some(l => this.$i18n.locale.includes(l));
    },
    filterBookstoreListItemsByLocale(books) {
      return books.filter(this.checkBookstoreListItemIsMatchedLocale);
    },
    sortBookstoreListItemsByLocale(books) {
      const sortedBooks = [...books];
      sortedBooks.sort((a, b) => {
        const aMatchedLocale = this.checkBookstoreListItemIsMatchedLocale(a);
        const bMatchedLocale = this.checkBookstoreListItemIsMatchedLocale(b);
        if (aMatchedLocale && !bMatchedLocale) {
          return -1;
        }
        if (!aMatchedLocale && bMatchedLocale) {
          return 1;
        }
        return 0;
      });
      return sortedBooks;
    },
  },
};
