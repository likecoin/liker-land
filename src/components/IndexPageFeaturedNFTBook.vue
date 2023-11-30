<template>
  <div
    :class="[
      'flex',
      'flex-col',
      isDirectionLeft ? 'desktop:flex-row-reverse' : 'desktop:flex-row',
      'items-center',
      'gap-[1.5rem]',
    ]"
  >
    <NFTBookItemCard
      class="shrink-0 w-full max-w-[292px]"
      :class-id="classId"
      preset="compact"
      :should-resize-src="false"
      @click-avatar="$emit('click-avatar', $event)"
    />
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
        {{ heading }}
      </h2>
      <p
        v-for="(pContent, index) in content.split('\\n')"
        :key="`p-${index}`"
        class="text-[1rem] mt-[0.5rem]"
      >
        {{ pContent }}
      </p>
      <ButtonV2
        class="mt-[1.5rem]"
        :text="$t('index_page_featured_nft_book_collect_button')"
        theme="glow"
        preset="tertiary"
        :to="nftCollectRoute"
        @click.native="handleClickCollect"
      />
    </div>
  </div>
</template>

<script>
import nftMixin from '~/mixins/nft';

export default {
  name: 'IndexPageFeaturedNFTBook',
  mixins: [nftMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
    direction: {
      type: String,
      default: 'left',
    },
  },
  computed: {
    isDirectionLeft() {
      return this.direction === 'left';
    },
    heading() {
      const key = `index_page_nft_book_${this.classId}_heading`;
      return this.$te(key) ? this.$t(key) : '<Placeholder>';
    },
    content() {
      const key = `index_page_nft_book_${this.classId}_content`;
      return this.$te(key) ? this.$t(key) : '<Placeholder>';
    },
  },
  methods: {
    handleClickCollect() {
      this.$emit('click-collect', this.classId);
    },
  },
};
</script>
