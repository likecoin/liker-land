<template>
  <div class="flex flex-col items-center">
    <ul
      :class="[
        'grid',
        'grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3',
        'justify-center',
        'gap-[48px]',
        'sm:px-[48px]',
      ]"
    >
      <li
        v-for="({ classId }, index) in items"
        :id="classId"
        :key="classId"
        class="max-w-[220px]"
      >
        <NFTBookItemCard
          :class-id="classId"
          preset="shelf"
          :shelf-class="[
            // NOTE: Make the shelf appear to be continuous.
            { 'sm:rounded-l-[0px]': index % 2 !== 0 && index % 3 === 1 },
            { 'desktop:rounded-l-[0px]': index % 3 === 2 },
          ]"
          @click.native="$emit('click-item', classId)"
          @click-avatar="$emit('click-item-avatar', classId)"
        />
      </li>
      {{ /* NOTE: A dummy to make the book shelf extend to the right if only 1 book in 2 columns */ }}
      <li
        v-for="i in 2"
        :key="`dummy-${i}`"
        :class="[
          'hidden',
          { 'sm:block desktop:!hidden': i === 1 && items.length % 2 > 0 },
          { 'desktop:block': items.length % 3 > 0 },
          'relative',
          'w-full',
          'max-w-[220px]',
          'h-[290px]',
        ]"
      >
        <div
          :class="[
            'absolute',
            'inset-x-[-48px]',
            'inset-y-0',
            'mt-[48px]',
            'bg-like-cyan-pale',
            'rounded-r-[32px]',
          ]"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NFTBookShelf',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
