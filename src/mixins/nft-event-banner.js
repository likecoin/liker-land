import { logTrackerEvent } from '~/util/EventLogger';
import { NFT_BOOK_WITH_EVENT_BANNER_SET } from '~/constant';

export default {
  data: () => ({
    nftShouldHideEventBanner: false,
  }),
  computed: {
    nftEventBanner() {
      const set = NFT_BOOK_WITH_EVENT_BANNER_SET.find(set =>
        set.classIds.includes(this.classId)
      );

      if (!set) return undefined;

      return {
        ...set,
        imgSrc: `/images/event-banners/${set.id}.png`,
        imgSrcForMobile: `/images/event-banners/${set.id}-mobile.png`,
      };
    },
    nftShouldShowEventBanner() {
      return !!this.nftEventBanner && !this.nftShouldHideEventBanner;
    },
  },
  methods: {
    handleClickEventBannerCloseButton() {
      this.nftShouldHideEventBanner = true;
      logTrackerEvent(this, 'NFT', 'NFTEventBannerHide', this.classId, 1);
    },
    handleClickEventBanner() {
      logTrackerEvent(this, 'NFT', 'NFTEventBannerClick', this.classId, 1);
    },
  },
};
