<template>
  <ToolTips :tool-tip-text="$t('tooltip_share')">
    <div
      :class="[
        'flex',
        'flex-shrink',
        'items-center',
        'justify-center',
        'w-[34px]',
        'h-[34px]',
        'bg-shade-gray',
        'text-dark-gray',
        'rounded-full',
        'cursor-pointer',
        'hover:bg-light-gray',
        'transition',
        'duration-200',
      ]"
      @click="$emit('copy')"
    >
      <IconShare />
    </div>
  </ToolTips>
</template>
