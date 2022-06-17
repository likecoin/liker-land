<template>
  <div />
</template>

<script>
import { getNFTMintInfo } from '~/util/api';

export default {
  layout: 'desktop',
  async asyncData({ route, redirect, $api, error }) {
    const { iscnId } = route.params;
    try {
      const { classId } = await $api.$get(getNFTMintInfo({ iscnId }));
      if (classId) {
        return redirect({ name: 'nft-class-classId', params: { classId } });
      }
    } catch (err) {
      const msg = (err.response && err.response.data) || err;
      // eslint-disable-next-line no-console
      console.error(msg);
    }
    error({ statusCode: 404, message: 'NFT_CLASS_NOT_FOUND' });
    return undefined;
  },
};
</script>
