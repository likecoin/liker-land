<template>
  <component
    :is="tag"
    class="author-list-item"
  >

    <LcAvatar
      v-if="!isLoading"
      class="author-list-item__avatar"
      :src="resizedAvatarSrc"
      :halo="avatarHalo"
      size="36"
    />
    <span class="author-list-item__name">{{ displayName }}</span>

    <slot v-if="!isLoading" />

  </component>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getAvatarHaloTypeFromUser } from '~/util/user';
import { getImageResizeAPI } from '~/util/api';

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
  computed: {
    ...mapGetters(['getUserInfoById']),
    resizedAvatarSrc() {
      if (!this.avatarSrc) return undefined;
      return getImageResizeAPI(this.avatarSrc, { width: 36 });
    },
  },
  mounted() {
    this.fetchAuthorInfo();
  },
  methods: {
    ...mapActions(['fetchUserInfo']),
    async fetchAuthorInfo() {
      try {
        this.isLoading = true;
        if (this.likerId && !this.getUserInfoById(this.likerId)) {
          await this.fetchUserInfo(this.likerId);
        }
        this.updateAuthorInfo();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    updateAuthorInfo() {
      const authorData = this.getUserInfoById(this.likerId);
      this.displayName = authorData.displayName;
      this.avatarSrc = authorData.avatar;
      this.avatarHalo = getAvatarHaloTypeFromUser(authorData);
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
