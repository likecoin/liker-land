import Placeholder from './Placeholder';

export default {
  title: 'Placeholder',
  args: {
    style: 'width:100px; height:44px',
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    Placeholder,
  },
  props: Object.keys(argTypes),
  template: `
    <Placeholder :style="style" />
  `,
});
