<template>
  <div>
    Payment success...
    Might take a few minutes to process the payment

    返回 URL 要求：
    輸入付款完成後用於將客戶重新導向的 URL。此 URL 必須符合以下詳述的原則。

    根據「用戶同意書」，你必須在返回 URL 頁面上向買家說明付款和交易已經完成。
    你必須在返回 URL 頁面上，說明會透過電郵將付款交易詳細資料發送給買家。
    範例：多謝你的付款。你的交易已完成，系統已透過電郵傳送購物收據給你。登入你的 PayPal 帳戶，以檢視交易詳細資料。
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { getPayPalPaymentAPI } from '@/util/api';

export default {
  data() {
    return {};
  },
  middleware: 'authenticated',
  computed: {},
  async mounted() {
    let from;
    let referrer;
    if (window.sessionStorage) {
      from = window.sessionStorage.getItem('civicLikerFrom');
      referrer = window.sessionStorage.getItem('civicLikerReferrer');
    }
    try {
      await this.$axios.$post(getPayPalPaymentAPI(), {
        from,
        referrer,
        ...this.$route.query,
      });
      this.setUserCivicLiker();
      setTimeout(() => {
        this.$router.push({
          name: 'index',
        });
      }, 3000);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      throw err;
    }
  },
  methods: {
    ...mapActions(['setUserCivicLiker']),
  },
};
</script>
