<template>
  <div />
</template>

<script>
import { getNFTMintInfo } from '~/util/api';

export default {
  async asyncData({ route, redirect, $api, error, localeLocation }) {
    const { iscnId } = route.params;
    try {
      const { classId } = await $api.$get(getNFTMintInfo({ iscnId }));
      if (classId) {
        return redirect(
          localeLocation({ name: 'nft-class-classId', params: { classId } })
        );
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
