<template>
  <div class="card">
    <img
      v-if="imageSrc"
      class="card__media card__media--image"
      :src="imageSrc"
    >
    <div class="card__body">
      <h1
        v-if="title"
        class="card__title"
      >{{ title }}</h1>
      <p
        v-if="description"
        class="card__description"
      >{{ description }}</p>
      <slot />
    </div>
    <footer class="card__footer">
      <div class="card__footer-left">
        <slot name="footer-left" />
      </div>
      <div class="card__footer-right">
        <slot name="footer-right" />
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    imageSrc: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
$card-inset-x: 24px;
$card-corner-radius: 8px;

.card {

  border: 1px solid #e6e6e6;
  border-radius: $card-corner-radius;

  font-family: Source Sans Pro, Arial, sans-serif;

  &__body {
    padding: 16px $card-inset-x;

    &:not(:last-child) {
      padding-bottom: 8px;
    }
  }

  &__title {
    color: #000;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  &__description {
    color: #4a4a4a;
    font-size: 14px;
    font-weight: 300;
    margin: 0;

    &:not(:first-child) {
      margin-top: 8px;
    }
  }

  &__media {
    display: block;

    width: 100%;

    border-top-left-radius: $card-corner-radius;
    border-top-right-radius: $card-corner-radius;
  }

  &__footer {
    display: flex;
    justify-content: space-between;

    padding: 8px $card-inset-x 12px;

    &-left,
    &-right {
      display: flex;
      align-items: center;
    }
  }
}
</style>
