import { copyToClipboard } from '~/util/ui';

import alertMixin from '~/mixins/alert';

export default {
  mixins: [alertMixin],
  methods: {
    copyToClipboard(text, { alertMessage = this.$t('clipboard_copied') } = {}) {
      if (navigator.share) {
        navigator.share({
          title: 'Just title',
          text: 'Just text',
          url: text,
        });
      } else {
        copyToClipboard(text);
        this.alertPromptSuccess(alertMessage);
      }
    },
    copyURLPath(path, options) {
      const host = `${window.location.protocol}//${window.location.host}`;
      const url = `${host}${path}`;
      this.copyToClipboard(url, options);
    },
  },
};
