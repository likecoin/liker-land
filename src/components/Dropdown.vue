<template>
  <DropdownMenu
    ref="dropdown"
    :direction="direction"
    :close-on-click-outside="closeOnClickOutside"
    :overlay="false"
    v-on="$listeners"
  >
    <template #trigger>
      <slot v-bind="{ toggle }" name="trigger" />
    </template>

    <template #body>
      <div @click="handleBodyClick">
        <slot />
      </div>
    </template>
  </DropdownMenu>
</template>

<script>
import DropdownMenu from 'v-dropdown-menu/vue2';

export default {
  components: {
    DropdownMenu,
  },
  props: {
    direction: {
      type: String,
      default: 'right',
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    closeOnChildClick: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    toggle() {
      // TODO: Deprecated. Remove this method in the future.
    },
    handleBodyClick() {
      if (this.closeOnChildClick && this.$refs.dropdown) {
        this.$refs.dropdown.hide();
      }
    },
  },
};
</script>

<style>
.v-dropdown-menu {
  position: relative;
  display: inline-block;
}
.v-dropdown-menu__trigger {
  position: relative;
}
.v-dropdown-menu__container {
  position: absolute;
  top: 100%;
  bottom: auto;
  min-width: 230px;
  max-width: 100%;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #ddd;
}
.v-dropdown-menu--dropup .v-dropdown-menu__container {
  top: auto;
  bottom: 100%;
}
.v-dropdown-menu--direction-left .v-dropdown-menu__container {
  left: 0;
}
.v-dropdown-menu--direction-center .v-dropdown-menu__container {
  left: 50%;
  transform: translateX(-50%) translateY(0);
}
.v-dropdown-menu--direction-right .v-dropdown-menu__container {
  right: 0;
}
.v-dropdown-menu__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
.v-dropdown-menu .default-enter-active {
  transition: all 0.2s ease;
}
.v-dropdown-menu .default-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.v-dropdown-menu .default-enter,
.v-dropdown-menu .default-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
.v-dropdown-menu--mode-hover .default-enter,
.v-dropdown-menu--mode-hover .default-leave-active {
  transition-delay: 0.4s;
}
.v-dropdown-menu--dropup .default-enter,
.v-dropdown-menu--dropup .default-leave-to {
  transform: translateY(-12px);
}
.v-dropdown-menu--dropup.v-dropdown-menu--direction-center .default-enter,
.v-dropdown-menu--dropup.v-dropdown-menu--direction-center .default-leave-to {
  transform: translateX(-50%) translateY(-12px);
}
.v-dropdown-menu--direction-center .default-enter,
.v-dropdown-menu--direction-center .default-leave-to {
  transform: translateX(-50%) translateY(12px);
}
.v-dropdown-menu .v-dropdown-menu__container {
  overflow: unset;

  margin: 8px 0;

  background-color: transparent;
  border: none;
}
</style>
