<template>
  <div class="civic-liker-welcome-view bg-white">
    <header class="civic-liker-welcome-view__header bg-like-green px-32 py-24">
      <slot name="header" />
    </header>
    <div class="">
      <div class="flex items-center py-24 px-32">
        <Identity
          class="flex-no-shrink"
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
      <div class="relative mx-32 p-32 pb-40 pr-72 border-1 border-gray-9b rounded-8">
        <i18n
          class="text-gray-4a text-24"
          path="CivicLikerWelcomeView.Price"
          :places="{ price }"
        />
        <i18n
          class="mt-8 text-gray-4a text-14 leading-1_5"
          path="CivicLikerWelcomeView.Benefits.SupportTheCreator.Description"
          tag="p"
          :places="{ price }"
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
        class="border-t-1 border-gray-e6 m-32"
      >
      <slot name="footer" />
    </div>
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
  }
}
</style>
