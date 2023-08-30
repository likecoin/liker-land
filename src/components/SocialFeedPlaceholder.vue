<template>
  <div :class="['w-full', 'flex', 'flex-col', 'items-stretch', 'gap-[3rem]']">
    <div
      v-for="[nameWidthClass, cardHeightClass] in [
        ['w-[180px]', 'min-h-[10vh]'],
        ['w-[140px]', 'min-h-[20vh]'],
        ['w-[120px]', 'min-h-[15vh]'],
      ]"
      :key="cardHeightClass"
      class="animate-pulse"
    >
      <div class="flex items-start gap-[0.5rem]">
        <div class="rounded-full w-[40px] h-[40px] bg-shade-gray" />
        <div>
          <div
            :class="[
              nameWidthClass,
              'rounded-[4px]',
              'h-[24px]',
              'bg-shade-gray',
            ]"
          />
          <div class="mt-[2px] rounded-[4px] w-[80px] h-[20px] bg-shade-gray" />
        </div>
      </div>
      <CardV2 :class="[cardHeightClass, 'mt-[1rem]', 'bg-shade-gray']" />
    </div>
  </div>
</template>
