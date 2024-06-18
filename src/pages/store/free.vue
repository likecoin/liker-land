<script>
import { PRICE_OPTIONS } from '~/constant/store';

export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(
      localeLocation({
        name: 'store',
        query: { ...query, price: PRICE_OPTIONS.FREE },
      })
    );
  },
};
</script>
