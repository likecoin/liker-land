<template>
  <div class="civic-liker-support-liker-view flex items-center">
    <Identity
      class="flex-no-shrink"
      :avatar-size="88"
      :avatar-url="avatarUrl"
      :is-avatar-outlined="isCivicLiker"
    />
    <div class="flex-grow ml-24">
      <div
        v-if="subtitle && isSubtitleTop"
        class="mb-8 text-14 mttext-gray-4a font-600"
      >{{ subtitle }}</div>
      <div class="text-32 text-like-green font-500">{{ displayName }}</div>
      <div
        v-if="subtitle && !isSubtitleTop"
        class="mt-8 text-14 mttext-gray-4a font-600"
      >{{ subtitle }}</div>
    </div>
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
    avatarUrl: {
      type: String,
      default: '',
    },
    isCivicLiker: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    isSubtitleTop: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
