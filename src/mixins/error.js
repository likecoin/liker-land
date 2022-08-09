const ErrorType = { INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE' };

export default {
  data() {
    return {
      isOpenWarningSnackbar: false,
      isOpenSuccessSnackbar: false,
      errorType: '',
      successMsg: '',
    };
  },
  computed: {
    errorAlert() {
      switch (this.errorType) {
        case ErrorType.INSUFFICIENT_BALANCE:
          return this.$t('snackbar_error_insufficient');
        default:
          return this.errorType;
      }
    },
  },
  methods: {
    errorHandling(err) {
      this.isOpenWarningSnackbar = true;
      this.errorType = err.response?.data || err.toString();
    },
    handleSuccess(msg) {
      this.isOpenSuccessSnackbar = true;
      this.successMsg = msg;
    },
  },
};
