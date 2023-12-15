<template>
  <Dialog
    :open="isOpenDialog"
    class="w-full max-w-[900px]"
    :header-text="$t('gutenberg_dialog_title')"
    panel-component="CardV2"
    panel-container-class="!max-w-[920px]"
    panel-class="overflow-y-scroll shadow-lg"
    @close="$emit('close')"
  >
    <div class="flex w-full">
      <table class="w-full text-[14px]">
        <thead class="border-b-shade-gray border-b-[2px]">
          <tr class="text-medium-gray">
            <th class="py-[12px] text-[14px] text-left">
              {{ $t('gutenberg_dialog_title_classTitle') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in csvData"
            :key="rowIndex"
            :class="[
              'py-[12px] cursor-pointer border-b-shade-gray border-b-[1px] text-dark-gray hover:bg-light-gray transition-colors',
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
            <td
              :class="{
                '!text-shade-gray':
                  !csvData[rowIndex].classId ||
                  csvData[rowIndex].classId === 'failed',
              }"
            >
              {{ row.classTitle }}
            </td>
            <td>
              {{ row.editionTitleEn }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Dialog>
</template>

<script>
import { ellipsis } from '~/util/ui';
import { fetchGutenbergCsv } from '~/util/api';
import csvParser from 'csv-parser';

const DISPLAY_COLUMN = ['classTitle', 'classId'];

export default {
  filters: {
    ellipsis,
  },
  props: {
    isOpenDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      csvData: [],
      csvHeader: [],
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
