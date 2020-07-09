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
    redirect(getLikePayPageURL(from));
  },
};
</script>
