<template>
  <div class="supporting-liker-view bg-white rounded-8 text-center flex flex-col">
    <div
      class="flex flex-col flex-grow items-center p-24 cursor-pointer"
      @click="$emit('click-identity')"
    >
      <Identity
        :avatar-url="avatarUrl"
        :avatar-size="64"
        :is-avatar-outlined="isCivicLiker"
      />
      <span class="mt-12 text-like-green text-20 font-500 underline">{{ displayName }}</span>
    </div>
    <div
      v-if="$slots.footer"
      class="border-gray-d8 border-t-1 px-20 py-16"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import Identity from '../Identity/Identity';

export default {
  name: 'PureSupportingLikerView',
  components: {
    Identity,
  },
  props: {
    avatarUrl: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    isCivicLiker: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
