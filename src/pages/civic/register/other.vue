<template>
  <div class="bg-white">
    <main class="page-content flex justify-center items-center p-16">
      <div>
        <h1>{{ $t('OtherPaymentInfo.title') }}</h1>
        <h3>{{ $t('OtherPaymentInfo.heading') }}</h3>
      </div>
      <p>{{ $t('OtherPaymentInfo.description') }}</p>
      <h2>{{ $t('OtherPaymentInfo.stepOne') }}</h2>
      <ul>
        <li>{{ $t('OtherPaymentInfo.FPSID') }}</li>
      </ul>
      <ul>
        <li>{{ $t('OtherPaymentInfo.PayMeQR') }}</li>
      </ul>
      <img :src="PayMeImage">
      <h2>{{ $t('OtherPaymentInfo.stepTwo') }}</h2>
      <i18n path="OtherPaymentInfo.EmailInstruction" tag="p" for="tos">
        <a href="mailto:team@like.co" rel="nofollow noopener noreferrer" target="_blank">team@like.co</a>
      </i18n>
      <p>{{ $t('OtherPaymentInfo.Ending') }}</p>
    </main>
  </div>
</template>

<script>
import IntercomMixin from '~/mixins/intercom';
import PayMeImage from '~/assets/images/civic/payme.jpg';

export default {
  middleware: 'authenticated',
  mixins: [IntercomMixin],
  data() {
    return {
      PayMeImage,
    };
  },
  asyncData({ store, redirect, query }) {
    if (
      store.getters.getUserIsCivicLiker &&
      !store.getters.getUserInfo.isCivicLikerRenewalPeriod
    ) {
      redirect({ name: 'settings-civic' });
    }
  },
};
</script>
