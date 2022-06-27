<template>
  <div>
    <header :class="headerClass">
      <div class="flex items-center">
        <StatusIcon
          class="w-24 h-24"
          :type="headerIconType"
        />
        <span :class="headerTitleClass">{{ errorMessage || headerTitle }}</span>
      </div>
      <div
        v-if="sinceDate"
        class="ml-24 text-12 text-gray-4a"
      >{{ $t('civic_liker_feature_list_header_since_date', { date: sinceDate }) }}</div>
    </header>
    <ul class="px-32 py-16 bg-white list-style-none rounded-b-8">
      <li
        v-for="(description, key) in $t('civic_liker_feature_list_item')"
        :key="key"
        class="flex items-start"
      >
        <StatusIcon
          class="w-12 h-12 my-2 mr-20 shrink-0"
          :type="featureIconType"
        />
        <span :class="descriptionClass">{{ description }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import StatusIcon from './CivicLikerFeatureListIcon';

export default {
  components: {
    StatusIcon,
  },
  props: {
    errorMessage: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    sinceDate: {
      type: String,
      default: '',
    },
  },
  computed: {
    isError() {
      return !!this.errorMessage;
    },
    headerBackgroundClass() {
      if (this.isError) return 'bg-error-gradient';
      if (this.isActive) return 'bg-like-gradient';
      return 'bg-gray-e6';
    },
    headerClass() {
      return [
        'flex',
        'justify-between',
        'items-center',
        'px-28',
        'py-12',
        'rounded-t-8',
        this.headerBackgroundClass,
      ];
    },
    headerIconType() {
      if (this.isError) return 'error';
      if (this.isActive) return 'active';
      return 'inactive';
    },
    headerTitleTextClass() {
      if (this.isError) return 'text-danger';
      if (this.isActive) return 'text-like-green';
      return 'text-gray-4a';
    },
    headerTitleClass() {
      return ['ml-16', 'text-18', 'font-500', this.headerTitleTextClass];
    },
    headerTitle() {
      if (this.isActive) {
        return this.$t('civic_liker_feature_list_header_title_active');
      }
      return this.$t('civic_liker_feature_list_header_title_inactive');
    },
    descriptionClass() {
      return ['text-12', 'leading-1_5', { 'text-gray-9b': !this.isActive }];
    },
    featureIconType() {
      return this.isActive ? 'active' : 'inactive';
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  display: grid;
  grid-gap: 8px 32px;

  @media screen and (min-width: 601px) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
