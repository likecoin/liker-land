<template>
  <Dialog
    :open="open"
    panel-container-class="phone:max-w-[520px] laptop:w-[520px]"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg"
    @close="$emit('close')"
  >
    <div class="flex gap-[8px]">
      <IconGift class="w-[32px] text-dark-gray" />
      <h1 class="text-like-cyan text-[32px] font-proxima font-[700]">
        {{ $t('nft_book_gift_dialog_title') }}
      </h1>
    </div>
    <Label
      class="text-medium-gray my-[12px]"
      :text="$t('nft_book_gift_dialog_description')"
    />
    <form class="flex-col w-full gap-[12px]" @submit.prevent="submitGiftInfo">
      <div
        class="flex w-full my-[8px] py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]"
      >
        <Label
          class="text-medium-gray"
          preset="p6"
          :text="$t('nft_book_gift_dialog_label_to_email')"
          align="center"
        />
        <input
          v-model="toEmail"
          required
          :placeholder="$t('nft_book_gift_dialog_placeholder_to_email')"
          type="input"
          class="w-full bg-transparent border-0 text-dark-gray focus-visible:outline-none"
          name="toEmail"
        />
      </div>
      <div
        class="flex w-full py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]"
      >
        <Label
          class="text-medium-gray"
          preset="p6"
          :text="$t('nft_book_gift_dialog_label_to_name')"
          align="center"
        />
        <input
          v-model="toName"
          required
          :placeholder="$t('nft_book_gift_dialog_placeholder_to_name')"
          type="input"
          class="w-full bg-transparent border-0 text-dark-gray focus-visible:outline-none"
          name="toName"
        />
      </div>
      <div
        class="flex-col w-full py-[10px] px-[16px] gap-[12px] rounded-[12px]"
      >
        <div class="flex gap-[8px]">
          <IconMessage class="text-dark-gray" />
          <Label
            class="text-medium-gray"
            preset="p6"
            :text="$t('nft_book_gift_dialog_label_message')"
            align="center"
          />
        </div>
        <textarea
          v-model="message"
          cols="20"
          class="w-full h-[20vh]"
          :placeholder="$t('nft_book_gift_dialog_placeholder_message')"
        ></textarea>
      </div>
      <div
        class="flex w-full py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]"
      >
        <Label
          class="text-medium-gray"
          preset="p6"
          :text="$t('nft_book_gift_dialog_label_from_name')"
          align="center"
        />
        <input
          v-model="fromName"
          required
          :placeholder="$t('nft_book_gift_dialog_placeholder_from_name')"
          type="input"
          class="w-full bg-transparent border-0 text-dark-gray focus-visible:outline-none"
          name="fromName"
        />
      </div>
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
    selectedValue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fromName: '',
      toName: '',
      toEmail: '',
      message: '',
    };
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
  },
};
</script>
