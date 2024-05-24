<template>
  <div class="flex flex-col">
    <Label
      :text="$t('listing_page_sorter')"
      align="center"
      class="mb-[12px] text-[18px] font-600"
    />
    <div class="w-full border-b-[1px] border-shade-gray my-[8px]" />
    <ul class="flex flex-col gap-[12px] p-[12px]">
      <li
        v-for="(item, i) of availableSorting"
        :key="i"
        :class="[
          'px-[16px] py-[12px] border-[1px] border-shade-gray flex justify-between items-center cursor-pointer rounded-[6px]',
          { 'border-like-green': item.value === currentSelect },
        ]"
      >
        <label class="flex justify-between w-full">
          <p>{{ item.text }}</p>
          <input
            type="radio"
            name="sorting"
            :checked="item.value === currentSelect"
            @change="() => (currentSelect = item.value)"
          />
        </label>
      </li>
    </ul>
    <div class="flex gap-[12px] px-[12px]">
      <ButtonV2 class="flex-auto w-full" @click="handleConfirm">確定</ButtonV2>
    </div>
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
    defaultOption: {
      type: String,
      default: 'recommend',
    },
  },
  data() {
    return {
      currentSelect: this.selectedSorting,
    };
  },
  methods: {
    handleConfirm() {
      this.$emit('click-confirm-change', this.currentSelect);
    },
  },
};
</script>
