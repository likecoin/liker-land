<template>
  <div class="civic-liker-support-liker-view">
    <h2 class="text-14 text-center text-gray-4a">{{ $t('CivicLikerPitchingView.Subtitle') }}</h2>
    <h1 class="text-24 text-center text-like-green mt-8 mb-16">
      {{ $t('CivicLikerPitchingView.Title', { name: creatorDisplayName }) }}
    </h1>
    <div class="flex items-center justify-center px-8 tablet:px-20">
      <Identity
        class="shrink-0"
        :avatar-size="80"
        :avatar-url="supporterAvatarUrl"
        :is-avatar-outlined="isSupporterCivicLiker"
        :is-avatar-outline-extruded="false"
      />
      <div
        class="flex-shrink mx-12 w-full"
        style="max-width: 140px"
      >
        <img
          class="block w-full"
          src="./convert.svg?inline"
        >
      </div>
      <div class="relative shrink-0">
        <Identity
          :avatar-size="80"
          :avatar-url="creatorAvatarUrl"
          :is-avatar-outlined="isCreatorCivicLiker"
          :is-avatar-outline-extruded="false"
        />
        <svg
          class="absolute mt-8 mr-16 right-0 text-like-cyan-pale block"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="18"
          viewBox="0 0 24 18"
          style="top: 100%"
        >
          <path
            d="M18.9.5c-.3-.3-.6-.4-1-.5-.8 0-1.5.6-1.5 1.4C16.2 9.5 11.6 13.1 0 18h23.8c.8-6.1-.6-13-4.9-17.5z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
    <div class="mt-20 px-24 pt-16 pb-20 bg-like-cyan-pale rounded-14 whitespace-pre-wrap">{{ creatorPitch }}</div>
  </div>
</template>

<script>
import Identity from '../Identity/Identity';

export default {
  name: 'CivicLikerSupportLikerView',
  components: {
    Identity,
  },
  props: {
    isSupporterCivicLiker: {
      type: Boolean,
      default: false,
    },
    supporterAvatarUrl: {
      type: String,
      default: '',
    },
    isCreatorCivicLiker: {
      type: Boolean,
      default: false,
    },
    creatorDisplayName: {
      type: String,
      default: '',
    },
    creatorAvatarUrl: {
      type: String,
      default: '',
    },
    creatorPitch: {
      type: String,
      default: '',
    },
  },
};
</script>
