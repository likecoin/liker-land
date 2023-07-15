const BigNumber = require('bignumber.js');
const { Router } = require('express');

const axios = require('../../../modules/axios');
const { handleRestfulError } = require('../../middleware/error');

const {
  LIKECOIN_CHAIN_API,
  LIKECOIN_API_BASE,
  LIKECOIN_NFT_API_WALLET,
} = require('../../../config/config');

const router = Router();

router.get('/nft/metadata', async (req, res, next) => {
  try {
    const { class_id: classId } = req.query;
    if (!classId) {
      res.status(400).send('MISSING_CLASS_ID');
      return;
    }

    const [
      [classData, iscnData],
      ownerInfoRes,
      listingInfoRes,
      purchaseInfoRes,
    ] = await Promise.all([
      getNFTClassAndISCNMetadata(classId),
      axios.get(
        `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/owner?class_id=${classId}`
      ),
      axios.get(
        `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/listings/${classId}`
      ),
      axios
        .get(`${LIKECOIN_API_BASE}/likernft/purchase?class_id=${classId}`)
        .catch(err => {
          // skip 404 error for non Writing NFT
          if (err.response && err.response.status === 404) {
            return null;
          }
          throw err;
        }),
    ]);

    const { owners = [] } = ownerInfoRes.data;
    const ownerInfo = formatOwnerInfo(owners);
    const listingInput = listingInfoRes.data.listings || [];
    const listings = formatAndFilterListing(listingInput, ownerInfo);
    const purchaseInfo = purchaseInfoRes ? purchaseInfoRes.data : null;

    res.set('Cache-Control', 'public, max-age=1');
    res.json({
      classData,
      iscnData,
      ownerInfo,
      listings,
      purchaseInfo,
    });
  } catch (err) {
    if (err.message === 'NFT_CLASS_NOT_FOUND') {
      res.status(404).send(err.message);
    } else {
      handleRestfulError(req, res, next, err);
    }
  }
});

async function getNFTClassAndISCNMetadata(classId) {
  const {
    data: { class: chainMetadata },
  } = await axios
    .get(`${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/classes/${classId}`)
    .catch(err => {
      if (err.response && err.response.data && err.response.data.code === 2) {
        // eslint-disable-next-line no-console
        throw new Error('NFT_CLASS_NOT_FOUND');
      }
      throw err;
    });
  const {
    name,
    description,
    uri,
    data: { metadata, parent },
  } = chainMetadata;
  let classData = {
    name,
    description,
    uri,
    ...metadata,
    parent,
  };

  const iscnId = parent.iscn_id_prefix;
  const getISCNPromise = axios
    .get(`${LIKECOIN_CHAIN_API}/iscn/records/id?iscn_id=${iscnId}`)
    .catch(err => {
      if (err.response && err.response.status !== 404) {
        // eslint-disable-next-line no-console
        console.error(`Failed to get ISCN data for ${iscnId}`);
        throw err;
      }
    });
  const promises = [getISCNPromise];

  if (isValidHttpUrl(uri)) {
    const getApiMetadataPromise = axios.get(uri).catch(err => {
      if (err.response && err.response.status !== 404) {
        // eslint-disable-next-line no-console
        console.error(`Failed to get API metadata of ${classId} for ${uri}`);
      }
    });
    promises.push(getApiMetadataPromise);
  }

  const [iscnRes, apiMetadataRes] = await Promise.all(promises);
  const iscnData = iscnRes.data.records.length
    ? iscnRes.data.records[0].data
    : null;
  const iscnOwner = iscnRes.data.owner;
  if (iscnData) iscnData.owner = iscnOwner;

  if (apiMetadataRes) {
    const apiMetadata = apiMetadataRes ? apiMetadataRes.data : null;
    if (apiMetadata && typeof apiMetadata === 'object') {
      classData = { ...classData, ...apiMetadata };
    }
  }
  if (iscnOwner) {
    classData.iscn_owner = iscnOwner;
  } else if (parent.account) {
    classData.account_owner = parent.account;
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

module.exports = router;
