<template>
  <div class="placeholder" v-bind="$attrs" />
</template>

<style lang="scss">
.placeholder {
  @keyframes placeholder-shimming {
    0% {
      background-position-x: -100vw;
    }
    100% {
      background-position-x: 100vw;
    }
  }

  background-size: 100vw 100%;
  background-repeat: no-repeat;
  background-clip: padding-box;
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

  background-color: #e6e6e6;
}
</style>
