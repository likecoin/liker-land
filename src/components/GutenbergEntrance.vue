<template>
  <div
    :class="[
      'flex',
      'flex-col',
      isDirectionLeft ? 'desktop:flex-row-reverse' : 'desktop:flex-row',
      'items-center',
      'gap-[1rem] laptop:gap-[1.5rem]',
    ]"
  >
    <div class="flex flex-shrink-0 relative mt-[48px]">
      <div
        :class="[
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'gap-[36px]',
          'z-[1]',
          'pb-[48px]',
          'px-[32px]',
          'bg-white',
          'rounded-[32px]',
        ]"
      >
        <img
          src="~/assets/images/gutenberg/blende.png"
          :class="['w-full', 'max-w-[204px]', 'mt-[-48px]']"
          alt=""
        />
        <Label
          align="center"
          class="text-dark-gray"
          :text="$t('index_page_nft_book_gutenberg_title')"
          preset="h4"
        />
        <Label
          class="text-[16px] text-like-green"
          align="center"
          :text="$t('index_page_nft_book_gutenberg_from')"
        />
      </div>
    </div>

    <div
      :class="[
        'relative',
        'flex',
        'flex-col',
        'items-center desktop:items-start',
        'desktop:justify-center',
        'flex-grow',
        'min-h-[300px]',
        isDirectionLeft ? 'desktop:pr-[10rem]' : 'desktop:pl-[10rem]',
        'desktop:py-[4rem]',
        'desktop:bg-white',
        isDirectionLeft ? 'desktop:rounded-r-full' : 'desktop:rounded-l-full',
      ]"
    >
      <IndexPageFeaturedNFTBookDeco
        v-for="i in 2"
        :key="`deco-${i}`"
        :class="[
          'hidden desktop:block',
          'absolute',
          'mx-[3rem]',
          (isDirectionLeft && i === 1) || (!isDirectionLeft && i === 2)
            ? 'top-0 left-0 translate-y-[-50%]'
            : 'bottom-0 right-0 translate-y-[50%]',
        ]"
        :shape="isDirectionLeft ? 'star' : 'circle'"
        :variant="i"
      />
      <div
        :class="[
          'absolute',
          'hidden desktop:block',
          'inset-y-0',
          'w-screen',
          isDirectionLeft ? 'right-full' : 'left-full',
          'bg-white',
        ]"
      />
      <h2
        :class="[
          'text-[1rem]',
          'font-[600]',
          'text-like-green',
          'text-center desktop:text-left',
          'whitespace-pre-line',
        ]"
      >
        {{ $t('index_page_nft_book_gutenberg_heading') }}
      </h2>
      <p class="text-[1rem] mt-[0.5rem]">
        {{ $t('index_page_nft_book_gutenberg_content') }}
      </p>
      <ButtonV2
        class="mt-[1.5rem]"
        :text="$t('index_page_nft_book_gutenberg_more')"
        theme="glow"
        preset="tertiary"
        :to="localeLocation({ name: 'gutenberg' })"
        @click.native="handleClickCollectGutenberg"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPageFeaturedNFTBook',
  props: {
    direction: {
      type: String,
      default: 'right',
    },
  },
  computed: {
    isDirectionLeft() {
      return this.direction === 'left';
    },
  },
  methods: {
    handleClickCollect() {
      this.$emit('click-gutenberg');
    },
  },
};
</script>
