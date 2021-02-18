<template lang="pug">
  Spinner.mx-auto.my-96(v-if="!hasFetched")

  .px-8.pb-32(v-else)

    h2.text-like-green.font-24.font-500(v-if="count")
      | {{ $t('SettingsSupportPage.Title.SponsorLink') }}
    EasySetup.mt-24(
      preset="sponsor-link"
      :liker-id="likerId"
    )

    h2.mt-32.text-like-green.font-24.font-500 {{ $t('SupportersDashboard.Summary.Title') }}
    ul.list-reset.flex.bg-white.rounded-8.mt-24.px-16.py-8.text-12.text-gray-4a.leading-1_5(
      :class="['phone:px-8', { 'opacity-50 select-none': !count }]"
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

    template(v-if="count")
      h2.mt-32.text-like-green.font-24.font-500 {{ $t('SupportersDashboard.List.Title') }}
      SupportersList(class="laptop:mx-32 tablet:mx-32")

    template(v-else)
      .bg-white.rounded-8.mt-48.pt-32.pb-48.text-center
        h2.text-like-green.font-24.font-500 {{ $t('SupportersDashboard.Empty.Setup') }}

        EasySetup.mt-24.rounded-8.px-48(
          class="phone:px-16"
          preset="grow-supporters"
          :liker-id="likerId"
        )

      .text-center.mt-16
        NuxtLink.text-like-green.text-14(
          class="hover:underline"
          :to="{ name: 'creators-setup' }"
        )
          | {{ $t('learnMore') }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { CIVIC_LIKER_UNIT_PRICE } from '~/constant';

import Button from '~/components/Button/Button';
import EasySetup from '~/components/CreatorsPage/sections/EasySetup/EasySetup';
import Spinner from '~/components/Spinner/Spinner';
import SupportersList from '~/components/SupportersList/SupportersList';

export default {
  middleware: 'authenticated',
  components: {
    Button,
    EasySetup,
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
      likerId: 'getUserId',
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
      try {
        if (!this.count) {
          await this.fetchMySupporters();
        }
      } finally {
        this.hasFetched = true;
      }
    },
  },
};
</script>
