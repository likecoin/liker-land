<template>
  <div
    class="content-card-placeholder"
  >
    <div class="content-card-placeholder__header content-card-placeholder__inset">
      <span class="content-card-placeholder__avatar" />
      <span
        class="content-card-placeholder__author-name"
        :style="authorNameStyle"
      />
    </div>

    <div class="content-card-placeholder__info content-card-placeholder__inset">
      <div
        class="content-card-placeholder__domain"
        :style="domainStyle"
      />
      <div
        class="content-card-placeholder__title"
        :style="titleRowStyle"
      />
      <div
        v-for="row in descriptionRowCount"
        :key="`description-${row}`"
        class="content-card-placeholder__description"
        :style="row === descriptionRowCount && descriptionLastRowStyle"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentCardPlaceholder',
  data() {
    return {
      authorNameStyle: {
        width: '100px',
      },
      coverPhotoStyle: {
        height: '250px',
      },
      domainStyle: {
        width: '80px',
      },
      titleRowStyle: {
        width: '50%',
      },
      descriptionRowCount: 3,
      descriptionLastRowStyle: {
        width: '40%',
      },
    };
  },
};
</script>

<style lang="scss">
@keyframes placeholder-shimming {
  0% {
    background-position-x: -100vw;
  }
  100% {
    background-position-x: 100vw;
  }
}

%placeholder {
  background-size: 100vw 100%;
  background-repeat: no-repeat;
  background-image: linear-gradient(
    to right,
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, 0.5),
    hsla(0, 0%, 0%, 0) 50%
  );

  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeholder-shimming;
  animation-timing-function: linear;

  transition: all 100s ease;

  @apply bg-gray-e6;
}

.content-card-placeholder {
  @apply block;
  @apply relative;

  @apply text-left;

  @apply bg-white;

  @apply rounded-8;

  &__inset {
    @apply px-16;
    @apply py-12;

    & + & {
      @apply pt-0;
    }
  }

  &__header {
    @apply flex;
    @apply items-center;
  }

  &__avatar {
    @extend %placeholder;

    @apply rounded-full;

    @apply mr-8;

    @apply w-36;
    @apply h-36;
  }

  &__author-name {
    @extend %placeholder;

    @apply h-20;
  }

  &__domain {
    @extend %placeholder;

    @apply h-16;
  }

  &__title {
    @extend %placeholder;

    @apply mt-4;

    @apply h-20;

    & + & {
      @apply mt-2;
    }
  }

  &__description {
    @extend %placeholder;

    @apply mt-8;

    @apply h-14;

    & + & {
      @apply mt-4;
    }
  }
}
</style>
