import Identity from './Identity';

const defaultProps = {
  avatarSize: 40,
  avatarUrl: 'https://www.gravatar.com/avatar/?d=mp',
  isAvatarOutlined: true,
  isAvatarOutlineExtruded: true,
  isAvatarDisabled: false,
  displayName: 'Display Name',
};

export default {
  title: 'Identity',
  args: defaultProps,
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

export const Extruded = (_, { argTypes }) => ({
  components: {
    Identity,
  },
  props: Object.keys(argTypes),
  computed: {
    defaultProps() {
      return defaultProps;
    },
  },
  template: `
    <table cellpadding="10">
      <tr style="text-align:center">
        <td>Default</td>
        <td>Control</td>
      </tr>
      <tr>
        <td>
          <div style="margin:10;border: 1px dashed #e6e6e6">
            <Identity v-bind="defaultProps" />
          </div>
        </td>
        <td>
          <div style="margin:10;border: 1px dashed #e6e6e6">
            <Identity v-bind="$props" />
          </div>
        </td>
      </tr>
    </table>
  `,
});

Extruded.args = {
  isAvatarOutlineExtruded: false,
};
