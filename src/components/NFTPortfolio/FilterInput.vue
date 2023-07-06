<template>
  <div class="flex w-full py-[10px] px-[16px] gap-[12px]">
    <input
      type="input"
      class="w-full bg-transparent border-0 focus-visible:outline-none"
      :placeholder="$t('order_menu_filter_by_input')"
      @input="$emit('handle-input-change', $event.target.value);"
    >
    <IconSearch class="text-dark-gray" />
  </div>
</template>
<script>
export default {
  name: 'NFTPortfolioFilterInput',
};
</script>
