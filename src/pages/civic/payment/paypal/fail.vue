<template>
  <div>
    Payment failed...
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  middleware: 'authenticated',
  computed: {},
  mounted() {
    setTimeout(() => {
      this.$router.push({
        name: 'civic',
      });
    }, 3000);
  },
};
</script>
