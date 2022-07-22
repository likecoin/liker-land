import Button from '../LegacyButton/Button';
import Identity from '../Identity/Identity';
import Placeholder from '../Placeholder/Placeholder';

import BookmarkIcon from '../Icon/BookmarkOutlined';

import Card from './PureCard';

const items = [
  {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    description:
      'Vivamus convallis, libero eu dapibus efficitur, leo enim malesuada dolor, sodales interdum purus nibh a enim.',
    imageSrc: 'https://via.placeholder.com/300x200',
    userAvatarSrc: 'https://www.gravatar.com/avatar/?d=mp',
    userDisplayName: 'Lorem Ipsum',
  },
  {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    description:
      'Vivamus convallis, libero eu dapibus efficitur, leo enim malesuada dolor, sodales interdum purus nibh a enim.',
    imageSrc: 'https://via.placeholder.com/300x300',
    userAvatarSrc: 'https://www.gravatar.com/avatar/?d=mp',
    userDisplayName: 'Lorem Ipsum',
  },
  {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    description:
      'Vivamus convallis, libero eu dapibus efficitur, leo enim malesuada dolor, sodales interdum purus nibh a enim.',
    imageSrc: 'https://via.placeholder.com/400x200',
    userAvatarSrc: 'https://www.gravatar.com/avatar/?d=mp',
    userDisplayName: 'Lorem Ipsum',
  },
  {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    description:
      'Vivamus convallis, libero eu dapibus efficitur, leo enim malesuada dolor, sodales interdum purus nibh a enim.',
    imageSrc: 'https://via.placeholder.com/300x400',
    userAvatarSrc: 'https://www.gravatar.com/avatar/?d=mp',
    userDisplayName: 'Lorem Ipsum',
  },
];

export default {
  title: 'Card',
};

export const Default = (_, { argTypes }) => ({
  components: {
    Button,
    Card,
    Identity,
    BookmarkIcon,
  },
  props: Object.keys(argTypes),
  data() {
    return {
      userAvatarURL: items[0].userAvatarSrc,
      userDisplayName: items[0].userDisplayName,
    };
  },
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
          :avatar-url="userAvatarURL"
          :display-name="userDisplayName"
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

Default.args = {
  imageSrc: items[0].imageSrc,
  title: items[0].title,
  description: items[0].description,
};

export const CardPlaceholder = () => ({
  components: {
    Card,
    Placeholder,
  },
  template: `
    <div style="width: 600px">
      <Card>
        <Placeholder style="width: 50%;height: 16px" />
        <Placeholder style="width: 100%;height: 16px;margin-top: 12px" />
        <Placeholder style="width: 70%;height: 16px;margin-top: 8px" />
      </Card>
      <Card style="margin-top: 24px">
        <Placeholder style="width: 60%;height: 16px" />
        <Placeholder style="width: 100%;height: 16px;margin-top: 12px" />
        <Placeholder style="width: 100%;height: 16px;margin-top: 12px" />
        <Placeholder style="width: 40%;height: 16px;margin-top: 8px" />
      </Card>
    </div>
  `,
});

CardPlaceholder.storyName = 'Placeholder';
