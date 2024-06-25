const {
  AIRTABLE_API_SECRET,
  AIRTABLE_CMS_BASE_ID,
  AIRTABLE_CMS_TABLE_ID,
} = require('../../config/config');

const axios = require('../../modules/axios');

function normalizeViewName(viewName) {
  switch (viewName) {
    case 'landing':
      return 'Landing Page';
    case 'listing':
      return 'Listing Page';
    case 'all':
      return 'All';
    default:
      return viewName;
  }
}

async function fetchAirtableCMSItems(viewName, { pageSize = 100, offset }) {
  const results = await axios.get(
    `https://api.airtable.com/v0/${AIRTABLE_CMS_BASE_ID}/${AIRTABLE_CMS_TABLE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_SECRET}`,
      },
      params: {
        filterByFormula: 'NOT(Hidden)',
        pageSize,
        view: normalizeViewName(viewName),
        offset,
      },
    }
  );

  const normalizedRecords = results.data.records.map(({ fields }) => {
    const classId = fields.ID;
    const classIds = fields.IDs;
    const title = fields.Name;
    const titles = fields.Names;
    const imageUrl = fields['Image URL'];
    const imageUrls = fields['Image URLs'];
    const locales = fields.Locales;
    const isDRMFree = fields['DRM-free'];
    const timestamp = fields.Timestamp;
    const minPrice = fields['Min Price'];
    const isMultiple = classIds && classIds.length > 1;
    return {
      classId,
      classIds: isMultiple ? classIds : undefined,
      title,
      titles: isMultiple ? titles : undefined,
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

module.exports = {
  fetchAirtableCMSItems,
};
