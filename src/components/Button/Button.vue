<template>
  <a
    v-if="href"
    v-bind="buttonProps"
    :href="href"
    v-on="$listeners"
  >
    <div :class="contentClass">
      <slot name="prepend" />
      <span
        v-if="title"
        v-bind="titleProps"
      >{{ title }}</span>
      <slot v-else />
      <slot name="append" />
    </div>
  </a>
  <nuxt-link
    v-else-if="to"
    v-bind="buttonProps"
    :to="to"
    v-on="$listeners"
  >
    <div :class="contentClass">
      <slot name="prepend" />
      <span
        v-if="title"
        v-bind="titleProps"
      >{{ title }}</span>
      <slot v-else />
      <slot name="append" />
    </div>
  </nuxt-link>
  <button
    v-else
    v-bind="buttonProps"
    v-on="$listeners"
  >
    <div :class="contentClass">
      <slot name="prepend" />
      <span
        v-if="title"
        v-bind="titleProps"
      >{{ title }}</span>
      <slot v-else />
      <slot name="append" />
    </div>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    preset: {
      type: String,
      default: 'primary',
    },
    full: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'default',
    },
    href: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    titleClass: {
      type: String,
      default: '',
    },
    contentClass: {
      type: String,
      default: undefined,
    },
    to: {
      type: Object,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonProps() {
      return {
        class: [
          'button',
          `button--${this.preset}`,
          `button--${this.size}`,
          {
            'button--full': this.full,
            'button--disabled': this.disabled,
          },
        ],
        ...this.$attrs,
      };
    },
    titleProps() {
      return {
        class: ['button__title', this.titleClass],
      };
    },
  },
};
</script>

<style lang="scss">
.button {
  display: inline-block;

  padding: 0;

  min-height: 32px;
  min-width: 32px;

  border: none;
  border-radius: 8px;

  text-align: center;
  text-decoration: none;

  > div {
    display: inline-flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;

    min-height: inherit;
    min-width: inherit;
    padding: 4px;

    border-radius: inherit;

    transition: background-color 0.2s ease;
  }

  &#{&}--full {
    width: 100%;

    > div {
      width: inherit;
    }
  }

  &:hover > div {
    background-color: #00000008;
  }

  &:active > div {
    background-color: #0000001a;
  }

  &__title {
    padding: 0 8px;

    font-family: Source Sans Pro, Arial, sans-serif;
    font-size: 14px;
  }

  &#{&}--large {
    min-height: 48px;
  }
  &#{&}--large &__title {
    font-size: 16px;
  }

  &--plain {
    color: #28646e;

    > div {
      padding: 0 8px;
    }
  }

  &--primary {
    color: #28646e;

    background-color: #aaf1e7;
  }

  &--primary-outline {
    color: #28646e;

    border: 2px solid #aaf1e7;
  }

  &--primary-invert {
    color: #aaf1e7;

    background-color: #28646e;
  }

  &--special {
    color: #28646e;

    @apply bg-like-gradient;
  }

  &--secondary {
    color: #4a4a4a;

    background-color: #9b9b9b33;
  }

  &--secondary-outline {
    color: #4a4a4a;

    border: 2px solid #9b9b9b;
  }

  &--danger {
    color: #6e2828;

    background-color: #ffc9c9;
  }

  &--primary &__title,
  &--primary-outline &__title,
  &--primary-invert &__title,
  &--secondary &__title,
  &--secondary-outline &__title,
  &--special &__title,
  &--danger &__title,
  &--plain &__title {
    font-weight: 600;
  }

  &--plain &__title {
    text-decoration: underline;

    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }

  &--translucent-light {
    color: #28646e;

    background-color: transparent;
  }

  &--translucent-dark {
    color: white;

    background-color: transparent;
  }

  &--disabled {
    color: #9b9b9b;

    background-color: #ececec;

    pointer-events: none;
  }
}
</style>
