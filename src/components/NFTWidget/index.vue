<template>
  <div class="rounded-[16px]">
    <NFTWidgetBaseCard>
      <NFTWidgetContentPreview
        :title="title"
        :description="description"
        :img-src="imgSrc"
      />
      <NFTWidgetCollectActionBar
        class="mt-[8px]"
        :price="price"
        :collect-button-title="collectButtonLabel"
        @collect="handleCollect"
      />
    </NFTWidgetBaseCard>
  </div>
</template>

<script>
export default {
  props: {
    imgSrc: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: undefined,
    },
    collectButtonLabel: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    handleCollect() {
      this.$emit('collect');
    },
  },
};
</script>
