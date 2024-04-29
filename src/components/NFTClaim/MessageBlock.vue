<template>
  <div
    class="flex flex-col items-start gap-[12px] relative pl-[24px] pr-[16px] py-[13px] border-[1px] border-shade-gray shadow-md rounded-[20px] rounded-bl-[8px] bg-white w-full"
  >
    <div
      class="flex justify-start items-end gap-[18px] mt-[-22px] mb-[12px] w-full"
    >
      <Identity
        class="flex-shrink-0 "
        :avatar-url="avatarUrl"
        :avatar-size="40"
      />
      <div class="w-[80%] whitespace-normal">
        <p class="text-black break-words font-600 text-[16px]">
          {{
            $t('nft_claim_claimed_message_title', { name: creatorDisplayName })
          }}
        </p>
      </div>
    </div>
    <p class="text-black whitespace-pre-wrap font-200">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'NFTClaimMessageBlock',
  props: {
    avatarUrl: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    creatorDisplayName: { type: String, default: '' },
  },
};
</script>
