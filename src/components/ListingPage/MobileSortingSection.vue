<template>
  <div class="flex flex-col">
    <ul class="flex flex-col gap-[12px] p-[12px]">
      <li
        v-for="(item, i) of availableSorting"
        :key="i"
        :class="[
          'px-[16px] py-[12px] border-[1px] border-shade-gray flex justify-between items-center cursor-pointer rounded-[6px]',
          { 'border-like-green': item.value === currentSelect },
        ]"
      >
        <label class="flex justify-between items-center w-full">
          <p>{{ item.text }}</p>
          <input
            class="accent-like-green"
            type="radio"
            name="sorting"
            :checked="item.value === currentSelect"
            @change="() => (currentSelect = item.value)"
          />
        </label>
      </li>
    </ul>

    <footer class="grid grid-cols-2 gap-[12px] px-[12px]">
      <ButtonV2 preset="tertiary" @click="handleReset">{{
        $t('listing_page_button_reset')
      }}</ButtonV2>
      <ButtonV2 @click="handleConfirm">{{
        $t('listing_page_button_confirm')
      }}</ButtonV2>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MobileSortingSection',
  props: {
    availableSorting: {
      type: Array,
      default: () => [],
    },
    selectedSorting: {
      type: String,
      default: '',
    },
    defaultSorting: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      currentSelect: this.selectedSorting,
    };
  },
  methods: {
    handleReset() {
      this.currentSelect = this.defaultSorting;
    },
    handleConfirm() {
      this.$emit('change-sorting', this.currentSelect);
    },
  },
};
</script>
