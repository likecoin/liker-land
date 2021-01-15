<template lang="pug">
  div
    .flex.justify-end
      .flex.items-center.relative.text-gray-4a.overflow-hidden
        span.text-12 {{ currentSorting }}
        DropdownIcon.w-24.h-24
        select.absolute.pin-y.pin-r.opacity-0.cursor-pointer(
          v-model="orderKey"
        )
          option(
            v-for="{ value, label } in sortingOptions"
            :key="value"
            :value="value"
          )
            | {{ label }}

    Transition(name="fade" mode="out-in")
      ul.list-reset(:key="orderKey")
        li.my-8(
          v-for="s in supporters"
          :key="s.id"
        )
          SupportersListItem(
            :liker-id="s.id"
            :quantity="s.quantity"
            :timestamp="s.ts"
          )
</template>

<script>
import { mapGetters } from 'vuex';

import SupportersListItem from './SupportersListItem';

export default {
  components: {
    DropdownIcon: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/arrow-bottom.svg'),
    SupportersListItem,
  },
  data() {
    return {
      orderKey: 'id',
    };
  },
  computed: {
    ...mapGetters(['getMySupporters']),

    supporters() {
      return this.getMySupporters.slice(0).sort((s1, s2) => {
        switch (this.orderKey) {
          case 'quantity':
            if (s1.quantity !== s2.quantity) {
              return s2.quantity - s1.quantity;
            }

          // eslint-disable-next-line no-fallthrough
          case 'ts':
            return s2.ts - s1.ts;

          case 'id':
          default:
            return s1.id.localeCompare(s2.id);
        }
      });
    },

    currentSorting() {
      return this.$t(`SupportersList.SortingOptions.${this.orderKey}`);
    },

    sortingOptions() {
      return ['id', 'ts', 'quantity'].map(value => ({
        value,
        label: this.$t(`SupportersList.SortingOptions.${value}`),
      }));
    },
  },
};
</script>
