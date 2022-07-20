<template>
  <div class="civic-liker-welcome-view bg-white">
    <header class="civic-liker-welcome-view__header bg-like-green px-32 py-24 phone:px-16">
      <slot name="header" />
    </header>
    <div class="flex items-center pt-24 pb-16 px-32 phone:px-24">
      <Identity
        :class="['shrink-0', { 'ml-4': isReferrerCivicLiker }]"
        :avatar-size="60"
        :avatar-url="referrerAvatarUrl"
        :is-avatar-outlined="isReferrerCivicLiker"
      />
      <i18n
        class="flex-grow ml-20 text-24 text-like-green font-400 leading-1_5"
        path="CivicLikerWelcomeView.Congratulation"
        :places="{ name: referrerDisplayName }"
      ><br place="br"></i18n>
    </div>

    <hr class="border-t-1 border-gray-e6 mx-32 mb-24 phone:mx-24">

    <div class="relative ml-64 mr-80 p-32 pb-40 pr-72 border-1 border-gray-9b rounded-8 phone:mx-24 phone:px-24">
      <img
        class="absolute right-0 -mr-48 phone:w-64 phone:block phone:mx-auto phone:relative"
        src="./check.png"
        role="presentation"
        style="width:96px"
      >
      <i18n
        class="text-gray-4a text-24 phone:mt-16 phone:text-center"
        path="CivicLikerWelcomeView.Price"
        tag="div"
        :places="{ price }"
      ><span v-if="priceEmoji" class="font-emoji" place="emoji">{{ priceEmoji }}</span>
      </i18n>
      <i18n
        class="mt-8 text-gray-4a text-14 leading-1_5"
        path="CivicLikerWelcomeView.Benefits.SupportTheCreator.Description"
        tag="p"
        :places="{ price, name: referrerDisplayName }"
      >
        <i18n
          class="text-like-green"
          place="title"
          tag="span"
          path="CivicLikerWelcomeView.Benefits.SupportTheCreator.Title"
        />
      </i18n>
      <hr class="border-t-1 border-gray-e6 m-0 my-16">
      <i18n
        class="mt-24 text-gray-4a text-14 leading-1_5"
        path="CivicLikerWelcomeView.Benefits.DontMissAPixel.Description"
        tag="p"
      >
        <i18n
          class="text-like-green"
          place="title"
          tag="span"
          path="CivicLikerWelcomeView.Benefits.DontMissAPixel.Title"
        />
      </i18n>
      <i18n
        class="mt-24 text-gray-4a text-14 leading-1_5"
        path="CivicLikerWelcomeView.Benefits.ContributeToTheCommunity.Description"
        tag="p"
      >
        <i18n
          class="text-like-green"
          place="title"
          tag="span"
          path="CivicLikerWelcomeView.Benefits.ContributeToTheCommunity.Title"
        />
      </i18n>
      <i18n
        class="mt-24 text-gray-4a text-14 leading-1_5"
        path="CivicLikerWelcomeView.Benefits.SharingGoodContent.Description"
        tag="p"
      >
        <i18n
          class="text-like-green"
          place="title"
          tag="span"
          path="CivicLikerWelcomeView.Benefits.SharingGoodContent.Title"
        />
      </i18n>
    </div>
    <hr
      v-if="$slots.footer"
      class="border-t-1 border-gray-e6 m-24"
    >
    <slot name="footer" />
  </div>
</template>

<script>
import Identity from '../Identity/Identity';

export default {
  name: 'CivicLikerWelcomeView',
  components: {
    Identity,
  },
  props: {
    price: {
      type: Number,
      default: 1,
    },
    priceEmoji: {
      type: String,
      default: '',
    },
    referrerDisplayName: {
      type: String,
      default: '',
    },
    referrerAvatarUrl: {
      type: String,
      default: '',
    },
    isReferrerCivicLiker: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.civic-liker-welcome-view {
  width: 100%;
  max-width: 600px;

  &__header {
    min-height: 190px;
    background-image: url('./banner.jpg');
    background-size: cover;
    background-position: center;
  }
}
</style>
