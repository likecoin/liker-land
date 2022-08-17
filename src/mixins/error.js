import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getIsOpenSnackbar', 'getAlertType', 'getAlertMessage']),
    alertMessage() {
      return this.getAlertMessage;
    },
    getPreset() {
      return this.getAlertType || 'success';
    },
  },
  methods: {
    ...mapActions(['handleErrorAlert', 'handleSuccessAlert', 'closeAlert']),
    handleError(errorMsg) {
      this.handleErrorAlert(errorMsg.response?.data || errorMsg);
    },
    handleSuccess(successMsg) {
      this.handleSuccessAlert(successMsg);
    },
    handleClose() {
      this.closeAlert();
    },
  },
};
