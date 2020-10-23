import Button from '../Button/Button';
import Identity from '../Identity/Identity';

import BookmarkIcon from '../Icon/BookmarkOutlined';

import Card from './Card';

export default {
  title: 'Card',
  args: {
    imageSrc: 'https://via.placeholder.com/300x200',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    description:
      'Vivamus convallis, libero eu dapibus efficitur, leo enim malesuada dolor, sodales interdum purus nibh a enim.',
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    Button,
    Card,
    Identity,
    BookmarkIcon,
  },
  props: Object.keys(argTypes),
  template: `
    <Card
      v-bind="{
        imageSrc,
        title,
        description,
      }"
    >
      <template #footer-left>
        <Identity
          url="https://www.gravatar.com/avatar/?d=mp"
          display-name="Lorem Ipsum"
        />
      </template>
      <template #footer-right>
        <Button preset="secondary">
          <BookmarkIcon />
        </Button>
      </template>
    </Card>
  `,
});
