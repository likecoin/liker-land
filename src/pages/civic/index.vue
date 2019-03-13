<template>
  <div>
    <div v-if="getUserIsCivicLiker">
      Already civic liker
    </div>
    <button
      v-else
      class="md-likecoin lc-font-size-16 lc-font-weight-600"
      @click="onClickButton"
    >
      Register
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['getUserIsCivicLiker']),
  },
  methods: {
    onClickButton() {
      this.$router.push({
        name: 'civic-register',
        query: this.$route.query,
      });
    },
  },
};
</script>
