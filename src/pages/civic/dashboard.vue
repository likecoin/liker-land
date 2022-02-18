<template>
  <CivicPageV3 />
</template>

<script>
import CivicPageV3 from '~/components/CivicLikerV3/Page';

export default {
  middleware: 'authenticated',
  components: {
    CivicPageV3,
  },
};
</script>
