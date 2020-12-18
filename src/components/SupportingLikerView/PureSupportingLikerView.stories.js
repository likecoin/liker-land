import PureSupportingLikerView from './PureSupportingLikerView';

export default {
  title: 'Pure Supporting Liker View',
  args: {
    avatarUrl: 'https://www.gravatar.com/avatar/?d=mp',
    displayName: 'Display Name',
    isCivicLiker: true,
  },
  argTypes: {
    onClickIdentity: { action: 'Clicked identity' },
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    PureSupportingLikerView,
  },
  props: Object.keys(argTypes),
  template: `
    <PureSupportingLikerView
      :avatar-url="avatarUrl"
      :display-name="displayName"
      :is-civic-liker="isCivicLiker"
      @click-identity="onClickIdentity"
    >
      <template #footer>
        <div
          class="text-24 text-gray-4a font-500"
        ><span class="font-emoji">☕️</span> 5 USD/mo</div>
        <a class="mt-8 text-12 text-like-green" href="#">Edit</a>
      </template>
    </PureSupportingLikerView>
  `,
});
