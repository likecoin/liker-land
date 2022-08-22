<template>
  <div
    :class="[
      'w-full',
      'max-w-[350px]',
      'flex',
      'flex-row',
      'items-center',
      'justify-center',
      'my-[16px]',
      'text-medium-gray',
    ]"
  >
    <div class="mr-0 sm:mr-[32px]">
      <IconAttention class="mr-[12px]" />
    </div>
    <div class="whitespace-pre-line text-red">
      {{ $t('error.not.support.mobile') }}
    </div>
  </div>
</template>
