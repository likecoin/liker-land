<template>
  <div class="flex flex-col items-center justify-center w-full px-[24px]">
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

    <div class="flex justify-center mb-[24px] w-full max-w-[960px]">
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
    </div>

    <div
      v-if="!csvData.length"
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
    <table
      v-else
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
          <th :class="['py-[12px]', 'text-[16px]', 'text-left']">
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
          v-for="(row, rowIndex) in csvData"
          :key="rowIndex"
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
    <div
      v-if="csvData.length"
      class="flex flex-col justify-center items-center fixed right-[12px] sm:right-[60px] bottom-[20px] gap-[12px]"
    >
      <div
        class="px-[12px] py-[8px] rounded-[32px] cursor-pointer border-[1px] border-like-green bg-light-gray text-like-green duration-75 hover:bg-shade-gray"
        @click="scrollToTop"
      >
        <IconScrollToTop />
      </div>
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

export default {
  name: 'FreeAudioBooks',
  layout: 'default',
  data() {
    return {
      csvData: [],
      csvHeader: [],
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
  async mounted() {
    await this.loadCSVFile(DISPLAY_COLUMN);
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
  },
};
</script>
