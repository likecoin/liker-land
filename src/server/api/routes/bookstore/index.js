const { Router } = require('express');
const { Client } = require('@notionhq/client');

const {
  NOTION_API_KEY,
  NOTION_DATABASE_ID_FOR_BOOKSTORE_ITEMS,
  NOTION_DATABASE_ID_FOR_BOOKSTORE_LISTS,
} = require('../../../config/config');

const { handleRestfulError } = require('../../middleware/error');

const router = Router();

const notion = new Client({ auth: NOTION_API_KEY });

function parseClassId(classId) {
  const classIds = classId.split('\n');
  return classIds.length > 1 ? classIds : classId;
}

router.get('/bookstore/items', async (req, res, next) => {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID_FOR_BOOKSTORE_ITEMS,
      filter_properties: [
        'ULp%40', // Class ID
        'gBQK', // Locale
        'n%7C%5C%5D', // Listing Date
      ],
      filter: {
        and: [
          {
            property: 'Listing Date',
            date: {
              is_not_empty: true,
            },
          },
          {
            property: 'Listing Date',
            date: {
              on_or_before: new Date().toISOString(),
            },
          },
          {
            property: 'Visible',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Listing Date',
          direction: 'descending',
        },
      ],
    });

    const results = response.results.map(({ properties }) => ({
      classId: parseClassId(properties['NFT Class ID'].rich_text[0].plain_text),
      locale: properties.Locale.select.name,
      date: properties['Listing Date'].date.start,
    }));

    res.set(
      'Cache-Control',
      'public, max-age=3600, stale-if-error=604800, stale-while-revalidate=604800'
    );
    res.json({ results });
  } catch (error) {
    handleRestfulError(req, res, next, error);
  }
});

router.get('/bookstore/lists', async (req, res, next) => {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID_FOR_BOOKSTORE_LISTS,
      filter_properties: [
        'title',
        'aygV', // Class ID List
        '%3CSgS', // Name List
        'pe%5Bj', // Locale List
        'VESz', // Visibility List
      ],
    });

    const results = {};
    response.results.forEach(({ properties }) => {
      const listId = properties.ID.title[0].plain_text;
      const classIdPropList = properties['Class ID List'].rollup.array;
      const titlePropList = properties['Name List'].rollup.array;
      const localePropList = properties['Locale List'].rollup.array;
      const visibilityPropList = properties['Visibility List'].rollup.array;

      results[listId] = [];
      classIdPropList.forEach((classId, index) => {
        const isVisible = visibilityPropList[index].formula.boolean;
        if (!isVisible) return;

        results[listId].push({
          classId: parseClassId(classId.rich_text[0].plain_text),
          title: titlePropList[index].title[0].plain_text,
          locale: localePropList[index].select.name,
        });
      });
    });

    res.set(
      'Cache-Control',
      'public, max-age=3600, stale-if-error=604800, stale-while-revalidate=604800'
    );
    res.json({ results });
  } catch (error) {
    handleRestfulError(req, res, next, error);
  }
});

module.exports = router;
