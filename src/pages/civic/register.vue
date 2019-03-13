<template>
  <div />
</template>


<script>
import { IS_TESTNET } from '@/constant';

export default {
  middleware: 'authenticated',
  asyncData({ store, redirect }) {
    const LikerId = store.getters.getUserId;
    const paypalPaymentPage = IS_TESTNET
      ? `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LFJTWE4PM4VGQ&on0=LikerID&os0=${LikerId}`
      : `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=65HMAZFASPMJQ&on0=LikerID&os0=${LikerId}`;
    redirect(paypalPaymentPage);
  },
};
</script>
