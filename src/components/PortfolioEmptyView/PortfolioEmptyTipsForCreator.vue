<template lang="pug">
  mixin Bullet
    span.w-24.h-24.mr-16.shrink-0.flex.items-center.justify-center.border.border-current.rounded-full.font-600
      block

  .text-gray-9b.leading-1_25
    svg.mx-auto.block(viewBox="0 0 160 82" style="width:160px")
      image(xlink:href="./figure.svg?inline" width="160" height="82")
      path(:d="figurePath" fill="#9b9b9b")

    .mt-16.text-center.text-16 {{ title }}

    .border-t.border-gray-e6.mt-24.pt-24

      .flex.items-center
        +Bullet
          template(v-if="isCivicLiker")
            svg.w-12(viewBox="0 0 12.07 10.01")
              polyline.stroke-current(
                points="1.5 6.08 4.45 8.51 10.57 1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              )
          template(v-else) 1
        i18n.text-gray-4a(
          tag="div"
          :path="step1TranslationPath"
          :places="{ button: $t('PortfolioEmptyView.Button') }"
        )
          NuxtLink.text-gray-4a.underline(
            v-if="!isCivicLiker"
            :to="{ name: 'civic' }"
            place="button"
          )
            | {{ $t('PortfolioEmptyView.Button') }}

      .flex.items-center.mt-16
        +Bullet 2
        .text-gray-4a {{ step2 }}
</template>

<script>
export default {
  props: {
    preset: {
      type: String,
      default: 'works',
    },
    isCivicLiker: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    figurePath() {
      return this.preset === 'works'
        ? 'M48.92,50.44a1,1,0,0,1,.89-1,6,6,0,0,0,5.09-5.09,1,1,0,1,1,2,.27,8,8,0,0,1-6.86,6.85,1,1,0,0,1-1.15-.88.61.61,0,0,1,0-.14m0,4.36v.09a1,1,0,0,0,1.11.94A12.29,12.29,0,0,0,61.3,44.56a1,1,0,1,0-2-.17,10.23,10.23,0,0,1-9.41,9.39,1,1,0,0,0-.94,1m1.75-8A1.65,1.65,0,1,0,49,45.18a1.64,1.64,0,0,0,1.64,1.64'
        : 'M54.92 48.08a3.5 3.5 0 012.49.88 3.17 3.17 0 01.93 2.4 3.51 3.51 0 01-1.12 2.78 4.68 4.68 0 01-3.18 1 6.21 6.21 0 01-2.91-.57v-2a6 6 0 001.36.5 5.6 5.6 0 001.47.2c1.39 0 2.08-.57 2.08-1.71s-.72-1.63-2.16-1.63A4.91 4.91 0 0053 50a6.57 6.57 0 00-.77.16l-.9-.49.4-5.49h5.87v1.93h-3.85l-.2 2.12.26-.05a4.59 4.59 0 011.11-.1';
    },
    title() {
      return this.$t(
        this.preset === 'works'
          ? 'PortfolioEmptyView.Works.Title'
          : 'PortfolioEmptyView.SuperLiked.Title'
      );
    },
    step1TranslationPath() {
      return this.preset === 'works'
        ? 'PortfolioEmptyView.Works.Step1'
        : 'PortfolioEmptyView.SuperLiked.Step1';
    },
    step2() {
      return this.$t(
        this.preset === 'works'
          ? 'PortfolioEmptyView.Works.Step2'
          : 'PortfolioEmptyView.SuperLiked.Step2'
      );
    },
  },
};
</script>
