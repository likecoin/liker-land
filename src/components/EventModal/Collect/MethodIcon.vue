<template>
  <IconLike v-if="type === 'crypto'" />
  <IconCreditCard v-else-if="type === 'stripe'" />
  <IconPrice v-else-if="type === 'free'" />
  <div v-else />
</template>
<script>
import IconCreditCard from '~/assets/icons/credit-card.svg?inline';
import IconLike from '~/assets/icons/like-icon.svg?inline';

export default {
  name: 'EventModalCollectMethodIcon',
  components: {
    IconLike,
    IconCreditCard,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
};
</script>
