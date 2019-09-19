<script>
import { getPaypalPaymentPageURL } from '@/util/api';

export default {
  middleware: 'authenticated',
  asyncData({ store, redirect, query }) {
    if (
      store.getters.getUserIsCivicLiker &&
      !store.getters.getUserInfo.isCivicLikerRenewalPeriod
    ) {
      redirect({ name: 'settings-civic' });
      return;
    }
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
