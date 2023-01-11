<template>
  <div>
    <div v-if="gemList.length" class="flex">
      <span
        v-for="gemLevel, i in gemList"
        :key="i"
        class="w-[20px] h-[20px] mx-[3px]"
      >
        <ToolTips :tool-tip-text="getGemName(gemLevel)">
          <img :src="getLevelImageSrc(gemLevel)" :title="getGemName(gemLevel)" :alt="getGemName(gemLevel)">
        </ToolTips>
      </span>
    </div>
    <div v-else class="flex justify-between w-[44px] mx-auto mt-[16px] mb-[24px] text-shade-gray">
      <IconEllipse />
      <IconEllipse />
      <IconEllipse />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getGemName } from '~/util/writing-nft';

const getLevelImg = require.context('../NFTGem/level/', false, /\.png$/);

export default {
  props: {
    wallet: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'collected',
    },
  },
  computed: {
    ...mapGetters(['getNFTListMapByAddress', 'getNFTClassGemLevel']),
    gemList() {
      const list = this.getNFTListMapByAddress(this.wallet);
      if (!list) return [];
      const data = list[this.type];
      if (!data) return [];
      return data
        .map(d => this.getNFTClassGemLevel(d.classId))
        .sort((a, b) => b - a)
        .slice(0, 5);
    },
  },
  methods: {
    getGemName,
    getLevelImageSrc(level) {
      const filename = `./${level >= 10 ? level : `0${level}`}.png`;
      return getLevelImg(filename);
    },
  },
};
</script>
