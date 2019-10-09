<template>
  <main class="page-content text-gray-4a text-left p-24 py-32 leading-1_5">
    <h1 class="text-like-green text-24">{{ $t('OtherPaymentInfo.title') }}</h1>
    <h3 class="italic text-18 text-gray-9b mt-8">{{ $t('OtherPaymentInfo.heading') }}</h3>
    <p class="mt-12">{{ $t('OtherPaymentInfo.description') }}</p>
    <h2 class="text-20 mt-24">{{ $t('OtherPaymentInfo.stepOne') }}</h2>
    <ul class="mt-16">
      <li class="mt-8">{{ $t('OtherPaymentInfo.FPSID') }}</li>
      <li class="mt-8">{{ $t('OtherPaymentInfo.PayMeQR') }}</li>
    </ul>
    <img
      class="mx-auto"
      :src="PayMeImage"
      width="290px"
      height="290px"
    >
    <h2 class="text-20 mt-24">{{ $t('OtherPaymentInfo.stepTwo') }}</h2>
    <i18n class="mt-24" path="OtherPaymentInfo.EmailInstruction" tag="p" for="tos">
      <a
        class="text-like-green"
        href="mailto:team@like.co"
        rel="nofollow noopener noreferrer"
        target="_blank"
      >team@like.co</a>
    </i18n>
    <p class="mt-16">{{ $t('OtherPaymentInfo.Ending') }}</p>
  </main>
</template>

<script>
import IntercomMixin from '~/mixins/intercom';
import PayMeImage from '~/assets/images/civic/payme.jpg';

export default {
  middleware: 'authenticated',
  layout: 'dialog',
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
