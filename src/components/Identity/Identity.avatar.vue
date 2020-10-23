<template>
  <svg
    :class="rootClass"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    :style="rootStyle"
  >
    <defs>
      <clipPath id="avatar-mask">
        <circle
          :cx="avatarCenterX"
          :cy="avatarCenterY"
          :r="avatarRadius"
        />
      </clipPath>
    </defs>
    <!-- Avatar -->
    <g class="avatar__button">
      <g :style="{ clipPath: 'url(#avatar-mask)' }">
        <image
          :href="url"
          :x="avatarCenterX - avatarRadius"
          :y="avatarCenterY - avatarRadius"
          :width="avatarRadius * 2"
          :height="avatarRadius * 2"
        />
      </g>
      <circle
        class="avatar__border"
        :cx="avatarCenterX"
        :cy="avatarCenterY"
        :r="avatarRadius"
      />
      <circle
        v-if="isOutlined"
        class="avatar__halo"
        :cx="avatarCenterX"
        :cy="avatarCenterY"
        :r="avatarHaloRadius"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'IdentityAvatar',
  props: {
    size: {
      type: Number,
      default: 40,
    },
    url: {
      type: String,
      default: '',
    },
    isOutlined: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rootClass() {
      return [
        'avatar',
        {
          avatar__disabled: this.isDisabled,
        },
      ];
    },
    rootStyle() {
      return {
        fontSize: `${this.size}px`,
      };
    },
    avatarRadius() {
      return this.size / 2;
    },
    avatarHaloRadius() {
      return this.avatarRadius + this.size * 0.08;
    },
    padding() {
      return this.size * 0.05;
    },
    width() {
      return (this.avatarHaloRadius + this.padding) * 2;
    },
    height() {
      return this.width;
    },
    avatarCenterX() {
      return this.width / 2;
    },
    avatarCenterY() {
      return this.height / 2;
    },
  },
};
</script>

<style lang="scss">
.avatar {
  &__border,
  &__halo {
    fill: none;
    stroke-width: 0.05em;
  }

  &__border {
    stroke: #e6e6e6;
  }

  &__halo {
    stroke: #50e3c2;
    transition: stroke-width 0.2s ease;
  }

  &:not(&__disabled):hover &__halo {
    stroke-width: 0.07em;
  }
}
</style>
