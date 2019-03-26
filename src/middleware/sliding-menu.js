import { UI_TOGGLE_SLIDING_MENU } from '@/store/mutation-types';

export default function(context) {
  context.app.store.commit(UI_TOGGLE_SLIDING_MENU, false);
}
