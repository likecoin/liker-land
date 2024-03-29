<template>
  <ul v-if="gemList.length" class="flex flex-wrap gap-[6px]">
    <li v-for="(gem, i) in gemList" :key="i" class="w-[20px] h-[20px]">
      <NuxtLink
        :to="
          localeLocation({
            name: gem.nftId ? 'nft-class-classId-nftId' : 'nft-class-classId',
            params: {
              classId: gem.classId,
              nftId: gem.nftId,
            },
          })
        "
        @mouseenter.native.once="onHoverGemLink(gem)"
        @click.native="onClickGemLink(gem)"
      >
        <img
          :src="getLevelImageSrc(gem.level)"
          :title="getGemName(gem.level)"
          :alt="getGemName(gem.level)"
        />
      </NuxtLink>
    </li>
  </ul>
  <div v-else class="flex justify-between w-[44px] text-shade-gray">
    <IconEllipse />
    <IconEllipse />
    <IconEllipse />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getGemName } from '~/util/writing-nft';
import { logTrackerEvent } from '~/util/EventLogger';

const getLevelImg = require.context('../NFTGem/level/', false, /\.png$/);

export default {
  props: {
    wallet: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters(['getCollectedNFTClassesByAddress', 'getNFTClassGemLevel']),
    gemList() {
      const data = this.getCollectedNFTClassesByAddress(this.wallet);
      if (!data) return [];
      return data
        .map(d => ({
          classId: d.classId,
          nftId: d.id,
          level: this.getNFTClassGemLevel(d.classId),
        }))
        .filter(a => a.level >= 4) // below 4 are dots not gems
        .sort((a, b) => b.level - a.level)
        .slice(0, 5);
    },
  },
  methods: {
    getGemName,
    getLevelImageSrc(level) {
      const filename = `./${level >= 10 ? level : `0${level}`}.png`;
      return getLevelImg(filename);
    },
    onClickGemLink(gem) {
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_user_gem_click`,
        `level${gem.level}`,
        1
      );
    },
    onHoverGemLink(gem) {
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_user_gem_hover`,
        `level${gem.level}`,
        1
      );
    },
  },
};
</script>
