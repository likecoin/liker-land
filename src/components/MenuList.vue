<template>
  <div
    :class="[
      'min-w-[150px]',
      'w-max',
      'bg-white',
      'border-shade-gray',
      'border-[1px]',
      'rounded-[24px]',
      'text-dark-gray',
      'text-left',
      'p-[12px]',
      'grid grid-cols-1',
      'divide-y',
      'divide-shade-gray'
    ]"
  >
    <slot />
  </div>
</template>
