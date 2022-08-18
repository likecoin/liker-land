import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['uiIsOpenSnackbar', 'uiAlertType', 'uiAlertMessage']),
    alertMessage() {
      return this.uiAlertMessage;
    },
    alertPreset() {
      return this.uiAlertType || 'success';
    },
  },
  methods: {
    ...mapActions([
      'uiPromptErrorAlert',
      'uiPromptSuccessAlert',
      'uiCloseAlert',
    ]),
    alertPromptError(errorMsg) {
      this.uiPromptErrorAlert(errorMsg.response?.data || errorMsg);
    },
    alertPromptSuccess(successMsg) {
      this.uiPromptSuccessAlert(successMsg);
    },
    alertClose() {
      this.uiCloseAlert();
    },
  },
};
