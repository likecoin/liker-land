import Button from '../Button/Button';

import Collapse from './Collapse';

export default {
  title: 'Collapse',
};

export const Default = () => ({
  components: {
    Button,
    Collapse,
  },
  data() {
    return {
      isShow: false,
    };
  },
  template: `
    <div>
      <Button
        title="Toggle"
        @click="isShow = !isShow"
      />
      <Collapse :is-show="isShow">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Duis congue nunc rhoncus lacus condimentum vestibulum.
        In bibendum varius neque, sed rhoncus mauris posuere sit
        amet. Integer at gravida ex, in tempor urna. Curabitur a
        aliquet felis.
      </Collapse>
    </div>
  `,
});
