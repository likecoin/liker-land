import Button from '../Button/Button';
import Identity from '../Identity/Identity';

import BookmarkIcon from '../Icon/BookmarkOutlined';

import Card from './Card';

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

export const Grid = (_, { argTypes }) => ({
  components: {
    Button,
    Card,
    Identity,
    BookmarkIcon,
  },
  props: Object.keys(argTypes),
  data() {
    return {
      items,
    };
  },
  template: `
    <div style="min-width: 600px">
      <Stack :column-min-width="288" :gutter-width="16" :gutter-height="24">
        <StackItem v-for="(item, i) in items" :key="i">
          <Card
            :title="item.title"
            :description="item.description"
            :image-src="item.imageSrc"
          >
            <template #footer-left>
              <Identity
                :avatar-url="item.userAvatarSrc"
                :display-name="item.userDisplayName"
              />
            </template>
            <template #footer-right>
              <Button preset="secondary">
                <BookmarkIcon />
              </Button>
            </template>
          </Card>
        </StackItem>
      </Stack>
    </div>
  `,
});

Grid.args = {
  items,
};

Grid.argTypes = {
  items: {
    control: {
      type: 'object',
    },
  },
};
