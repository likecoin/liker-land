const BigNumber = require('bignumber.js');
const { Router } = require('express');
const { LRUCache } = require('lru-cache');

const axios = require('../../../modules/axios');
const { handleRestfulError } = require('../../middleware/error');

const {
  LIKECOIN_CHAIN_API,
  LIKECOIN_API_BASE,
  LIKECOIN_NFT_API_WALLET,
} = require('../../../config/config');

const classChainMetadataCache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24, // 1 day
});

const router = Router();

router.get('/nft/metadata', async (req, res, next) => {
  try {
    const { class_id: classId, data: inputSelected } = req.query;
    if (!classId) {
      res.status(400).send('MISSING_CLASS_ID');
      return;
    }

    const selectedSet = new Set(
      typeof inputSelected === 'string' ? [inputSelected] : inputSelected
    );
    if (
      ![
        'class_chain',
        'class_api',
        'iscn',
        'owner',
        'listing',
        'purchase',
        'bookstore',
      ].some(s => selectedSet.has(s))
    ) {
      selectedSet.add('all');
    }

    const promises = [];

    if (['all', 'class_api', 'iscn'].some(s => selectedSet.has(s))) {
      promises.push(getNFTClassAndISCNMetadata(classId));
    } else if (selectedSet.has('class_chain')) {
      promises.push(Promise.all([getNFTClassChainMetadata(classId), null]));
    } else {
      promises.push([null, null]);
    }

    if (['all', 'listing'].some(s => selectedSet.has(s))) {
      promises.push(getNFTClassOwnerInfoAndListingInfo(classId));
    } else if (selectedSet.has('owner')) {
      promises.push(Promise.all([getNFTClassOwnerInfo(classId), null]));
    } else {
      promises.push([null, null]);
    }

    if (['all', 'purchase'].some(s => selectedSet.has(s))) {
      promises.push(getNFTClassPurchaseInfo(classId));
    } else {
      promises.push(null);
    }

    if (['all', 'bookstore'].some(s => selectedSet.has(s))) {
      promises.push(getNFTClassBookstoreInfo(classId));
    } else {
      promises.push(null);
    }

    const [
      [classData, iscnData],
      [ownerInfo, listings],
      purchaseInfo,
      bookstoreInfo,
    ] = await Promise.all(promises);

    const result = {};
    if (['all', 'class_chain', 'class_api'].some(s => selectedSet.has(s))) {
      result.classData = classData;
    }
    if (['all', 'iscn'].some(s => selectedSet.has(s))) {
      result.iscnData = iscnData;
    }
    if (['all', 'owner'].some(s => selectedSet.has(s))) {
      result.ownerInfo = ownerInfo;
    }
    if (['all', 'listing'].some(s => selectedSet.has(s))) {
      result.listings = listings;
    }
    if (['all', 'purchase'].some(s => selectedSet.has(s))) {
      result.purchaseInfo = purchaseInfo;
    }
    if (['all', 'bookstore'].some(s => selectedSet.has(s))) {
      result.bookstoreInfo = bookstoreInfo;
    }

    res.set('Cache-Control', 'public, max-age=10, stale-while-revalidate=50');
    res.json(result);
  } catch (err) {
    if (err.message === 'NFT_CLASS_NOT_FOUND') {
      res.status(404).send(err.message);
    } else {
      handleRestfulError(req, res, next, err);
    }
  }
});

async function getNFTClassChainMetadata(classId) {
  try {
    if (classChainMetadataCache.has(classId)) {
      return classChainMetadataCache.get(classId);
    }
    const { data } = await axios.get(
      `${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/classes/${classId}`
    );
    const {
      name,
      description,
      uri,
      data: { metadata, parent },
    } = data.class;
    const result = {
      name,
      description,
      uri,
      ...metadata,
      parent,
    };
    classChainMetadataCache.set(classId, result);
    return result;
  } catch (error) {
    if (error.response && error.response.data.code === 2) {
      // eslint-disable-next-line no-console
      throw new Error('NFT_CLASS_NOT_FOUND');
    }
    throw error;
  }
}

async function getNFTClassAPIMetadata(uri) {
  try {
    const { data } = await axios.get(uri);
    return data;
  } catch (err) {
    if (err.response && err.response.status !== 404) {
      // eslint-disable-next-line no-console
      console.error(`Failed to get API metadata from ${uri}`);
    }
    return null;
  }
}

async function getISCNMetadata(iscnId) {
  try {
    const { data } = await axios.get(
      `${LIKECOIN_CHAIN_API}/iscn/records/id?iscn_id=${iscnId}`
    );
    const result = data.records[0].data;
    result.owner = data.owner;
    return result;
  } catch (err) {
    if (err.response && err.response.status !== 404) {
      // eslint-disable-next-line no-console
      console.error(`Failed to get ISCN data for ${iscnId}`);
    }
    return null;
  }
}

async function getNFTClassAndISCNMetadata(classId) {
  const chainMetadata = await getNFTClassChainMetadata(classId);

  const iscnId = chainMetadata.parent.iscn_id_prefix;
  const promises = [getISCNMetadata(iscnId)];

  const { uri } = chainMetadata;
  if (isValidHttpUrl(uri)) {
    promises.push(getNFTClassAPIMetadata(uri));
  }
  const [iscnData, apiMetadata] = await Promise.all(promises);

  const classData = apiMetadata
    ? { ...chainMetadata, ...apiMetadata }
    : chainMetadata;
  const iscnOwner = iscnData.owner;
  const accountOwner = chainMetadata.parent.account;
  if (iscnOwner) {
    classData.iscn_owner = iscnOwner;
  } else if (accountOwner) {
    classData.account_owner = accountOwner;
  }

  return [classData, iscnData];
}

function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    // no op
  }
  return false;
}

function formatOwnerInfo(owners) {
  const ownerInfo = {};
  owners.forEach(o => {
    const { owner, nfts } = o;
    if (owner !== LIKECOIN_NFT_API_WALLET) {
      ownerInfo[owner] = nfts;
    }
  });
  return ownerInfo;
}

async function getNFTClassOwnerInfo(classId) {
  const { data } = await axios.get(
    `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/owner?class_id=${classId}`
  );
  const { owners = [] } = data;
  const result = formatOwnerInfo(owners);
  return result;
}

function formatAndFilterListing(listings, ownerInfo) {
  const result = listings
    .map(l => {
      const { class_id: classId, nft_id: nftId, seller, price, expiration } = l;
      return {
        classId,
        nftId,
        seller,
        price: new BigNumber(price).shiftedBy(-9).toNumber(),
        expiration: new Date(expiration),
      };
    })
    .filter(l => ownerInfo[l.seller] && ownerInfo[l.seller].includes(l.nftId)) // guard listing then sent case
    .sort((a, b) => a.price - b.price);
  return result;
}

async function getNFTClassOwnerInfoAndListingInfo(classId) {
  const [ownerInfo, listingInfo] = await Promise.all([
    getNFTClassOwnerInfo(classId),
    axios.get(`${LIKECOIN_CHAIN_API}/likechain/likenft/v1/listings/${classId}`),
  ]);
  const listingInput = listingInfo.data.listings || [];
  const listings = formatAndFilterListing(listingInput, ownerInfo);
  return [ownerInfo, listings];
}

async function getNFTClassPurchaseInfo(classId) {
  try {
    const { data } = await axios.get(
      `${LIKECOIN_API_BASE}/likernft/purchase?class_id=${classId}`
    );
    return data || null;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null;
    }
    throw err;
  }
}

async function getNFTClassBookstoreInfo(classId) {
  try {
    const { data } = await axios.get(
      `${LIKECOIN_API_BASE}/likernft/book/store/${classId}`
    );
    return data || null;
  } catch (err) {
    if (
      err.response &&
      (err.response.status === 400 || err.response.status === 404)
    ) {
      return null;
    }
    throw err;
  }
}

module.exports = router;
