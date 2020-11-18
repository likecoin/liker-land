import CivicLikerSupportLikerView from './CivicLikerSupportLikerView';

export default {
  title: 'Civic Liker Support View',
};

export const LikerView = () => ({
  components: {
    CivicLikerSupportLikerView,
  },
  template: `
    <CivicLikerSupportLikerView
      avatar-url="https://www.gravatar.com/avatar/?d=mp"
      display-name="Kin Ko"
      subtitle="Be my Civic Liker"
      :is-civic-liker="true"
    />
  `,
});
