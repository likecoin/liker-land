<template>
  <div
    class="fixed top-0 left-0 z-50 w-full h-screen bg-black bg-opacity-[30%]"
  >
    <div
      class="flex flex-col items-center gap-[22px] w-full bg-white px-[18px] py-[42px]"
    >
      <div
        class="flex items-center justify-between w-full text-like-green mb-[40px]"
      >
        <NuxtLink
          class="w-[90px] transition-transform hover:scale-105 active:scale-100"
          :disabled="localeLocation(getHomeRoute).name === $route.name"
          :to="localeLocation(getHomeRoute)"
        >
          <Logo class="fill-current" />
        </NuxtLink>
        <div
          class="flex justify-center items-center cursor-pointer w-[40px] h-[40px]"
          @click="close"
        >
          <IconClose class="w-[20px]" />
        </div>
      </div>
      <slot />
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Logo from '~/assets/icons/logo.svg?inline';

export default {
  components: {
    Logo,
  },
  computed: {
    ...mapGetters(['getHomeRoute']),
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>
