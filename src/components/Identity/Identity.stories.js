import Identity from './Identity';

export default {
  title: 'Identity',
  args: {
    avatarSize: 40,
    avatarUrl: 'https://www.gravatar.com/avatar/?d=mp',
    isAvatarOutlined: true,
    isAvatarDisabled: false,
    displayName: 'Display Name',
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    Identity,
  },
  props: Object.keys(argTypes),
  template: `
    <Identity v-bind="$props" />
  `,
});

export const AvatarOnly = (_, { argTypes }) => ({
  components: {
    Identity,
  },
  props: Object.keys(argTypes),
  template: `
    <Identity v-bind="$props" />
  `,
});

AvatarOnly.args = {
  displayName: '',
};
