<template>
  <Dropdown direction="center" :close-on-child-click="false">
    <template #trigger>
      <ButtonV2
        :text="$t('order_menu_filter_by')"
        :preset="getFilterButtonPreset"
        size="mini"
      />
    </template>
    <div class="flex flex-col rounded-[24px] bg-white shadow-md">
      <header
        :class="[
          'flex',
          'justify-between',
          'items-center',
          'gap-[12px]',

          'w-full',
          'px-[16px]',
          'py-[16px]',

          'border-b-[1px]',
          'border-b-shade-gray',

          'overflow-x-auto',
        ]"
      >
        <div class="flex items-center gap-[8px] flex-shrink-0">
          <ButtonV2
            class="flex-shrink-0"
            :preset="getTypeButtonPreset"
            size="mini"
            :text="$t('order_menu_filter_by_type')"
            @click="handleClickType"
          />
          <ButtonV2
            v-if="isPortfolioTabCollectedActive"
            class="flex-shrink-0"
            :preset="getCreatorsButtonPreset"
            size="mini"
            :text="$t('order_menu_filter_by_creators')"
            @click="handleClickCreators"
          />
          <ButtonV2
            v-if="nftKeywordList.length"
            class="flex-shrink-0"
            :preset="getKeywordsButtonPreset"
            size="mini"
            :text="$t('order_menu_filter_by_keywords')"
            @click="handleClickKeywords"
          />
        </div>

        <ButtonV2
          class="flex-shrink-0"
          preset="plain"
          size="mini"
          :text="$t('order_menu_filter_clean')"
          @click="handleResetFilter"
        />
      </header>
      <main class="flex flex-col justify-start">
        <div
          class="px-[16px] py-[16px] max-h-[35vh] overflow-y-scroll scrollbar-custom"
        >
          <!-- type -->
          <MenuList
            v-if="selectedFilter === 'type'"
            class="!w-full border-none"
            :has-padding="false"
          >
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
          <MenuList
            v-else-if="selectedFilter === 'creators'"
            class="!w-full border-none"
            :has-padding="false"
          >
            <NFTPortfolioFilterInput
              @handle-input-change="
                value => $emit('input-filter-change-creator', value)
              "
            />
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
              <template v-if="user.isSelected" #label-append>
                <TickIcon class="w-[20px] fill-like-cyan" />
              </template>
            </MenuItem>
          </MenuList>
          <!-- keywords -->
          <MenuList
            v-else-if="selectedFilter === 'keywords'"
            class="!w-full border-none max-h-[35vh] overflow-y-scroll scrollbar-custom"
            :has-padding="false"
          >
            <NFTPortfolioFilterInput
              @handle-input-change="
                value => $emit('input-filter-change-keyword', value)
              "
            />
            <div
              class="flex flex-row flex-wrap items-center gap-[6px] py-[12px]"
            >
              <ButtonV2
                v-for="keyword in nftKeywordList"
                :key="keyword"
                :preset="
                  nftKeywordFiltering.includes(keyword) ? 'cyan' : 'tertiary'
                "
                @click="() => handleChangeKeywords(keyword)"
              >
                {{ keyword }}
              </ButtonV2>
            </div>
          </MenuList>
        </div>
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
    getFilterButtonPreset: {
      type: String,
      default: undefined,
    },
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
      this.$emit('filter-click-clear-filter');
      this.$emit('input-filter-change-creator', '');
    },
    handlePortfolioTypeChange(value) {
      this.$emit('filter-change-type', value);
    },
    handlePortfolioCreatorChange(value) {
      this.$emit('filter-change-creator', value);
      this.$emit('input-filter-change-creator', '');
    },
    handleChangeKeywords(value) {
      this.$emit('filter-change-keyword', value);
      this.$emit('input-filter-change-keyword', '');
    },
  },
};
</script>
