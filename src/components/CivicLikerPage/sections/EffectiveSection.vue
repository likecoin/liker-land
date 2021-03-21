
<template lang="pug">
  section.text-center
    .max-w-phone.mx-auto.px-24
      h1.text-30.text-like-green.font-500
        | {{ $t('CLP.effective.title') }}
      p.mt-24.leading-1_5 {{ $t('CLP.effective.description') }}

    ul.list-reset.mt-16.justify-center(class="laptop:flex")
      li.w-full.max-w-300.mx-auto.p-24(class="phone:flex tablet:flex flex-col laptop:mx-0")
        svg.mx-auto.block(
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 316 316"
          :style="{ order: $slots.default ? 2 : 0, width: 256, margin: -30 }"
        )
          template(v-if="$slots.default")
            path.hidden(
              class="phone:block tablet:block"
              d="M158.33,315.32l19-19-5.66-5.66L162.34,300V252.93h-8V300L145,290.69l-5.65,5.66Z"
              fill="#f4bf7a"
            )
            path(
              class="phone:hidden tablet:hidden"
              d="M316.47,157.58l-19-19-5.66,5.66,9.31,9.31H254.07v8h47.08l-9.31,9.32,5.66,5.65Z"
              fill="#f4bf7a"
            )
          image(x="30" y="30" width="256" height="256" xlink:href="../assets/subscription.png")

        h2.text-20.text-like-green.font-500(class="laptop:mt-32")
          | {{ $t('CLP.effective.item1.title') }}
        p.mt-12(:class="{ 'phone:mb-32 tablet:mb-32': $slots.default }")
          | {{ $t('CLP.effective.item1.description') }}

      li.flex-shrink.items-center.flex.flex-col(class="laptop:pt-48")
        slot(name="center")
          svg.w-40.my-20.text-like-green.stroke-current(
            class="laptop:my-48"
            viewBox="0 0 40 40"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
          )
            line(x1="20" y1="2" x2="20" y2="38")
            line(x1="2" y1="20" x2="38" y2="20")

      li.w-full.max-w-300.mx-auto.p-24(class="laptop:mx-0")
        svg.mx-auto.block(
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 316 316"
          style="width:256px;margin:-30px"
        )
          template(v-if="$slots.default")
            path.hidden(
              class="phone:block tablet:block"
              d="M159-.55l-19,19,5.66,5.66L155,14.77V61.85h8V14.77l9.31,9.31,5.66-5.66Z"
              fill="#f4bf7a"
            )
            path(
              class="phone:hidden tablet:hidden"
              d="M.83,157.19l19,19,5.66-5.66-9.32-9.31H63.22v-8H16.14l9.32-9.31-5.66-5.66Z"
              fill="#f4bf7a"
            )
          image(x="30" y="30" width="256" height="256" xlink:href="../assets/creators-fund.png")

        h2.mt-32.text-20.text-like-green.font-500
          | {{ $t('CLP.effective.item2.title') }}
        p.mt-12 {{ $t('CLP.effective.item2.description') }}
</template>
