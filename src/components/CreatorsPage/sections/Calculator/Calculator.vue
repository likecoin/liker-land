<template lang="pug">
  mixin Graphic
    img(
      class="phone:hidden tablet:hidden"
      style="width: 140px"
    )&attributes(attributes)

  mixin EarningsValue
    .text-like-cyan-light.text-24.font-500.leading-1&attributes(attributes)
      block

  mixin EarningsLabel
    .text-gray-e6.text-14.font-300
      block

  section.flex.items-center.pb-40
    +Graphic()(src="./assets/graphic-left.png")

    .rounded-14.flex-grow.mx-24.overflow-hidden
      .px-40.py-32.bg-white
        .flex.justify-between
          h2.text-like-green.text-16.font-600
            | {{ $t('CreatorsPageV2.Calculator.Title') }}
          img.ml-16.h-40(src="./assets/coin.png")

        .mt-24
          i18n(
            tag="div"
            path="CreatorsPageV2.Calculator.Slider.Subscriber"
          )
            span.text-24.font-600(place="count") {{ subscribersCount }}
          Slider(
            v-model="subscribersCount"
            :max="maxSubscribers"
            :min="1"
          )
        .mt-24
          i18n(
            tag="div"
            path="CreatorsPageV2.Calculator.Slider.Reader"
          )
            span.text-24.font-600(place="count") {{ readersCount }}
          Slider(
            v-model="readersCount"
            :max="maxReaders"
            :min="1"
          )

      .px-40.py-32.bg-like-green
        .flex.items-start
          .w-96
            +EarningsValue {{ formattedSubscriptionEarnings }}
            +EarningsLabel {{ $t('CreatorsPageV2.Calculator.Earnings.Subscription') }}

          .mx-40
            +EarningsValue +

          div
            +EarningsValue {{ formattedCreatorsFundEarnings }}
            +EarningsLabel {{ $t('CreatorsPageV2.Calculator.Earnings.CreatorsFund') }}

        .mt-16
          +EarningsValue()(
            class="text-like-cyan text-40"
          )
            | {{ formattedTotalEarnings }}
          +EarningsLabel {{ $t('CreatorsPageV2.Calculator.Earnings.Total') }}

    +Graphic()(src="./assets/graphic-right.png")
</template>

<script>
import Slider from '~/components/Slider/Slider';

export default {
  components: {
    Slider,
  },
  props: {
    subscriptionPrice: {
      type: Number,
      default: 5,
    },
    maxSubscribers: {
      type: Number,
      default: 200,
    },
    maxReaders: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      subscribersCount: 5,
      readersCount: 30,
    };
  },
  computed: {
    subscriptionEarnings() {
      return this.subscribersCount * this.subscriptionPrice * 0.95;
    },
    formattedSubscriptionEarnings() {
      return `$${this.subscriptionEarnings}`;
    },
    creatorsFundEarningsMin() {
      return this.readersCount * 0.009 + this.readersCount * 0.01;
    },
    creatorsFundEarningsMax() {
      return this.readersCount * 0.1;
    },
    formattedCreatorsFundEarnings() {
      const {
        creatorsFundEarningsMin: min,
        creatorsFundEarningsMax: max,
      } = this;
      return `$${min.toFixed(2)} - ${max.toFixed(2)}`;
    },
    formattedTotalEarnings() {
      const {
        subscriptionEarnings: base,
        creatorsFundEarningsMin: min,
        creatorsFundEarningsMax: max,
      } = this;
      return `$${(base + min).toFixed(2)} - ${(base + max).toFixed(2)}`;
    },
  },
};
</script>
