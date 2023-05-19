import NFTEditionSelect from './NFTEditionSelect';

export default {
  title: 'NFTEditionSelect',
  argTypes: {
    items: {
      type: { name: 'object', required: false },
    },
    value: {
      type: { name: 'string', required: false },
    },
  },
};

export const Single = (_, { argTypes }) => ({
  components: {
    NFTEditionSelect,
  },
  props: Object.keys(argTypes),
  template: `
    <NFTEditionSelect v-bind="$props" />
  `,
});

Single.args = {
  items: [
    {
      name: 'Standard Edition',
      priceLabel: 'US$ 32',
      value: 'standard',
      stock: 50,
    },
  ],
  value: 'standard',
};

export const SingleSoldOut = (_, { argTypes }) => ({
  components: {
    NFTEditionSelect,
  },
  props: Object.keys(argTypes),
  template: `
    <NFTEditionSelect v-bind="$props" />
  `,
});

SingleSoldOut.args = {
  items: [
    {
      name: 'Standard Edition',
      priceLabel: 'US$ 32',
      value: 'standard',
      stock: 0,
    },
  ],
  value: 'standard',
};

export const Multiple = (_, { argTypes }) => ({
  components: {
    NFTEditionSelect,
  },
  props: Object.keys(argTypes),
  template: `
    <NFTEditionSelect v-bind="$props" />
  `,
});

Multiple.args = {
  items: [
    {
      name: 'Standard Edition',
      priceLabel: 'US$ 32',
      value: 'standard',
      stock: 50,
    },
    {
      name: 'Premium Edition',
      priceLabel: 'US$ 48',
      value: 'premium',
      stock: 10,
    },
    {
      name: 'Deluxe Edition',
      priceLabel: 'US$ 96',
      value: 'deluxe',
      stock: 0,
    },
  ],
  value: 'premium',
};

export const MultipleSoldOut = (_, { argTypes }) => ({
  components: {
    NFTEditionSelect,
  },
  props: Object.keys(argTypes),
  template: `
    <NFTEditionSelect v-bind="$props" />
  `,
});

MultipleSoldOut.args = {
  items: [
    {
      name: 'Standard Edition',
      priceLabel: 'US$ 32',
      value: 'standard',
      stock: 0,
    },
    {
      name: 'Premium Edition',
      priceLabel: 'US$ 48',
      value: 'premium',
      stock: 0,
    },
    {
      name: 'Deluxe Edition',
      priceLabel: 'US$ 96',
      value: 'deluxe',
      stock: 0,
    },
  ],
  value: 'standard',
};
