<template>
  <div class="flex flex-col items-center">
    <ul
      :class="[
        'grid',
        isFutureTheme
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 desktop:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3',
        'justify-center',
        'gap-[48px]',
        { 'w-full': isCampaignPreset },
        { 'sm:px-[48px]': isShelfPreset },
      ]"
    >
      <li
        v-for="(item, index) in normalizedItems"
        :id="item.classId"
        :key="item.classId"
        :class="{
          'max-w-[220px]': isShelfPreset,
          'sm:col-span-2 desktop:col-span-3': isCampaignPreset,
        }"
      >
        <component
          :is="cardTag"
          :class="{ 'h-[290px] w-[216px] bg-medium-gray': isDummy }"
          :class-id="item.classId"
          :preset="preset"
          :theme="theme"
          :is-lazy-loaded="index !== 0"
          :shelf-class="[
            // NOTE: Make the shelf appear to be continuous.
            { 'sm:rounded-l-[0px]': index % 2 !== 0 && index % 3 === 1 },
            { 'desktop:rounded-l-[0px]': index % 3 === 2 },
          ]"
          :is-link-disabled="item.isMultiple"
          @click.native="handleClickItem(item)"
          @click-avatar="$emit('click-item-avatar', classId)"
        />
      </li>
    </ul>
    <Dialog
      :open="dialogNFTClassList.length > 0"
      :header-text="$t('nft_book_shelf_multiple_nft_class_dialog_title')"
      panel-container-class="phone:max-w-[520px] laptop:max-w-[768px]"
      panel-component="CardV2"
      panel-class="overflow-y-scroll shadow-lg"
      @close="closeMultipleNFTClassDialog"
    >
      <ul class="flex flex-col gap-[2rem]">
        <li v-for="classId in dialogNFTClassList" :id="classId" :key="classId">
          <component
            :is="cardTag"
            :class-id="classId"
            preset="default"
            :theme="theme"
            component-class="!bg-like-cyan-pale"
            @click.native="$emit('click-item', classId)"
            @click-avatar="$emit('click-item-avatar', classId)"
          />
        </li>
      </ul>
    </Dialog>
  </div>
</template>

<script>
const THEME_TYPE = {
  DEFAULT: 'default',
  FUTURE: 'future',
};

export default {
  name: 'NFTBookShelf',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    preset: {
      type: String,
      default: 'shelf',
    },
    theme: {
      type: String,
      default: THEME_TYPE.DEFAULT,
    },
    isDummy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogNFTClassList: [],
    };
  },
  computed: {
    cardTag() {
      return this.isDummy ? 'div' : 'NFTBookItemCard';
    },
    isShelfPreset() {
      return this.preset === 'shelf';
    },
    isCampaignPreset() {
      return this.preset === 'campaign';
    },
    isFutureTheme() {
      return this.theme === THEME_TYPE.FUTURE;
    },
    normalizedItems() {
      return this.items.map(item => {
        const isMultiple =
          Array.isArray(item.classId) && item.classId.length > 1;

        const newItem = {
          ...item,
          isMultiple,
          classId: isMultiple ? item.classId[0] : item.classId,
        };

        if (isMultiple) {
          newItem.classIds = item.classId;
        }

        return newItem;
      });
    },
  },
  methods: {
    getDummyResponsiveClass(index) {
      const total = this.normalizedItems.length;
      switch (total % 3) {
        case 1:
          if (index === 1 && total % 2 !== 0) {
            return 'sm:block';
          }
          return 'desktop:block';

        case 2:
          if (index === 1) {
            return 'sm:block';
          }
          return '';

        case 0:
        default:
          if (index === 1 && total % 2 !== 0) {
            return 'sm:block desktop:hidden';
          }
          return '';
      }
    },
    handleClickItem(item) {
      if (item.isMultiple) {
        this.dialogNFTClassList = item.classIds;
      } else {
        this.$emit('click-item', item.classId);
      }
    },
    closeMultipleNFTClassDialog() {
      this.dialogNFTClassList = [];
    },
  },
};
</script>
