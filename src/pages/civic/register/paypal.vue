<template>
  <div />
</template>


<script>
import { getPaypalPaymentPageURL } from '@/util/api';

export default {
  middleware: 'authenticated',
  asyncData({ store, redirect, query }) {
    const likerId = store.getters.getUserId;
    const { from } = query;
    const customPayload = from
      ? {
          from,
        }
      : undefined;
    redirect(getPaypalPaymentPageURL(likerId, customPayload));
  },
};
</script>
