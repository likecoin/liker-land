<template>
  <div class="flex flex-col items-center">
    <ul
      :class="[
        'grid',
        'grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3',
        'justify-center',
        'gap-[48px]',
        'sm:px-[48px]',
      ]"
    >
      <li
        v-for="(item, index) in normalizedItems"
        :id="item.classId"
        :key="item.classId"
        class="max-w-[220px]"
      >
        <NFTBookItemCard
          :class-id="item.classId"
          preset="shelf"
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
      {{ /* NOTE: A dummy to make the book shelf extend to the right if only 1 book in 2 columns */ }}
      <li
        v-for="i in 2"
        :key="`dummy-${i}`"
        :class="[
          'hidden',
          { 'sm:block !desktop:hidden': i === 1 && normalizedItems.length % 2 > 0 },
          { 'desktop:block': i === 2 && normalizedItems.length % 3 > 0 },
          'relative',
          'w-full',
          'max-w-[220px]',
          'h-[290px]',
        ]"
      >
        <div
          :class="[
            'absolute',
            'inset-x-[-48px]',
            'inset-y-0',
            'mt-[48px]',
            'bg-like-cyan-pale',
            'rounded-r-[32px]',
          ]"
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
        <li
          v-for="classId in dialogNFTClassList"
          :id="classId"
          :key="classId"
        >
          <NFTBookItemCard
            :class-id="classId"
            preset="default"
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
export default {
  name: 'NFTBookShelf',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogNFTClassList: [],
    };
  },
  computed: {
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
