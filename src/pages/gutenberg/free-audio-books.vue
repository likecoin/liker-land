<template>
  <div
    class="flex flex-col items-center justify-center w-full px-[24px] pb-[2rem]"
  >
    <Label
      :class="[
        'text-[36px]',
        'laptop:text-[52px]',

        'text-like-green',
        'my-[24px]',
      ]"
      align="center"
      :text="$t('gutenberg_dialog_title')"
    />
    <i18n
      :class="[
        'text-like-green',
        'text-left',
        'whitespace-pre-line',
        'text-center',
        'mb-[24px]',
      ]"
      tag="div"
      path="gutenbergFreeAudioBooksPage_description"
    >
      <a
        href="https://www.gutenberg.org/"
        target="_blank"
        rel="noopener"
        class="underline"
        place="ProjectGutenberg"
        >{{ $t('gutenberg_external_link_gutenberg') }}</a
      >
      <a
        href="https://like.co"
        target="_blank"
        rel="noopener"
        class="underline"
        place="LikeCoin"
        >{{ $t('gutenberg_external_link_likecoin') }}</a
      >
      <a
        href="https://liker.land/store"
        target="_blank"
        rel="noopener"
        class="underline"
        place="bookstore"
        >{{ $t('gutenberg_external_link_bookstore') }}</a
      >
    </i18n>

    <div class="flex justify-between mb-[24px] w-full max-w-[960px]">
      <ButtonV2
        preset="plain"
        class="text-medium-gray"
        :text="$t('gutenbergFreeAudioBooksPage_button_back')"
        @click="handleGoToPGPage"
      >
        <template #prepend>
          <IconArrowLeft class="w-[20px]" />
        </template>
      </ButtonV2>
      <div class="flex justify-end items-center gap-[4px]">
        <IconSearch />
        <input
          v-model="searchKeyword"
          class="w-full bg-transparent border-0 focus-visible:outline-none"
          type="text"
          :placeholder="$t('gutenberg_search_placeholder')"
          @change="handleInputChange"
        />
      </div>
    </div>

    <div
      v-if="isLoadingCSV"
      :class="[
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-[24px]',
      ]"
    >
      <ProgressIndicator />
    </div>
    <div
      v-else-if="!isLoadingCSV && !displayData.length"
      :class="[
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-[24px]',
      ]"
    >
      {{ $t('gutenberg_search_empty') }}
    </div>
    <table
      v-else-if="displayData.length"
      :class="[
        'w-full',
        'table-auto',
        'sm:table-fixed',
        'text-[14px]',
        'my-[24px]',
        'max-w-[960px]',
      ]"
    >
      <thead :class="['border-b-shade-gray', 'border-b-[2px]']">
        <tr class="text-medium-gray">
          <th :class="['py-[12px]', 'text-[16px]', 'text-left', 'w-[48px]']">
            {{ $t('gutenberg_dialog_title_no') }}
          </th>
          <th :class="['py-[12px]', 'text-[16px]', 'text-left']">
            {{ $t('gutenberg_dialog_title_classTitle') }}
          </th>
          <th :class="['py-[12px]', 'text-[16px]', 'text-left']">
            {{ $t('gutenberg_dialog_title_author') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in displayData"
          :key="`${row.classTitle}-${rowIndex}`"
          :class="[
            'text-[16px]',
            'text-like-green',
            'border-b-shade-gray',
            'border-b-[1px]',
            'py-[12px]',
          ]"
        >
          <td class="px-[8px] text-medium-gray">
            {{ rowIndex + 1 }}
          </td>
          <td
            :class="[
              'font-600',
              'py-[12px]',
              'transition-colors',
              'hover:bg-shade-gray',

              'cursor-pointer',
              {
                'cursor-not-allowed':
                  !csvData[rowIndex].classId ||
                  csvData[rowIndex].classId === 'failed',
              },
            ]"
          >
            <NuxtLink
              v-if="
                csvData[rowIndex].classId &&
                  csvData[rowIndex].classId !== 'failed'
              "
              class="flex w-full"
              :to="
                localeLocation({
                  name: 'nft-class-classId',
                  params: {
                    classId: csvData[rowIndex].classId,
                  },
                })
              "
              target="_blank"
            >
              {{ row.classTitle }}
            </NuxtLink>
            <span v-else>
              {{ row.classTitle }}
            </span>
          </td>
          <td>
            {{ row.author }}
          </td>
        </tr>
      </tbody>
    </table>
    <ButtonV2
      v-if="filteredData.length && filteredData.length > currentDisplayNumber"
      :text="$t('gutenberg_search_load_more')"
      @click="handleLoadMore"
    />
    <div
      v-if="displayData.length"
      class="sticky bottom-0 w-full flex flex-row justify-center items-center gap-[12px] p-[1rem] pt-[2rem] bg-gradient-to-t from-gray-f7"
    >
      <ButtonV2
        :circle="true"
        theme="glow"
        preset="tertiary"
        size="small"
        @click="scrollToTop"
      >
        <IconScrollToTop />
      </ButtonV2>
      <ButtonV2
        :text="$t('index_page_hero_enter_book_store')"
        theme="glow"
        preset="secondary"
        :to="localeLocation({ name: 'store' })"
        @click.native="handleGoToStorePage"
      />
    </div>
  </div>
</template>

<script>
import { fetchGutenbergCsv } from '~/util/api';
import csvParser from 'csv-parser';
import { logTrackerEvent } from '~/util/EventLogger';

const DISPLAY_COLUMN = ['classTitle', 'classId', 'author'];
const DISPLAY_NUMBER = 100;

export default {
  name: 'FreeAudioBooks',
  layout: 'default',
  async asyncData({ app, $api }) {
    const csvData = await $api.$get(fetchGutenbergCsv());
    const parsedData = await parseCSV(csvData);
    const jsonLd = generateJSONLD(parsedData);

    // eslint-disable-next-line no-param-reassign
    app.head.script = app.head.script || [];
    app.head.script.push({
      type: 'application/ld+json',
      json: jsonLd,
    });
  },
  data() {
    return {
      csvData: [],
      csvHeader: [],
      searchKeyword: '',
      currentDisplayNumber: DISPLAY_NUMBER,
      totalAmount: 0,
      isLoadingCSV: false,
    };
  },
  head() {
    return {
      title: this.$t('gutenbergFreeAudioBooksPage_og_title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('gutenbergFreeAudioBooksPage_og_title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('gutenbergFreeAudioBooksPage_og_description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('gutenbergFreeAudioBooksPage_og_description'),
        },
      ],
    };
  },
  computed: {
    filteredData() {
      if (!this.searchKeyword) {
        return this.csvData;
      }
      const lowerCaseKeyword = this.searchKeyword.toLowerCase();
      const filtered = this.csvData.filter(row =>
        row.classTitle
          .toString()
          .toLowerCase()
          .includes(lowerCaseKeyword)
      );
      return filtered;
    },
    displayData() {
      return this.filteredData.slice(0, this.currentDisplayNumber);
    },
  },
  watch: {
    searchKeyword() {
      this.currentDisplayNumber = DISPLAY_NUMBER;
    },
  },
  async mounted() {
    this.isLoadingCSV = true;
    await this.loadCSVFile(DISPLAY_COLUMN);
    this.isLoadingCSV = false;
  },

  methods: {
    async loadCSVFile(displayColumn) {
      this.csvHeader = displayColumn;
      try {
        const response = await this.$api.$get(fetchGutenbergCsv());
        const parsedData = [];

        const csvStream = csvParser({ headers: false });

        csvStream.write(response);
        csvStream.end();

        csvStream.on('data', record => {
          parsedData.push(record);
        });

        csvStream.on('end', () => {
          const headerValues = Object.values(parsedData[0]);
          const headerMap = [];

          displayColumn.forEach(name => {
            const num = headerValues.indexOf(name);
            if (num !== -1) {
              headerMap.push(num);
            }
          });
          const selectedData = parsedData.map(row => {
            const selectedRow = {};
            headerMap.forEach(index => {
              const columnName = headerValues[index];
              selectedRow[columnName] = row[index];
            });
            return selectedRow;
          });

          if (selectedData && selectedData.length) {
            this.csvData = selectedData.splice(1);
          } else {
            this.csvData = [];
          }
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading CSV file:', error);
      }
    },

    handleClickRow(classId) {
      logTrackerEvent(this, 'Gutenberg', 'clickDownload', classId, 1);
    },
    handleGoToPGPage() {
      logTrackerEvent(this, 'Gutenberg', 'clickBackToPG', '', 1);
      this.$router.push(
        this.localeLocation({
          name: 'gutenberg',
        })
      );
    },
    handleGoToStorePage() {
      logTrackerEvent(this, 'Gutenberg', 'clickBackToStorePage', '', 1);
      this.$router.push(
        this.localeLocation({
          name: 'store',
        })
      );
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleLoadMore() {
      this.currentDisplayNumber += 100;
    },
    handleInputChange(value) {
      logTrackerEvent(this, 'Gutenberg', 'inputChange', value.target.value, 1);
    },
  },
};

function parseCSV(csvData) {
  return new Promise((resolve, reject) => {
    const parsedData = [];
    const csvStream = csvParser();

    csvStream.on('data', record => {
      parsedData.push(record);
    });

    csvStream.on('end', () => {
      resolve(parsedData);
    });

    csvStream.on('error', err => {
      reject(err);
    });

    csvStream.write(csvData);
    csvStream.end();
  });
}

function generateJSONLD(data) {
  if (!Array.isArray(data)) {
    return {};
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: data.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.classTitle,
      author: item.author,
      classId: item.classId,
    })),
  };
}
</script>
