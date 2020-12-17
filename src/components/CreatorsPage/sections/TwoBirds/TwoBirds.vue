
<template lang="pug">
  section.text-center
    .max-w-phone.mx-auto.mt-80.px-24
      h1.text-30.text-like-green.font-500
        | {{ $t('CreatorsPageV2.TwoBirds.Title') }}
      p.mt-24 {{ $t('CreatorsPageV2.TwoBirds.Description') }}
    ul.list-reset.my-16(class="laptop:flex")
      li.p-24(class="laptop:flex-1")
        img.mx-auto.block(
          src="./assets/subscription.png"
        )
        h2.mt-32.text-20.text-like-green.font-500
          | {{ $t('CreatorsPageV2.TwoBirds.Birds[0].Title') }}
        p.mt-12 {{ $t('CreatorsPageV2.TwoBirds.Birds[0].Description') }}

      li.flex-shrink(class="laptop:pt-40")
        svg.w-40.my-40.text-like-green.stroke-current(
          viewBox="0 0 40 40"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
        )
          line(x1="20" y1="2" x2="20" y2="38")
          line(x1="2" y1="20" x2="38" y2="20")

      li.p-24(class="laptop:flex-1")
        img.mx-auto.block(
          src="./assets/creators-fund.png"
        )
        h2.mt-32.text-20.text-like-green.font-500
          | {{ $t('CreatorsPageV2.TwoBirds.Birds[1].Title') }}
        p.mt-12 {{ $t('CreatorsPageV2.TwoBirds.Birds[1].Description') }}
</template>
