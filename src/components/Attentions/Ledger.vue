<template>
  <div
    :class="[
      'w-full',
      'max-w-[700px]',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'px-[44px]',
      'py-[24px]',
      'text-medium-gray',
    ]"
  >
    <div class="flex mr-0 sm:mr-[32px]">
      <IconAttention class="mr-[12px]" />
      <IconLedger />
    </div>
    <div class="whitespace-pre-line text-medium-gray">
      {{ $t('attention_ledger_not_support') }}
    </div>
  </div>
</template>
