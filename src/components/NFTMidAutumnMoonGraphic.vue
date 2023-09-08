<template>
  <div>
    <div class="absolute left-[50%] w-screen h-[250px] overflow-hidden translate-x-[-50%]">
      <svg
        class="absolute right-[50%] translate-y-[74px]"
        width="421"
        height="108"
        viewBox="0 0 421 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          v-for="index in 5"
          :key="`path-${index}`"
          :transform="`translate(${(index - 1) * 3} ${(index - 1) * -3})`"
          d="M406 55H311.5C302.94 55 296 61.9396 296 70.5V70.5C296 79.0604 302.94 86 311.5 86H344C349.799 86 354.5 90.701 354.5 96.5V96.5C354.5 102.299 349.799 107 344 107H129C123.477 107 119 102.523 119 97V97C119 91.4772 123.477 87 129 87H158.25C163.911 87 168.5 82.4109 168.5 76.75V76.75C168.5 71.0891 163.911 66.5 158.25 66.5H90C81.4396 66.5 74.5 59.5604 74.5 51V51C74.5 42.4396 81.4396 35.5 90 35.5H128.75C134.135 35.5 138.5 31.1348 138.5 25.75V25.75C138.5 20.3652 134.135 16 128.75 16H0"
          stroke="#B1A370"
        />
      </svg>
      <svg
        class="absolute left-[50%] translate-y-[74px]"
        width="441"
        height="175"
        viewBox="0 0 441 175"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          v-for="index in 5"
          :key="`path-${index}`"
          :transform="`translate(${(index - 1) * 3} ${(index - 1) * -3})`"
          d="M0 16H162.5C172.717 16 181 24.2827 181 34.5V34.5C181 44.7173 172.717 53 162.5 53H70.5C58.6259 53 49 62.6259 49 74.5V74.5C49 86.3741 58.6259 96 70.5 96H309.5C316.404 96 322 101.596 322 108.5V108.5C322 115.404 316.404 121 309.5 121H224.5C217.044 121 211 127.044 211 134.5V134.5C211 141.956 217.044 148 224.5 148H269C276.18 148 282 153.82 282 161V161C282 168.18 287.82 174 295 174H426" stroke="#B1A370"
        />
      </svg>
    </div>

    <svg class="relative" width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nft-mid-autumn-moon-graphic-gradient" x1="22.661" y1="18.5665" x2="114.076" y2="131.812" gradientUnits="userSpaceOnUse">
          <stop offset="0.0729167" stop-color="#FBF1BB" />
          <stop offset="0.682292" stop-color="#FFCF96" />
          <stop offset="0.947917" stop-color="#FFE7D0" />
        </linearGradient>
      </defs>
      <circle cx="72.4419" cy="72.4419" r="67.5581" fill="url(#nft-mid-autumn-moon-graphic-gradient)" />
      <circle cx="67.5581" cy="67.5581" r="67.0581" stroke="black" />
    </svg>
  </div>
</template>
