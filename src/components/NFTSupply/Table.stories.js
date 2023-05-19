import { getPrice, getBatchStart } from '../../util/writing-nft';

import NFTSupplyTable from './Table';
import NFTSupplyRow from './Row';
import NFTSupplySlot from './Slot';

const basePrices = [...new Array(9)].map((_, index) =>
  getPrice(getBatchStart(index))
);

export default {
  title: 'NFTSupplyTable',
  args: {
    soldCount: 0,
    basePrice: basePrices[0],
  },
  argTypes: {
    soldCount: {
      type: { name: 'number', required: false },
    },
    basePrice: {
      type: { name: 'number', required: false },
      options: basePrices,
      control: { type: 'select' },
    },
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    NFTSupplyTable,
    NFTSupplyRow,
    NFTSupplySlot,
  },
  props: Object.keys(argTypes),
  template: `
    <NFTSupplyTable v-bind="$props" />
  `,
});
