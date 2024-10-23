<template>
  <div>
    <ButtonV2
      class="hidden desktop:block"
      preset="tertiary"
      @click="toggleSearch"
    >
      <IconSearch />
    </ButtonV2>
    <div
      class="flex items-center justify-center cursor-pointer p-[8px] desktop:hidden"
      @click="toggleSearch"
    >
      <Label :text="$t('listing_page_search')">
        <template #prepend>
          <IconSearch />
        </template>
      </Label>
    </div>

    <!-- Search bar -->
    <div
      :style="{
        width: isSearchOpen ? '100%' : '0',
      }"
      :class="[
        'absolute',
        'top-0',
        'left-0',
        'z-10',
        'flex',
        'items-center',
        'bg-shade-gray',
        'gap-[12px]',
        isSearchOpen && 'pl-[16px] pr-[4px]',
        'h-full',
        'rounded-[10px]',
        'transition-[width]',
        'duration-[5000]',
        'ease-in-out',
      ]"
    >
      <IconSearch />
      <input
        :value="searchQuery"
        class="w-full bg-transparent border-0 focus-visible:outline-none"
        type="text"
        :placeholder="$t('gutenberg_search_placeholder')"
        @input="debouncedUpdateSearchKeyword"
      />
      <ButtonV2
        v-if="isSearchOpen"
        size="tiny"
        preset="plain"
        class="!rounded-[10px]"
        @click="toggleSearch"
      >
        <IconClose class="cursor-auto" />
      </ButtonV2>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  name: 'SearchBar',
  props: {
    searchQuery: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isSearchOpen: false,
    };
  },
  mounted() {
    if (this.searchQuery) {
      this.isSearchOpen = true;
    }
  },
  methods: {
    toggleSearch() {
      if (this.isSearchOpen) {
        this.$emit('clear');
      } else {
        this.$emit('open');
      }
      this.isSearchOpen = !this.isSearchOpen;
    },
    debouncedUpdateSearchKeyword: debounce(
      function debouncedUpdateSearchKeyword(event) {
        this.$emit('input', event.target.value);
      },
      200
    ),
  },
};
</script>
