import CivicLikerWelcomeView from './CivicLikerWelcomeView';

export default {
  title: 'Civic Liker Welcome',
};

export const Default = () => ({
  components: {
    CivicLikerWelcomeView,
  },
  template: `
    <CivicLikerWelcomeView
      :price="5"
      referrer-avatar-url="https://www.gravatar.com/avatar/?d=mp"
      referrer-display-name="Kin Ko"
      :is-referrer-civic-liker="true"
    />
  `,
});
