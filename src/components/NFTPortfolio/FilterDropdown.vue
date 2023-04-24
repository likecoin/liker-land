<template>
  <Dropdown :close-on-child-click="false">
    <template v-slot:trigger="{ toggle }">
      <ButtonV2
        :text="$t('order_menu_filter_by')"
        preset="primary"
        size="mini"
        @click="toggle"
      />
    </template>
    <div class="flex flex-col px-[24px] py-[16px] rounded-[32px] bg-white shadow-md left-[50%] translate-x-[55%] desktop:translate-x-[30%] translate-y-[8px]">
      <header
        class="flex w-full max-w-[70vw] overflow-x-scroll pb-[16px] border-b-[1px] border-b-shade-gray scrollbar-custom"
      >
        <div class="flex justify-center items-center gap-[8px]">
          <ButtonV2
            :preset="getTypeButtonPreset"
            size="mini"
            :text="$t('order_menu_filter_by_type')"
            @click="handleClickType"
          />
          <ButtonV2
            v-if="isPortfolioTabCollectedActive"
            :preset="getCreatorsButtonPreset"
            size="mini"
            :text="$t('order_menu_filter_by_creators')"
            @click="handleClickCreators"
          />
          <ButtonV2
            :preset="getKeywordsButtonPreset"
            size="mini"
            :text="$t('order_menu_filter_by_keywords')"
            @click="handleClickKeywords"
          />
          <ButtonV2
            class="ml-0 laptop:ml-[20px]"
            preset="plain"
            size="mini"
            :text="$t('order_menu_filter_clean')"
            @click="handleResetFilter"
          />
        </div>
      </header>
      <main class="flex flex-col justify-start">
        <!-- type -->
        <MenuList v-if="selectedFilter === 'type'" class="!w-full border-none" :has-padding="false">
          <MenuItem
            v-for="{ value, label } in nftTypeOptions"
            :key="value"
            :value="value"
            :label="label"
            label-align="left"
            :selected-value="portfolioItemsTypeFiltering"
            @select="handlePortfolioTypeChange"
          />
        </MenuList>
        <!-- creators -->
        <MenuList v-else-if="selectedFilter === 'creators'" class="!w-full border-none max-h-[35vh] overflow-y-scroll scrollbar-custom" :has-padding="false">
          <MenuItem
            v-for="user in portfolioCollectedCreatorListWithSorting"
            :key="user.id"
            :value="user.id"
            :label="user.label"
            :label-class="{
              'font-600 text-like-green': user.isSelected,
            }"
            label-align="left"
            @select="handlePortfolioCreatorChange"
          >
            <template #label-prepend>
              <IdentityAvatar
                :url="user.avatar"
                :display-name="user.displayName"
                :size="36"
                :is-outlined="user.isCivicLiker"
                :is-outline-extruded="false"
                :is-lazy-loaded="true"
              />
            </template>
            <template
              v-if="user.isSelected"
              #label-append
            >
              <TickIcon class="w-[20px] fill-like-cyan" />
            </template>
          </MenuItem>
        </MenuList>
        <!-- keywords -->
        <MenuList v-else-if="selectedFilter === 'keywords'" class="!w-full border-none max-h-[35vh] overflow-y-scroll scrollbar-custom" :has-padding="false">
          <div class="flex flex-row flex-wrap items-center gap-[6px] my-[12px]">
            <ButtonV2
              v-for="keyword in nftKeywordList"
              :key="keyword"
              :preset="
                nftKeywordFiltering.includes(keyword)
                  ? 'cyan'
                  : 'tertiary'"
              @click="() => handleChangeKeywords(keyword)"
            >
              {{ keyword }}
            </ButtonV2>
          </div>
        </MenuList>
      </main>
    </div>
  </Dropdown>
</template>

<script>
import TickIcon from '~/assets/icons/tick.svg?inline';

export default {
  components: {
    TickIcon,
  },
  props: {
    getTypeButtonPreset: {
      type: String,
      default: undefined,
    },
    getCreatorsButtonPreset: {
      type: String,
      default: undefined,
    },
    getKeywordsButtonPreset: {
      type: String,
      default: undefined,
    },
    isPortfolioTabCollectedActive: {
      type: Boolean,
      default: false,
    },
    selectedFilter: {
      type: String,
      default: 'type',
    },
    nftTypeOptions: {
      type: Array,
      default: () => [],
    },
    portfolioItemsTypeFiltering: {
      type: String,
      required: true,
    },
    portfolioCollectedCreatorListWithSorting: {
      type: Array,
      default: () => [],
    },
    nftKeywordList: {
      type: Array,
      default: () => [],
    },
    nftKeywordFiltering: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  methods: {
    handleClickType() {
      this.$emit('filter-click-type-filter');
    },
    handleClickCreators() {
      this.$emit('filter-click-creator-filter');
    },
    handleClickKeywords() {
      this.$emit('filter-click-keyword-filter');
    },
    handleResetFilter() {
      this.$emit('filter-click-clean-filter');
    },
    handlePortfolioTypeChange(value) {
      this.$emit('filter-change-type', value);
    },
    handlePortfolioCreatorChange(value) {
      this.$emit('filter-change-creator', value);
    },
    handleChangeKeywords(value) {
      this.$emit('filter-change-keyword', value);
    },
  },
};
</script>
