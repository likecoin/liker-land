<script>
import { getLikePayPageURL } from '@/util/api';

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
    const { from } = query;
    if (process.server) {
      redirect(getLikePayPageURL(from));
    } else {
      // redirect to /api url would fail using redirect() in client
      window.location = getLikePayPageURL(from);
    }
  },
};
</script>
