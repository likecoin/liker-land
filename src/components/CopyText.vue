<template>
  <div class="copy-text">
    <input
      ref="text"
      :value="text"
      readonly
      @click="onClickText"
    >
    <div>
      <button
        v-clipboard:copy="text"
        v-clipboard:success="onCopy"
      >
        {{ $t(hasCopied ? 'copied' : 'copy') }}
      </button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'CopyText',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hasCopied: false,
    };
  },
  methods: {
    onCopy() {
      this.hasCopied = true;
      this.$emit('copy');
    },
    onClickText() {
      this.$refs.text.select();
    },
  },
};
</script>


<style lang="scss">
.copy-text {
  background: #e6e6e6;
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 20px;

  input {
    flex-grow: 1;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    background: none;
    font-family: 'Menlo', monospace;
    font-size: 14px;
    font-weight: 500;
  }

  div {
    flex-shrink: 0;
    min-width: 60px;
    padding-left: 8px;
    text-align: right;
  }

  button {
    @apply text-like-green;

    font-size: 12px;
    line-height: 24px;
    text-decoration: underline;
  }
}
</style>
