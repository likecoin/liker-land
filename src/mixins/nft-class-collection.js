import { getPropNameGenerator } from '~/util/misc';
import { nftClassCollectionType } from '~/util/nft';

export const createNFTClassCollectionMixin = ({
  propKey = '',
  typeKey = 'classCollectionType',
} = {}) => {
  const getPropName = getPropNameGenerator(propKey);
  return {
    computed: {
      [getPropName('{key}IsPrimitive')]() {
        return this[typeKey] === nftClassCollectionType.PrimitiveNFT;
      },
      [getPropName('{key}IsWritingNFT')]() {
        return this[typeKey] === nftClassCollectionType.WritingNFT;
      },
    },
  };
};

export default createNFTClassCollectionMixin();
