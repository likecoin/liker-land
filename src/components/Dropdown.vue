<template>
  <div class="relative">
    <slot v-bind="{ toggle }" name="trigger" />
    <Transition
      enter-class="transition duration-100 ease-out origin-top-right"
      enter-active-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-class="transition duration-75 ease-in origin-top-right"
      leave-active-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
      @after-enter="startDetectingClickOutside"
    >
      <div
        v-if="isOpen"
        ref="dropdown"
        class="absolute right-0 top-full mt-[8px] z-10"
        @click="close"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    close() {
      this.isOpen = false;
      this.stopDetectingClickOutside();
    },
    startDetectingClickOutside() {
      window.addEventListener('click', this.detectClickOutside);
    },
    stopDetectingClickOutside() {
      window.removeEventListener('click', this.detectClickOutside);
    },
    detectClickOutside(event) {
      const { dropdown } = this.$refs;
      if (
        !dropdown ||
        !(dropdown === event.target || dropdown.contains(event.target))
      ) {
        this.close();
      }
    },
  },
};
</script>
