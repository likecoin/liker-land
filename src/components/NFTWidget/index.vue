<template>
  <div class="rounded-[16px]">
    <div class="bg-white p-[16px] rounded-[16px]">
      <NFTWidgetContentPreview
        :title="title"
        :description="description"
        :img-src="imgSrc"
      />
      <NFTWidgetActionBar
        class="mt-[8px]"
        :price="price"
        :collect-button-label="collectButtonLabel"
        @collect="handleCollect"
      />
    </div>
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
      // TODO
    },
  },
};
</script>
