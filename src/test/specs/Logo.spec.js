import { mount } from '@vue/test-utils';
import test from 'ava';
import Logo from '../../assets/icons/logo.svg';

test('is a Vue instance', t => {
  const wrapper = mount(Logo);
  t.is(wrapper.isVueInstance(), true);
});
