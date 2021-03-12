<template lang="pug">
  div
    Spinner.mx-auto.my-96
</template>

<script>
import { getStripeBillingPortalAPI } from '~/util/api';

import Spinner from '~/components/Spinner/Spinner';

export default {
  components: {
    Spinner,
  },
  asyncData({ redirect }) {
    redirect(getStripeBillingPortalAPI());
  },
};
</script>
