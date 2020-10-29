import BookmarkIcon from '../Icon/BookmarkOutlined';

import Button from './Button';

export default {
  title: 'Button',
  args: {
    title: 'Title',
    preset: 'primary',
    href: 'example.com',
    to: { to: 'name' },
  },
  argTypes: {
    preset: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'translucent-dark'],
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

export const Icon = (_, { argTypes }) => ({
  components: {
    Button,
    BookmarkIcon,
  },
  props: Object.keys(argTypes),
  template: `
    <Button v-bind="$props">
      <BookmarkIcon />
    </Button>
  `,
});

Icon.args = {
  title: '',
};
