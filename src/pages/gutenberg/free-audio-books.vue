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
      v-if="!displayData.length && !searchKeyword"
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
      v-else-if="!displayData.length && searchKeyword"
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
                'cursor-not-allowed': !row.classId || row.classId === 'failed',
              },
            ]"
          >
            <NuxtLink
              v-if="row.classId && row.classId !== 'failed'"
              class="flex w-full"
              :to="
                localeLocation({
                  name: 'nft-class-classId',
                  params: {
                    classId: row.classId,
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
import csvParser from 'csv-parser';
import { fetchGutenbergCsv } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { APP_LIKE_CO_URL_BASE, EXTERNAL_HOST } from '~/constant';

const DISPLAY_NUMBER = 100;

export default {
  name: 'FreeAudioBooks',
  layout: 'default',
  async asyncData({ $api }) {
    const csvData = await $api.$get(fetchGutenbergCsv());
    const parsedData = await parseCSV(csvData);

    return { parsedData };
  },
  data() {
    return {
      parsedData: [],
      searchKeyword: '',
      currentDisplayNumber: DISPLAY_NUMBER,
      totalAmount: 0,
    };
  },
  head() {
    const scripts = [];
    if (this.generatedJSONLD) {
      scripts.push({
        type: 'application/ld+json',
        json: this.generatedJSONLD,
      });
    }
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
      script: scripts,
    };
  },
  computed: {
    filteredData() {
      if (!this.searchKeyword) {
        return this.parsedData;
      }
      const lowerCaseKeyword = this.searchKeyword.toLowerCase();
      const filtered = this.parsedData.filter(row =>
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
    generatedJSONLD() {
      return {
        '@context': 'https://schema.org',
        '@type': 'DataFeed',
        dataFeedElement: this.parsedData.map(row => ({
          '@type': 'Book',
          '@id': row.classId,
          name: row.classTitle,
          author: row.author,
          url: `${EXTERNAL_HOST}/nft/class/${row.classId}`,
          sameAs: `${APP_LIKE_CO_URL_BASE}/view/${encodeURIComponent(
            row.iscnPrefix
          )}`,
        })),
      };
    },
  },
  watch: {
    searchKeyword() {
      this.currentDisplayNumber = DISPLAY_NUMBER;
    },
  },
  methods: {
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
</script>
