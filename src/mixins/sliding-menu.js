import { mapActions, mapGetters } from 'vuex';

import SlidingMenu from '~/components/SlidingMenu';

export default {
  components: {
    SlidingMenu,
  },
  computed: {
    ...mapGetters(['getIsSlidingMenuOpen']),
  },
  head() {
    return {
      htmlAttrs: {
        'sliding-menu': this.getIsSlidingMenuOpen ? 'opened' : 'closed',
      },
    };
  },
  beforeDestroy() {
    this.manageClickListener(false);
  },
  watch: {
    getIsSlidingMenuOpen(isOpened) {
      this.manageClickListener(isOpened);
    },
  },
  methods: {
    ...mapActions(['toggleSlidingMenu']),

    manageEventListener(eventName, isAdd) {
      window[`${isAdd ? 'add' : 'remove'}EventListener`](
        eventName,
        this.onWindowClick,
        true
      );
    },
    manageClickListener(isAdd) {
      this.manageEventListener('click', isAdd);
      this.manageEventListener('touchend', isAdd);
    },

    // Dismiss the sliding menu when there is a click event outside it
    onWindowClick(e) {
      if (!this.getIsSlidingMenuOpen) return;

      const component = this.$refs.slidingMenu;
      const isClickedOutside =
        component &&
        !component.$el.contains(e.target) &&
        !e.target.classList.contains('sliding-menu-toggle');
      if (isClickedOutside) {
        // Intercept the event to menu button that preventing the action
        e.stopPropagation();
        this.toggleSlidingMenu(false);
      }
    },
  },
};
