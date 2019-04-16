<template>
  <component
    :is="tag"
    class="author-list-item list-view-item list-view-item--no-hover"
  >

    <div class="author-list-item__content-view list-view-item__content-view">
      <span
        v-if="isLoading"
        key="placeholder"
        class="author-list-item__avatar-placeholder placeholder-shimmer"
      />
      <LcAvatar
        v-if="!isLoading"
        class="author-list-item__avatar"
        :src="resizedAvatarSrc"
        :halo="avatarHalo"
        size="36"
      />
      <span
        v-if="isLoading"
        key="placeholder"
        class="author-list-item__name-placeholder placeholder-shimmer"
      />
      <span
        v-else
        class="author-list-item__name"
      >{{ displayName }}</span>
    </div>

    <slot
      v-if="!isLoading"
      name="accessory-view"
    >
      <TransitionGroup
        ref="accessoryView"
        name="author-list-item__accessory-view-"
        class="author-list-item__accessory-view list-view-item__accessory-view"
        tag="div"
      >
        <button
          v-if="!isOpenAccessoryView"
          key="accessory-toggle-button"
          class="author-list-item__accessory-view-toggle-button"
          @click="isOpenAccessoryView = true"
        >
          <MoreIcon />
        </button>
        <slot
          v-else
          name="accessory-view-button"
        />
      </TransitionGroup>
    </slot>

  </component>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getAvatarHaloTypeFromUser } from '~/util/user';
import { getImageResizeAPI } from '~/util/api';

import MoreIcon from '~/assets/icons/more.svg';

export default {
  components: {
    MoreIcon,
  },
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
      isOpenAccessoryView: false,
    };
  },
  computed: {
    ...mapGetters(['getUserInfoById']),
    resizedAvatarSrc() {
      if (!this.avatarSrc) return undefined;
      return getImageResizeAPI(this.avatarSrc, { width: 36 });
    },
  },
  watch: {
    isOpenAccessoryView(isOpenAccessoryView) {
      this.manageWindowClickListener(isOpenAccessoryView);
    },
  },
  mounted() {
    this.fetchAuthorInfo();
  },
  beforeDestroy() {
    this.manageWindowClickListener(false);
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

    manageWindowEventListener(eventName, isAdd) {
      window[`${isAdd ? 'add' : 'remove'}EventListener`](
        eventName,
        this.onWindowClick,
        true
      );
    },
    manageWindowClickListener(isAdd) {
      this.manageWindowEventListener('click', isAdd);
      this.manageWindowEventListener('touchend', isAdd);
    },

    onWindowClick(e) {
      const component = this.$refs.accessoryView;
      if (!component || !component.$el.contains(e.target)) {
        this.isOpenAccessoryView = false;
      }
    },
  },
};
</script>

<style lang="scss">
.author-list-item {
  &__avatar {
    @apply mr-16;

    &-placeholder {
      @apply rounded-full;

      @apply w-36;
      @apply h-36;
    }
  }

  &__name {
    @apply text-gray-4a;
    @apply text-18;
    @apply font-600;
    @apply leading-1_5;
    @apply truncate;

    &-placeholder {
      width: 10rem;

      @apply ml-12;

      @apply h-20;
    }
  }

  &__accessory-view {
    @apply relative;
    @apply overflow-hidden;

    > * {
      @apply absolute;
      @apply pin;
      @apply w-full;

      @apply flex;
      @apply justify-center;
      @apply items-center;
    }

    &-- {
      &enter-active,
      &leave-active {
        transition: all 0.25s ease !important;
      }
      &enter,
      &leave-to {
        transform: translateX(100%);
      }
    }

    &-toggle-button {
      transition-property: opacity, background-color;
      transition-duration: 0.25s;
      transition-timing-function: ease;

      @apply text-gray-4a;
      @apply fill-current;

      > svg {
        @apply w-24;
        @apply h-24;
      }

      &:hover {
        background: rgba(black, 0.05);

        @apply opacity-75;
      }

      &:active {
        @apply opacity-50;
      }
    }
  }
}
</style>
