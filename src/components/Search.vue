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
import { logTrackerEvent } from '~/util/EventLogger';
import debounce from 'lodash.debounce';

export default {
  data() {
    return {
      isSearchOpen: false,
    };
  },
  computed: {
    searchQuery() {
      return this.$route.query.q || '';
    },
  },
  mounted() {
    if (this.searchQuery) {
      this.isSearchOpen = true;
    }
  },
  methods: {
    toggleSearch() {
      if (this.isSearchOpen) {
        this.$router.replace({ query: { q: undefined } });
        logTrackerEvent(this, 'listing', 'search_clear', '', 1);
      } else {
        logTrackerEvent(this, 'listing', 'search_open', '', 1);
      }
      this.isSearchOpen = !this.isSearchOpen;
    },
    debouncedUpdateSearchKeyword: debounce(
      function debouncedUpdateSearchKeyword(event) {
        this.$router.replace({ query: { q: event.target.value } });
      },
      200
    ),
  },
};
</script>
