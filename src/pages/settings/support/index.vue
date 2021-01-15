<template lang="pug">
  Spinner.mx-auto.my-96(v-if="!hasFetched")

  .px-8(v-else)

    h2.text-like-green.font-24.font-500 {{ $t('SupportersDashboard.Summary.Title') }}
    ul.list-reset.flex.bg-white.rounded-8.mt-24.px-16.py-8.text-12.text-gray-4a.leading-1_5(
      class="phone:px-8"
    )
      li.flex-1.m-8
        .text-24.text-gray-4a
          | {{ $t('SupportersDashboard.Summary.Data.Amount.Value', { amount: totalAmount }) }}
        .text-12.text-gray-4a
          | {{ $t('SupportersDashboard.Summary.Data.Amount.Label') }}
      li.flex-1.m-8
        .text-24.text-gray-4a
          | {{ count }}
        .text-12.text-gray-4a
          | {{ $tc('SupportersDashboard.Summary.Data.Subscribers', count, { count }) }}

    h2.mt-32.text-like-green.font-24.font-500 {{ $t('SupportersDashboard.List.Title') }}
    SupportersList(class="laptop:mx-32 tablet:mx-32")

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { CIVIC_LIKER_UNIT_PRICE } from '~/constant';

import Spinner from '~/components/Spinner/Spinner';
import SupportersList from '~/components/SupportersList/SupportersList';

export default {
  middleware: 'authenticated',
  components: {
    Spinner,
    SupportersList,
  },
  data() {
    return {
      hasFetched: false,
    };
  },
  computed: {
    ...mapGetters({
      count: 'getMySupportersCount',
      totalQuantity: 'getMySupportersTotalQuantity',
    }),
    totalAmount() {
      return this.totalQuantity * CIVIC_LIKER_UNIT_PRICE;
    },
  },
  mounted() {
    this.fetchSupportersIfNecessary();
  },
  methods: {
    ...mapActions(['fetchMySupporters']),

    async fetchSupportersIfNecessary() {
      if (!this.count) {
        await this.fetchMySupporters();
      }
      this.hasFetched = true;
    },
  },
};
</script>
