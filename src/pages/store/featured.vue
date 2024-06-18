<script>
import { SORTING_OPTIONS } from '~/constant/store';

export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(
      localeLocation({
        name: 'store',
        query: { ...query, sort: SORTING_OPTIONS.RECOMMEND },
      })
    );
  },
};
</script>
