<template>
  <img class="w-full max-w-[450px]" :src="image" />
</template>

<script>
const signedBookImage = require('./signed-book.png');

export default {
  name: 'NFTBookSignatureBanner',
  computed: {
    image() {
      return signedBookImage;
    },
  },
};
</script>
