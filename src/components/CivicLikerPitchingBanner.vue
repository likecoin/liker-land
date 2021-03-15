<template lang="pug">
  div
    .relative.overflow-hidden
      .absolute.pin.bg-cover(
        class="-m-20"
        :style="{ backgroundImage: `url(${src})`, filter: 'blur(20px)' }"
      )
      .relative.w-full.mx-auto(
        :style="{ maxWidth: '800px' }"
      )
        div(:style="{ paddingTop: '30%' }")
        img.absolute.pin.object-cover(:src="src" :alt="alt")
</template>

<script>
export default {
  name: 'CivicLikerPitchingBanner',
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
  },
};
</script>
