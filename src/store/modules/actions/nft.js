import * as types from '@/store/mutation-types';
import { getNFTs } from '~/util/nft';
import { getUserSellNFTClasses } from '@/util/api';

// eslint-disable-next-line import/prefer-default-export
export async function updateUserNFTList({ commit }, address) {
  const { nfts } = await getNFTs({ owner: address });
  const collectedIds = nfts?.map(n => n?.classId);
  const { data } = await this.$api.get(
    getUserSellNFTClasses({ wallet: address })
  );
  const createdIds = data?.list;

  commit(types.NFT_SET_USER_CLASSID_LIST, {
    address,
    nfts: {
      created: createdIds,
      collected: collectedIds,
    },
  });
}
