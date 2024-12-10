<template>
  <div>
    <ButtonV2
      class="hidden desktop:block"
      preset="tertiary"
      @click="toggleSearch"
    >
      <div class="flex flex-nowrap items-center gap-[8px]">
        <IconSearch />
        <p
          class="text-medium-gray whitespace-nowrap"
          v-text="$t('listing_page_search_label')"
        />
      </div>
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
        'rounded-[0px] desktop:rounded-[10px]',
        'transition-[width]',
        'duration-[5000]',
        'ease-in-out',
      ]"
    >
      <IconSearch />
      <input
        ref="searchInput"
        class="w-full bg-transparent border-0 focus-visible:outline-none"
        type="text"
        :value="searchQuery"
        :placeholder="placeholderText"
        @input="debouncedUpdateSearchKeyword"
        @keyup.enter="handleEnter"
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
import { SEARCH_SUGGESTIONS } from '@/constant/index';

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
      placeholderText: this.$t('gutenberg_search_placeholder'),
      randomKeywords: [],
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
        this.placeholderText = this.getRandomPlaceholder();
        this.$nextTick(() => {
          this.$refs.searchInput?.focus();
        });
      }
      this.isSearchOpen = !this.isSearchOpen;
    },
    debouncedUpdateSearchKeyword: debounce(
      function debouncedUpdateSearchKeyword(event) {
        this.$emit('input', event.target.value);
      },
      200
    ),
    getRandomPlaceholder() {
      if (this.$i18n.locale === 'zh-Hant') {
        const shuffled = [...SEARCH_SUGGESTIONS].sort(
          () => Math.random() - 0.5
        );
        const randomTerms = shuffled.slice(0, 3);
        this.randomKeywords = randomTerms;
        return randomTerms.join('、');
      }
      return this.$t('gutenberg_search_placeholder');
    },
    handleEnter() {
      if (!this.searchQuery || this.searchQuery.trim() === '') {
        const fallbackKeyword =
          this.randomKeywords?.[0] || this.$t('gutenberg_search_placeholder');
        this.$emit('input', fallbackKeyword);
      }
    },
  },
};
</script>
