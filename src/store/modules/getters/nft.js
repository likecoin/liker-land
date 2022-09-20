export const NFTClassIdList = state => state.userClassIdList;

export const NFTClassIdsByAddress = state => address =>
  state.userClassIdList[address];
