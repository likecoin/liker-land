<template>
  <component
    :is="tag"
    class="author-list-item"
  >

    <LcAvatar
      v-if="!isLoading"
      class="author-list-item__avatar"
      :src="avatarSrc"
      :halo="avatarHalo"
      size="36"
    />
    <span class="author-list-item__name">{{ displayName }}</span>

    <slot v-if="!isLoading" />

  </component>
</template>

<script>
import { getUserMinAPI } from '~/util/api';
import { getAvatarHaloTypeFromUser } from '~/util/user';

export default {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    likerId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      displayName: '',
      avatarSrc: '',
      avatarHalo: 'none',

      isLoading: true,
    };
  },
  watch: {
    likerId: 'fetchAuthorInfo',
  },
  mounted() {
    this.fetchAuthorInfo();
  },
  methods: {
    async fetchAuthorInfo() {
      try {
        this.isLoading = true;
        const authorData = await this.$axios.$get(getUserMinAPI(this.likerId));
        this.displayName = authorData.displayName;
        this.avatarSrc = authorData.avatar;
        this.avatarHalo = getAvatarHaloTypeFromUser(authorData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.author-list-item {
  min-height: 52px;

  transition: background-color 0.25s ease;

  @apply flex;
  @apply items-center;

  @apply p-8 pl-16;

  &:hover {
    @apply bg-gray-f7;
  }

  &__avatar {
    @apply mr-16;
  }

  &__name {
    @apply text-gray-4a;
    @apply text-18;
    @apply font-600;

    @apply flex-grow;
  }
}
</style>
