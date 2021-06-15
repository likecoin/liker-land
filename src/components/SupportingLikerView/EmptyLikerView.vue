<template>
  <div
    class="
      empty-liker-view
      rounded-8
      p-16
      text-center
      flex flex-col
      items-center
      border-gray-e6 border-2
    "
  >
    <svg
      class="mt-20"
      xmlns="http://www.w3.org/2000/svg"
      width="62"
      height="62"
      viewBox="0 0 62 62"
    >
      <circle
        cx="31"
        cy="31"
        r="29"
        fill="none"
        stroke="#e6e6e6"
        stroke-miterlimit="10"
        stroke-width="4"
      />
    </svg>
    <span class="mt-32 text-gray-9b text-14 font-400">{{
      $t('supporting_empty_view_description')
    }}</span>
    <nuxt-link
      class="mt-24 text-14 font-500 text-like-green underline"
      :to="{ name: 'civic' }"
    >{{ $t('supporting_empty_view_button') }}</nuxt-link>
  </div>
</template>
