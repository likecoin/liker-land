<template>
  <div
    :class="[
      'group',

      'relative',
      'flex',
      'flex-col',

      'laptop:h-full',

      'laptop:p-[32px]',
      'laptop:pt-[24px]',

      'text-white laptop:text-like-green',
      'font-serif',

      'laptop:bg-gradient-to-b',
      'from-[#F9FEFF]',
      'to-[#E8FCFF]',
      'laptop:border-[#EBEBEB]',
      'laptop:border-[1px]',
      'laptop:rounded-[24px]',
    ]"
  >
    <header class="flex items-center gap-[12px] laptop:block">
      <picture>
        <source media="(min-width: 768px)" :srcset="iconSrc" />
        <img
          class="w-[48px] h-[48]px desktop:w-[70px] desktop:h-[70px]"
          :src="iconSrcWhite"
          loading="lazy"
        />
      </picture>

      <h4 class="text-[32px] font-600 laptop:mt-[32px]" v-text="title" />
    </header>

    <p class="mt-[16px]" v-text="description" />

    <div
      :class="[
        'hidden laptop:block',

        'absolute',
        'top-[45%]',
        'inset-x-0',
        'bottom-0',

        'flex',
        'items-end',

        'mt-[24px]',
        'px-[32px]',
        'py-[24px]',

        'bg-gradient-to-b',
        'from-[#E8FCFF00]',
        'to-[#E8FCFF]',
        'to-90%',
        'rounded-b-[inherit]',

        'opacity-0',
        'group-hover:opacity-100',
        'transition-opacity',

        'pointer-events-none',
      ]"
    >
      <ButtonV2
        class="pointer-events-auto bg-white font-sans border-like-green"
        :text="$t('landing_page_feature_item_learn_more_button')"
        :href="href"
        preset="outline"
        target="_blank"
        rel="noopener"
        @click="$emit('click')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPageFeatureItem',
  props: {
    iconSrc: {
      type: String,
      default: '',
    },
    iconSrcWhite: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
};
</script>
