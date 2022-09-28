<template>
  <div>
    <IconGemLevel1 v-if="activeBatch === 1" />
    <IconGemLevel2 v-if="activeBatch === 2" />
    <IconGemLevel3 v-if="activeBatch === 3" />
    <IconGemLevel4 v-if="activeBatch === 4" />
    <IconGemLevel5 v-if="activeBatch === 5" />
    <IconGemLevel6 v-if="activeBatch === 6" />
    <IconGemLevel7 v-if="activeBatch === 7" />
    <IconGemLevel8 v-if="activeBatch === 8" />
    <IconGemLevel9 v-if="activeBatch === 9" />
    <IconGemLevel10 v-if="activeBatch === 10" />
    <IconGemLevel11 v-if="activeBatch === 11" />
    <IconGemLevel12 v-if="activeBatch === 12" />
    <div v-if="activeBatch === 13" class="relative flex items-center justify-center">
      <IconGemLevel13 class="absolute" />
      <IconGemSpark1 />
    </div>
    <div v-if="activeBatch <= 14 && activeBatch >= 16" class="relative flex items-center justify-center">
      <IconGemLevel14 class="absolute" />
      <IconGemSpark2 />
    </div>
    <div v-if="activeBatch >= 17" class="relative flex items-center justify-center">
      <IconGemLevel15 class="absolute" />
      <IconGemSpark3 />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeBatch: {
      type: Number,
      default: undefined,
    },
  },
};
</script>
