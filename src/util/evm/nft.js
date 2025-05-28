import { readContract } from './client';
import { LIKE_NFT_CLASS_ABI } from './LikeNFT';

export function isEVMClassId(classId) {
  return classId?.startsWith('0x');
}

export async function getNFTClassOwner(classId) {
  const owner = await readContract({
    address: classId,
    abi: LIKE_NFT_CLASS_ABI,
    functionName: 'owner',
  });
  return owner;
}

export async function getNFTOwner(classId, tokenId) {
  const owner = await readContract({
    address: classId,
    abi: LIKE_NFT_CLASS_ABI,
    functionName: 'ownerOf',
    args: [tokenId],
  });
  return owner;
}

export async function getNFTClassDataById(classId) {
  const dataString = await readContract({
    address: classId,
    abi: LIKE_NFT_CLASS_ABI,
    functionName: 'contractURI',
  });
  const dataUriPattern = /^data:application\/json(; ?charset=utf-8|;utf8)?,/i;
  if (!dataUriPattern.test(dataString)) {
    throw new Error('Invalid data');
  }
  return JSON.parse(dataString.replace(dataUriPattern, ''));
}

export async function getNFTDataByTokenId(classId, tokenId) {
  const dataString = await readContract({
    address: classId,
    abi: LIKE_NFT_CLASS_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
  });
  const dataUriPattern = /^data:application\/json(; ?charset=utf-8|;utf8)?,/i;
  if (!dataUriPattern.test(dataString)) {
    throw new Error('Invalid data');
  }
  return JSON.parse(dataString.replace(dataUriPattern, ''));
}

export async function getNFTClassBalanceOf(classId, wallet) {
  const balance = await readContract({
    address: classId,
    abi: LIKE_NFT_CLASS_ABI,
    functionName: 'balanceOf',
    args: [wallet],
  });
  return balance;
}
