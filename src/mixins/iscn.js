import { mapActions, mapGetters } from 'vuex';
import { APP_LIKE_CO_VIEW } from '~/constant';

export default {
  computed: {
    ...mapGetters(['getISCNMetadataById']),
    iscnId() {
      return (
        this.NFTClassMetadata.parent?.iscnIdPrefix ||
        this.NFTClassMetadata.parent?.iscn_id_prefix
      );
    },
    iscnURL() {
      if (!this.iscnId) return '';
      return `${APP_LIKE_CO_VIEW}/${encodeURIComponent(this.iscnId)}`;
    },
    iscnData() {
      if (!this.iscnId) return undefined;
      const data = this.getISCNMetadataById(this.iscnId);
      if (data instanceof Promise) return undefined;
      return data;
    },
  },
  methods: {
    ...mapActions(['lazyGetISCNMetadataById']),
    async fetchISCNMetadata() {
      await this.lazyGetISCNMetadataById(this.iscnId);
    },
  },
};
