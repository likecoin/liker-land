<template lang="pug">
  section.pt-40.text-center
    h1.text-30.text-like-green.font-500
      | {{ $t('CreatorsPageV2.BetterWorld.Title') }}
    ul.list-disc.my-16(class="laptop:flex")
      li.p-24(class="laptop:w-1/3")
        img.mx-auto.block(
          src="./assets/open-and-share.png"
          width="112px"
        )
        h2.mt-32.text-20.text-like-green.font-500
          | {{ $t('CreatorsPageV2.BetterWorld.World[0].Title') }}
        p.mt-12 {{ $t('CreatorsPageV2.BetterWorld.World[0].Description') }}
      li.p-24(class="laptop:w-1/3")
        img.mx-auto.block(
          src="./assets/cultivate-the-community.png"
          width="112px"
        )
        h2.mt-32.text-20.text-like-green.font-500
          | {{ $t('CreatorsPageV2.BetterWorld.World[1].Title') }}
        i18n.mt-12(tag="p" path="CreatorsPageV2.BetterWorld.World[1].Description")
          NuxtLink.text-like-green(
            :to="{ name: 'civic' }"
            place="civicLiker"
          )
            | {{ $tc('civicLikers', 2) }}
      li.relative.p-24(class="laptop:w-1/3")
        img.earth(
          class="laptop:absolute laptop:left-0 phone:max-w-full"
          src="./assets/better-world.png"
        )
</template>

<style lang="scss" scoped>
img.earth {
  max-width: 500px;

  transform: rotateZ(8deg);

  @media screen and (min-width: config('theme.screens.laptop.min')) {
    top: 50%;
    transform: translateY(-50%) rotateZ(8deg);
  }
}
</style>
