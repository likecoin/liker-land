<template>
  <div class="whitespace-pre-line">{{ sanitizedValue || $t('nft_message_empty') }}</div>
</template>

<script>
export default {
  name: 'NFTMessageText',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    sanitizedValue() {
      return this.value.replace(/\\n/g, '\n');
    },
  },
};
</script>
