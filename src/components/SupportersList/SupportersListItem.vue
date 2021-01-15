<template lang="pug">
  .flex.items-center.justify-between.flex-wrap.pl-24.pr-32.py-16.rounded-8.bg-white(
    class="phone:px-12"
  )
    Identity.cursor-pointer(
      :avatar-url="supporter.avatar"
      :avatar-size="40"
      :is-avatar-outlined="supporter.isSubscribedCivicLiker"
      :display-name="supporter.displayName || likerId"
      display-name-class="ml-16"
      @click="onClickIdentity"
    )
    .text-right.ml-16
      .text-14.text-gray-4a
        span.font-emoji.mr-8 {{ emoji }}
        | {{ formattedAmount }}
      .text-10.text-gray-9b.mt-8 {{ formattedTimestamp }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import { CIVIC_LIKER_UNIT_PRICE } from '~/constant';
import { getPriceEmoji } from '~/util/civic';

import Identity from '../Identity/Identity';

export default {
  components: {
    Identity,
  },
  props: {
    likerId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters(['getUserInfoById']),
    amount() {
      return this.quantity * CIVIC_LIKER_UNIT_PRICE;
    },
    emoji() {
      return getPriceEmoji(this.amount);
    },
    formattedAmount() {
      return this.$t('SupportersList.Item.Amount', { amount: this.amount });
    },
    formattedTimestamp() {
      return dateFormat(new Date(this.timestamp), 'DD/MM/YYYY');
    },
    supporter() {
      return this.getUserInfoById(this.likerId) || {};
    },
  },
  mounted() {
    if (this.likerId && !this.getUserInfoById(this.likerId)) {
      try {
        this.fetchUserInfo(this.likerId);
      } catch {
        // no-op
      }
    }
  },
  methods: {
    ...mapActions(['fetchUserInfo']),

    onClickIdentity() {
      this.$router.push({ name: 'id', params: { id: this.likerId } });
    },
  },
};
</script>
