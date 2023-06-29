<template>
  <CivicPageV3 />
</template>

<script>
import CivicPageV3 from '~/components/CivicLikerV3/Page';

export default {
  components: {
    CivicPageV3,
  },
  middleware: 'authenticated',
};
</script>
