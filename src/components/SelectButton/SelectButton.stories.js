import SelectButton from './SelectButton';

export default {
  title: 'SelectButton',
  args: {
    isSelected: false,
  },
  argTypes: {
    onClick: { action: 'Clicked' },
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    SelectButton,
  },
  props: Object.keys(argTypes),
  template: `
    <SelectButton :is-selected="isSelected" @click="onClick">
      Title
    </SelectButton>
  `,
});

export const Selected = (_, { argTypes }) => ({
  components: {
    SelectButton,
  },
  props: Object.keys(argTypes),
  template: `
    <SelectButton :is-selected="isSelected" @click="onClick">
      <span class="font-emoji">☕️</span> Coffee
    </SelectButton>
  `,
});

Selected.args = {
  isSelected: true,
};
