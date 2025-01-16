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
        'h-full',
        isSearchOpen && 'pl-[16px] pr-[4px]',
        'rounded-[0px] desktop:rounded-[10px]',
        'transition-[width]',
        'duration-[300]',
        'ease-in-out',
      ]"
    >
      <IconSearch />
      <input
        ref="searchInput"
        v-model="currentSearchQuery"
        class="w-full bg-transparent border-0 focus-visible:outline-none"
        type="text"
        :placeholder="placeholderText"
        @input="handleInput"
        @keyup.enter="handleSubmit"
      />
      <ButtonV2
        v-if="searchButtonProps"
        :size="searchButtonProps.size"
        :preset="searchButtonProps.preset"
        :class="searchButtonProps.class"
        :content-class="searchButtonProps.contentClass"
        :text="searchButtonProps.text"
        @click="searchButtonProps.onClick"
      >
        <template v-if="searchButtonProps.icon">
          <component :is="searchButtonProps.icon" class="cursor-auto" />
        </template>
      </ButtonV2>
    </div>
  </div>
</template>

<script>
import { SEARCH_SUGGESTIONS } from '@/constant/index';
import IconClose from '@/components/Icon/Close';

const SEARCH_ACTIONS = {
  IDLE: 'idle',
  TYPING: 'typing',
  SUBMITTED: 'submitted',
};

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
      currentSearchQuery: this.searchQuery,
      searchActionState: SEARCH_ACTIONS.IDLE,
    };
  },
  computed: {
    searchButtonProps() {
      if (!this.isSearchOpen) return null;
      switch (this.searchActionState) {
        case SEARCH_ACTIONS.TYPING:
          return {
            size: 'small',
            preset: 'tertiary',
            class: '!rounded-[10px] ml-auto',
            contentClass: 'whitespace-nowrap',
            text: this.$t('listing_page_search'),
            onClick: this.handleSubmit,
          };
        case SEARCH_ACTIONS.SUBMITTED:
        case SEARCH_ACTIONS.IDLE:
          return {
            size: 'tiny',
            preset: 'plain',
            class: '!rounded-[10px]',
            contentClass: '',
            icon: IconClose,
            onClick: this.closeSearch,
          };
        default:
          return null;
      }
    },
  },
  mounted() {
    if (this.searchQuery) {
      this.isSearchOpen = true;
      this.placeholderText = this.getRandomPlaceholder();
      this.searchActionState = SEARCH_ACTIONS.SUBMITTED;
    }
  },

  methods: {
    toggleSearch() {
      this.isSearchOpen = !this.isSearchOpen;
      if (this.isSearchOpen) {
        this.placeholderText = this.getRandomPlaceholder();
        this.$nextTick(() => this.$refs.searchInput?.focus());
      }
      this.searchActionState = SEARCH_ACTIONS.IDLE;
      this.$emit('open');
    },
    closeSearch() {
      this.isSearchOpen = false;
      this.currentSearchQuery = '';
      this.searchActionState = SEARCH_ACTIONS.IDLE;
      this.$emit('clear');
    },
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
    handleInput(event) {
      this.currentSearchQuery = event.target.value;
      if (!this.currentSearchQuery) {
        this.searchActionState = SEARCH_ACTIONS.IDLE;
      } else {
        this.searchActionState = SEARCH_ACTIONS.TYPING;
      }
    },
    handleSubmit() {
      const trimmedQuery = this.currentSearchQuery?.trim();
      const query =
        trimmedQuery ||
        this.randomKeywords?.[0] ||
        this.$t('gutenberg_search_placeholder');
      this.currentSearchQuery = query;
      this.$emit('input', query);
      this.searchActionState = SEARCH_ACTIONS.SUBMITTED;
    },
  },
};
</script>
