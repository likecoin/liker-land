<template>
  <div class="px-[32px] min-h-[414px]">
    <ul
      :class="[
        'absolute',
        'flex',
        'gap-[40px]',
        'min-h-[inherit]',
      ]"
    >
      <li
        v-for="index in 4"
        :key="`placeholder-${index}`"
        :class="[
          'flex',
          'flex-col',
          'min-w-[360px]',
          'animate-pulse',
        ]"
      >
        <div class="bg-shade-gray rounded-[14px] grow" />
        <div class="bg-shade-gray rounded-[8px] h-[32px] w-[70%] mt-[8px]" />
        <div class="flex justify-between mt-[16px]">
          <ul class="grid grid-flow-col gap-[8px]">
            <li
              v-for="j in 2"
              :key="`placeholder-${j}`"
            >
              <div class="bg-shade-gray rounded-[4px] h-[36px] w-[44px]" />
              <div class="bg-shade-gray rounded-[4px] h-[18px] w-[64px] mt-[4px]" />
            </li>
          </ul>
          <div class="bg-shade-gray rounded-[8px] w-[88px] h-[44px]" />
        </div>
      </li>
    </ul>
  </div>
</template>
