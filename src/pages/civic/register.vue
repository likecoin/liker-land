<template>
  <div />
</template>


<script>
import { getPaypalPaymentPageURL } from '@/util/api';

export default {
  middleware: 'authenticated',
  asyncData({ store, redirect }) {
    const likerId = store.getters.getUserId;
    redirect(getPaypalPaymentPageURL(likerId));
  },
};
</script>
