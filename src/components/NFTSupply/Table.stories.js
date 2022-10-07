import NFTSupplyTable from './Table';
import NFTSupplyRow from './Row';
import NFTSupplySlot from './Slot';

export default {
  title: 'NFTSupplyTable',
  args: {
    collectedCount: 0,
  },
  argTypes: {
    collectedCount: {
      type: { name: 'number', required: false },
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
