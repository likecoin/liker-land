<template>
  <div class="payment-failure-page bg-like-green">
    <main class="page-content flex justify-center items-center p-16">
      <div class="text-like-green text-center bg-white rounded w-full max-w-phone mb-32 p-48">
        <div class="text-24">{{ $t('PaymentFailurePage.title') }}</div>
      </div>
    </main>
  </div>
</template>


<script>
export default {
  data() {
    return {};
  },
  middleware: 'authenticated',
  computed: {},
  head() {
    return {
      title: this.$t('PaymentFailurePage.title'),
    };
  },
  mounted() {
    setTimeout(() => {
      this.$router.push({
        name: 'civic',
      });
    }, 3000);
  },
};
</script>
