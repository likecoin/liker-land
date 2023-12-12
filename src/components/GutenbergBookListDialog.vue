<template>
  <Dialog
    :open="isOpenDialog"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg"
    @close="$emit('close')"
  >
    <div class="flex w-full">
      <table class="w-full">
        <thead class="w-full">
          <tr>
            <th v-for="(header, index) in csvHeader" :key="index">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in csvData" :key="rowIndex">
            <td v-for="(column, columnIndex) in row" :key="columnIndex">
              {{ column }}
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
    await this.loadCSVFile();
  },
  methods: {
    async loadCSVFile() {
      try {
        const response = await this.$api.$get(fetchGutenbergCsv());
        const parsedData = [];
        response
          .trim()
          .split('\n')
          .forEach(line => {
            const row = line.split(',');
            parsedData.push(row);
          });
        this.csvHeader = [...parsedData[0]];
        this.csvData = parsedData.slice(1);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading CSV file:', error);
      }
    },
  },
};
</script>
