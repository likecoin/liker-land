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
      <Label :text="$t('nft_details_page_label_loading')" align="center" />
      <ProgressIndicator />
    </div>
    <table
      v-else
      :class="['w-full', 'text-[14px]', 'mt-[24px]', 'max-w-[960px]']"
    >
      <thead :class="['border-b-shade-gray', 'border-b-[2px]']">
        <tr class="text-medium-gray">
          <th :class="['py-[12px]', 'text-[16px]', 'text-left']">
            {{ $t('gutenberg_dialog_title_no') }}
          </th>
          <th :class="['py-[12px]', 'text-[16px]', 'text-left']">
            {{ $t('gutenberg_dialog_title_classTitle') }}
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

            'transition-colors',
            'hover:bg-shade-gray',

            'cursor-pointer',
            {
              'cursor-not-allowed':
                !csvData[rowIndex].classId ||
                csvData[rowIndex].classId === 'failed',
            },
          ]"
          @click="
            () => {
              handleClickRow(csvData[rowIndex].classId);
            }
          "
        >
          <td :class="['px-[8px]', 'text-medium-gray']">{{ rowIndex + 1 }}</td>
          <td
            :class="[
              {
                '!text-shade-gray':
                  !csvData[rowIndex].classId ||
                  csvData[rowIndex].classId === 'failed',
              },
              'font-600',
              'py-[12px]',
            ]"
          >
            {{ row.classTitle }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchGutenbergCsv } from '~/util/api';
import csvParser from 'csv-parser';

const DISPLAY_COLUMN = ['classTitle', 'classId'];

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
      if (!classId || classId === 'failed') {
        return;
      }
      const url = this.$router.resolve(
        this.localeLocation({
          name: 'nft-class-classId',
          params: {
            classId,
          },
        })
      ).href;
      window.open(url, '_blank');
    },
  },
};
</script>
