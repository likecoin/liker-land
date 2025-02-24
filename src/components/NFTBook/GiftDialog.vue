<template>
  <Dialog
    :open="open"
    panel-container-class="phone:max-w-[520px] laptop:w-[520px]"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg"
    @close="$emit('close')"
  >
    <Label
      preset="h2"
      class="text-like-green"
      :text="$t('nft_book_gift_dialog_title')"
    >
      <template #prepend>
        <IconGift class="w-[32px] text-like-green" />
      </template>
    </Label>
    <div class="flex items-center gap-[12px] my-[12px] w-full flex-wrap">
      <NFTEditionSelectItemV2
        v-for="(item, index) in items"
        :key="index"
        :name="item.name"
        :price-label="item.priceLabel"
        :stock="item.stock"
        :is-selected="item.value === selectedValue"
        :current-price="item.price"
        :is-disabled="item.isPhysicalOnly"
        :default-price="item.defaultPrice"
        preset="dialog"
        @click="handleClickPriceSelectItem(item)"
      />
    </div>
    <Label
      class="text-dark-gray my-[12px]"
      :text="$t('nft_book_gift_dialog_description')"
    />
    <hr class="w-full border-shade-gray" />
    <form
      class="flex flex-col w-full gap-[12px] my-[20px]"
      @submit.prevent="submitGiftInfo"
    >
      <div class="flex flex-col">
        <Label
          preset="p6"
          class="text-medium-gray"
          :text="$t('nft_book_gift_dialog_label_to_email')"
        />
        <TextField
          v-model="toEmail"
          type="email"
          required
          class="mt-[4px]"
          :placeholder="$t('nft_book_gift_dialog_placeholder_to_email')"
        />
      </div>
      <div class="flex flex-col">
        <Label
          preset="p6"
          class="text-medium-gray"
          :text="$t('nft_book_gift_dialog_label_to_name')"
        />
        <TextField
          v-model="toName"
          required
          class="mt-[4px]"
          :placeholder="$t('nft_book_gift_dialog_placeholder_to_name')"
        />
      </div>
      <div class="flex flex-col justify-start">
        <Label
          preset="p6"
          content-class="flex-grow-0"
          class="text-medium-gray"
          :text="$t('nft_book_gift_dialog_label_message')"
        >
          <template #append>
            <IconMessage class="text-dark-gray" />
          </template>
        </Label>
        <TextField
          v-model="message"
          required
          class="mt-[4px]"
          :is-textarea="true"
          :placeholder="$t('nft_book_gift_dialog_placeholder_message')"
        />
      </div>
      <div class="flex flex-col">
        <Label
          preset="p6"
          class="text-medium-gray"
          :text="$t('nft_book_gift_dialog_label_from_name')"
        />
        <TextField
          v-model="fromName"
          required
          class="mt-[4px]"
          :placeholder="$t('nft_book_gift_dialog_placeholder_from_name')"
        />
      </div>
      <hr class="w-full border-shade-gray mt-[20px]" />
      <ButtonV2
        type="submit"
        preset="outline"
        class="mt-[12px]"
        :text="$t('nft_book_gift_dialog_label_submit')"
      />
    </form>
  </Dialog>
</template>

<script>
export default {
  name: 'NFTBookGiftDialog',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    prefillGiftInfo: {
      type: Object,
      default: () => ({
        fromName: '',
        toName: '',
        toEmail: '',
        message: '',
      }),
    },
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fromName: this.prefillGiftInfo?.fromName,
      toName: this.prefillGiftInfo?.toName,
      toEmail: this.prefillGiftInfo?.toEmail,
      message: this.prefillGiftInfo?.message,
      selectedValue: this.value,
    };
  },
  watch: {
    open(open) {
      if (open) {
        // NOTE: If the selected item is out of stock or is physical only, select another item.
        let selectedItem = this.items.find(item => item.value === this.value);
        if (
          !selectedItem ||
          selectedItem.stock <= 0 ||
          selectedItem.isPhysicalOnly
        ) {
          selectedItem = this.items.find(
            item =>
              item.index !== selectedItem.index &&
              !item.isPhysicalOnly &&
              item.stock > 0
          );
          this.selectedValue = selectedItem?.value ?? this.value;
        } else {
          this.selectedValue = this.value;
        }
      }
    },
    prefillGiftInfo: {
      handler(newVal) {
        this.fromName = newVal.fromName;
        this.toName = newVal.toName;
        this.toEmail = newVal.toEmail;
        this.message = newVal.message;
      },
      deep: true,
    },
  },
  methods: {
    submitGiftInfo() {
      this.$emit('submit', {
        selectedValue: this.selectedValue,
        giftInfo: {
          fromName: this.fromName,
          toName: this.toName,
          toEmail: this.toEmail,
          message: this.message,
        },
      });
    },
    handleClickPriceSelectItem({ value }) {
      if (this.selectedValue === value) return;
      this.selectedValue = value;
    },
  },
};
</script>
