<template>
  <div>
    Payment success...
    Might take a few minutes to process the payment
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {},
  mounted() {
    this.setUserCivicLiker();
    setTimeout(() => {
      this.$router.push({
        name: 'index',
      });
    }, 3000);
  },
  methods: {
    ...mapActions(['setUserCivicLiker']),
  },
};
</script>
