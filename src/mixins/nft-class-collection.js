import { getPropNameGenerator } from '~/util/misc';
import { nftClassCollectionType } from '~/util/nft';

export const createNFTClassCollectionMixin = ({
  propKey = '',
  typeKey = 'classCollectionType',
} = {}) => {
  const getPropName = getPropNameGenerator(propKey);
  const isWritingNFTPropName = getPropName('{key}IsWritingNFT');
  return {
    computed: {
      [isWritingNFTPropName]() {
        return this[typeKey] === nftClassCollectionType.WritingNFT;
      },
      [getPropName('{key}IsBookNFT')]() {
        return this[typeKey] === nftClassCollectionType.BookNFT;
      },
      [getPropName('{key}IsPrimitive')]() {
        return !this[isWritingNFTPropName];
      },
    },
  };
};

export default createNFTClassCollectionMixin();
