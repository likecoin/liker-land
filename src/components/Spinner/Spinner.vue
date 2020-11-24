<template>
  <div class="spinner" />
</template>

<style lang="scss">
.spinner {
  width: 48px;
  height: 48px;

  background-image: url(./sprite.png);
  background-size: cover;

  @keyframes likecoin-spin {
    from {
      background-position-x: 0px;
    }
    to {
      background-position-x: -864px;
    }
  }

  animation: likecoin-spin 1s steps(9) infinite;
}
</style>
