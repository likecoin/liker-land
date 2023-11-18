import NFTBookShelf from './Shelf';

export default {
  title: 'NFTBookShelf',
  argTypes: {
    itemCount: {
      type: { name: 'number', required: false, min: 1, max: 30, step: 1 },
      defaultValue: 4,
    },
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    NFTBookShelf,
  },
  props: Object.keys(argTypes),
  template: `
    <NFTBookShelf
      :items="Array(this.itemCount).fill('').map((_, index) => ({ classId: \`likernft\${index}\` }))"
      :is-dummy="true"
    />
  `,
});
