<template>
  <ButtonV2
    class="w-full"
    preset="outline"
    v-bind="$attrs"
    :is-disabled="isDisabled"
    @click="handleClick"
  >
    <template #prepend>
      <slot v-if="$slots.prepend" name="prepend" />
      <EventModalCollectMethodIcon
        v-else
        :class="[{ 'w-[24px] h-[24px]': type !== 'free' }, 'text-like-green']"
        :type="type"
      />
    </template>
    <span class="w-full text-left font-600">{{ title }}</span>
    <template v-if="price" #append>
      <div class="flex items-center justify-end gap-[4px]">
        <div class="flex flex-col items-end">
          <div
            v-if="discountInfo"
            class="flex justify-end items-center gap-[4px]"
          >
            <span
              class="text-medium-gray line-through font-400 text-[10px] text-right"
            >
              {{ discountInfo.originalPriceInLIKE }}
            </span>
            <span class="text-danger font-400 text-[10px] text-right">
              {{
                $t('nft_collect_modal_method_like_discount', {
                  percentage: discountInfo.discountPercentage,
                })
              }}
            </span>
          </div>
          <span class="text-like-green font-600 text-[14px] text-right">
            <!-- This value is from formattedNFTPriceInLIKE -->
            {{ price }}
          </span>
        </div>
        <IconArrowLeft class="w-[16px] h-[16px] rotate-180" />
      </div>
    </template>
  </ButtonV2>
</template>

<script>
export default {
  name: 'EventModalCollectMethodButton',
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    discountInfo: {
      type: Object,
      default: undefined,
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.type);
    },
  },
};
</script>
