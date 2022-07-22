import BookmarkIcon from '../Icon/BookmarkOutlined';

import Button from './Button';
import ButtonGroup from './ButtonGroup';

export default {
  title: 'ButtonGroup',
};

export const Default = () => ({
  components: {
    BookmarkIcon,
    Button,
    ButtonGroup,
  },
  template: `
    <ButtonGroup>
      <Button preset="translucent-dark" title="Button 1" />
      <Button preset="translucent-dark" title="Button 2" />
      <Button preset="translucent-dark">
        <BookmarkIcon />
      </Button>
    </ButtonGroup>
  `,
});
