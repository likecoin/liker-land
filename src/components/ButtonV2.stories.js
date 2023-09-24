import Button from './ButtonV2';

export default {
  title: 'ButtonV2',
  args: {
    text: 'Title',
    theme: 'classic',
    preset: 'primary',
    href: 'example.com',
    isDisabled: false,
    to: { to: 'name' },
  },
  argTypes: {
    theme: {
      control: {
        type: 'select',
        options: ['classic', 'glow'],
      },
    },
    preset: {
      control: {
        type: 'select',
        options: [
          'primary',
          'secondary',
          'tertiary',
          'plain',
          'outline',
          'gradient',
          'cyan',
        ],
      },
    },
    to: {
      description: 'Nuxt link',
      control: {
        type: 'object',
      },
    },
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    Button,
  },
  props: Object.keys(argTypes),
  template: `
    <Button v-bind="$props" />
  `,
});
