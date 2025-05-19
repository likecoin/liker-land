const {
  AIRTABLE_API_SECRET,
  AIRTABLE_CMS_BASE_ID,
  AIRTABLE_CMS_PRODUCTS_TABLE_ID,
  AIRTABLE_CMS_PRODUCTS_CHAIN_TYPE,
  AIRTABLE_CMS_TAGS_TABLE_ID,
} = require('../../config/config');

const axios = require('../../modules/axios');

function normalizeChainType(chainType = AIRTABLE_CMS_PRODUCTS_CHAIN_TYPE) {
  return chainType === 'evm' ? 'evm' : 'like';
}

function normalizeTagIdForViewName(viewName) {
  switch (viewName) {
    case 'landing':
      return 'Landing Page';
    case 'listing-zh':
      return 'Listing Page (Chinese)';
    case 'listing-en':
      return 'Listing Page (English)';
    case 'all':
      return 'All';
    default:
      return viewName;
  }
}

async function fetchAirtableCMSProductsByTagId(
  tagId,
  { chain, pageSize = 100, offset }
) {
  const results = await axios.get(
    `https://api.airtable.com/v0/${AIRTABLE_CMS_BASE_ID}/${AIRTABLE_CMS_PRODUCTS_TABLE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_SECRET}`,
      },
      params: {
        filterByFormula: `AND(NOT(Hidden), Chain = "${normalizeChainType(
          chain
        )}")`,
        pageSize,
        view: normalizeTagIdForViewName(tagId),
        offset,
      },
    }
  );

  const normalizedRecords = results.data.records.map(({ id, fields }) => {
    const classId = fields.ID;
    const classIds = fields.IDs;
    const title = fields.Name;
    const titles = fields.Names;
    const author = fields.Author;
    const imageUrl = fields['Image URL'];
    const imageUrls = fields['Image URLs'];
    const locales = fields.Locales;
    const isDRMFree = !!fields['DRM-free'];
    const timestamp = fields.Timestamp;
    const minPrice = fields['Min Price'];
    const isMultiple = classIds && classIds.length > 1;
    return {
      id,
      classId,
      classIds: isMultiple ? classIds : undefined,
      title,
      titles: isMultiple ? titles : undefined,
      author,
      imageUrl,
      imageUrls: isMultiple ? imageUrls : undefined,
      locales,
      isDRMFree,
      isMultiple: isMultiple ? true : undefined,
      minPrice,
      timestamp,
    };
  });

  return {
    records: normalizedRecords,
    offset: results.data.offset,
  };
}

async function fetchAirtableCMSTags({ pageSize = 100, offset }) {
  const results = await axios.get(
    `https://api.airtable.com/v0/${AIRTABLE_CMS_BASE_ID}/${AIRTABLE_CMS_TAGS_TABLE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_SECRET}`,
      },
      params: {
        pageSize,
        view: 'All',
        offset,
      },
    }
  );

  const normalizedRecords = results.data.records.map(({ fields }) => {
    const id = fields.ID;
    const nameZh = fields.Name;
    const nameEn = fields['Name (Eng)'];
    const descriptionZh = fields.Description;
    const descriptionEn = fields['Description (Eng)'];
    const isPublic = fields.Public;
    return {
      id,
      name: {
        zh: nameZh,
        en: nameEn,
      },
      description: {
        zh: descriptionZh,
        en: descriptionEn,
      },
      isPublic,
    };
  });

  return {
    records: normalizedRecords,
    offset: results.data.offset,
  };
}

module.exports = {
  fetchAirtableCMSProductsByTagId,
  fetchAirtableCMSTags,
};
