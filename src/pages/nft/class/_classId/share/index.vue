<script>
export default {
  async fetch({ store, params, query, redirect, localeLocation }) {
    const { classId } = params;
    const { referrer } = query;
    if (referrer) {
      const ownerMap = await store.dispatch('fetchNFTOwners', classId);
      const ownerCollectedNFTIds = ownerMap[referrer];
      if (ownerCollectedNFTIds) {
        redirect(
          localeLocation({
            name: 'nft-class-classId-nftId',
            params: { classId, nftId: ownerCollectedNFTIds[0] },
          })
        );
      }
      return;
    }
    redirect(
      localeLocation({
        name: 'nft-class-classId',
        params: { classId },
      })
    );
  },
};
</script>
