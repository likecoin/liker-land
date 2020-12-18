import CivicLikerSupportAmountView from './CivicLikerSupportAmountView';
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

export const AmountView = (_, { argTypes }) => ({
  components: {
    CivicLikerSupportAmountView,
  },
  props: Object.keys(argTypes),
  template: `
    <CivicLikerSupportAmountView
      :hint-text="hintText"
      :price="price"
      :currency="currency"
      :period="period"
      :prefix="prefix"
      @click-add="onClickAdd"
    />
  `,
});

AmountView.args = {
  price: 5,
  currency: 'USD',
  period: 'mo',
  prefix: '☕️',
  hintText: 'Support kin ko monthly',
};

AmountView.argTypes = {
  onClickAdd: { action: 'Clicked add button' },
};
