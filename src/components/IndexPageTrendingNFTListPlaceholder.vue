<template>
  <div class="px-[32px] min-h-[425px]">
    <ul
      :class="[
        'grid',
        'laptop:grid-cols-2 desktop:grid-cols-3',
        'gap-[40px]',
        'w-full',
        'max-w-[1024px]',
        'min-h-[inherit]',
        'mx-auto',
      ]"
    >
      <li
        v-for="index in 3"
        :key="`placeholder-${index}`"
        :class="[
          { 'hidden': index !== 1 },
          { 'laptop:block': index === 2 },
          { 'desktop:block': index === 3 },
          'bg-shade-gray',
          'rounded-[14px]',
          'animate-pulse',
        ]"
      />
    </ul>
  </div>
</template>
