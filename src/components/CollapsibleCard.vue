<template>
  <CardV2
    class="bg-white rounded-[24px] overflow-hidden"
    :has-padding="false"
  >
    <header
      :class="[
        'flex',
        'justify-between',
        'cursor-pointer',
        'w-full',
        xPaddingClass,
        'py-[32px]',
        'text-like-green',
      ]"
      @click="isOpen = !isOpen"
    >
      <div
        :class="[
          'flex',
          'justify-between',
          'items-center',
        ]"
      >
        <Label
          class="w-min font-600"
          :text="title"
          tag="div"
          preset="h5"
          valign="middle"
          content-class="whitespace-nowrap"
        >
          <template #prepend>
            <slot name="titleIcon" />
          </template>
        </Label>
      </div>
      <svg
        :class="[
          'transform transition-transform duration-[0.2s]',
          isOpen ? '-rotate-180' : '-rotate-90',
        ]"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.8 10.7943C12.4686 11.2362 11.8418 11.3257 11.4 10.9943L8 8.44434L4.6 10.9943C4.15817 11.3257 3.53137 11.2362 3.2 10.7943C2.86863 10.3525 2.95817 9.72571 3.4 9.39434L7.4 6.39434C7.75555 6.12767 8.24444 6.12767 8.6 6.39434L12.6 9.39434C13.0418 9.72571 13.1314 10.3525 12.8 10.7943Z"
          fill="currentColor"
        />
      </svg>
    </header>

    <Transition @enter="onEnter" @leave="onLeave">
      <div v-if="isOpen">
        <div v-if="isShowSeparator" :class="xPaddingClass">
          <hr class="w-full border-[#ebebeb]">
        </div>
        <div
          :class="{
            [contentPaddingClass]: hasContentPadding,
          }"
        >
          <slot name="content" :contentPaddingClass="contentPaddingClass" />
        </div>
      </div>
    </Transition>
  </CardV2>
</template>

<script>
export default {
  name: 'CollapsibleCard',
  props: {
    title: {
      type: String,
      default: undefined,
    },
    isNarrow: {
      type: Boolean,
      default: false,
    },
    isShowSeparator: {
      type: Boolean,
      default: true,
    },
    hasContentPadding: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    xPaddingClass() {
      return this.isNarrow ? 'px-[24px]' : 'px-[32px]';
    },
    contentPaddingClass() {
      return `${this.xPaddingClass} pb-[32px]`;
    },
  },
  methods: {
    onEnter(el, done) {
      this.$gsap.gsap.from(el, {
        height: 0,
        duration: 0.25,
        ease: 'power2.out',
        clearProps: 'height',
        onComplete: () => {
          done();
        },
      });
    },
    onLeave(el, done) {
      this.$gsap.gsap.to(el, {
        height: 0,
        ease: 'power2.out',
        duration: 0.2,
        onComplete: () => {
          done();
        },
      });
    },
  },
};
</script>
