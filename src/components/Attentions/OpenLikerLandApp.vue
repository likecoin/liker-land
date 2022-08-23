<template>
  <div
    :class="[
      'w-full',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'px-[44px]',
      'py-[32px]',
      'text-medium-gray',
    ]"
  >
    <div class="flex items-center">
      <IconAttention class="mr-[12px]" />
      <IconLikerLandApp :class="['inline', 'w-[32px]', 'h-[32px]']" />
    </div>
    <div class="whitespace-pre-line text-medium-gray">
      {{ $t('attention_likerland_openApp') }}
    </div>
  </div>
</template>
