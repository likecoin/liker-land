<template lang="pug">
  mixin Identity
    Identity(
      :avatar-url="creator.avatar"
      :avatar-size="100"
      :is-avatar-outlined="creator.isSubscribedCivicLiker || creator.isCivicLikerTrial"
    )

  section.mx-16(class="laptop:mx-40")
    .max-w-phone.mx-auto.px-24.text-center
      h1.text-30.text-like-green.font-500
        | {{ $t('CLP.betterWorld.title') }}
      p.mt-24.leading-1_5 {{ $t('CLP.betterWorld.description') }}

    svg.mt-24(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 921 312")
      image(xlink:href="../assets/better-world.png" width="921" height="312")
      ClientOnly
        foreignObject(
          v-for="creator in creatorsWithCoordinate"
          :key="creator.user"
          :x="creator.x"
          :y="creator.y"
          :width="100"
          :height="100"
        )
          NuxtLink(
            v-if="isCreatorsClickable"
            :to="{ name: 'id', params: { id: creator.user } }"
          )
            +Identity
          +Identity()(v-else)
</template>

<script>
import Identity from '../../Identity/Identity';

const coordinates = [
  { x: 598, y: 16 },
  { x: 230, y: 205 },
  { x: 654, y: 200 },
  { x: 162, y: 6 },
  { x: 815, y: 103 },
  { x: 3, y: 134 },
];

export default {
  components: {
    Identity,
  },
  props: {
    creators: {
      type: Array,
      default: () => [],
    },
    isCreatorsClickable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    creatorsWithCoordinate() {
      return this.creators.map((creator, i) => ({
        ...creator,
        ...coordinates[i],
      }));
    },
  },
};
</script>
