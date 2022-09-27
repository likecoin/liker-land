import { copyToClipboard } from '~/util/ui';

import alertMixin from '~/mixins/alert';

export default {
  mixins: [alertMixin],
  methods: {
    copyToClipboard(text, { alertMessage = this.$t('clipboard_copied') } = {}) {
      copyToClipboard(text);
      this.alertPromptSuccess(alertMessage);
    },
    shareURLPath({ title, text, path, ...options }) {
      const host = `${window.location.protocol}//${window.location.host}`;
      const url = `${host}${path}`;
      if (navigator.share) {
        navigator.share({
          title,
          text,
          url,
        });
      } else {
        this.copyToClipboard(url, options);
      }
    },
  },
};
