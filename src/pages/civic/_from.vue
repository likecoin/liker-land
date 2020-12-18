<template lang="pug">
  div
    Spinner.mx-auto.my-96
</template>

<script>
import { DEFAULT_CL_SUPPORTER } from '~/constant';

import Spinner from '~/components/Spinner/Spinner';

export default {
  components: {
    Spinner,
  },
  fetch({ redirect, query: { from: qId, ...query }, params: { from: pId } }) {
    const id = pId || qId || DEFAULT_CL_SUPPORTER;
    redirect({ name: 'id-civic', params: { id }, query });
  },
};
</script>
