<template>
  <div class="bg-white rounded-[24px] overflow-hidden">
    <div
      class="
        flex
        items-center
        px-[16px]
        laptop:px-[32px]
        py-[8px]
        cursor-pointer
      "
      @click="isOpen = !isOpen"
    >
      <div
        class="
          min-w-[48px]
          text-gray-9b text-[32px]
          leading-[72px]
          font-proxima font-[300]
        "
      >
        Q{{ number }}
      </div>
      <div class="ml-[28px] font-[600] flex-grow">
        <slot name="question" />
      </div>
      <svg
        :class="[
          'transform transition-transform duration-[0.5s]',
          {
            'rotate-180': isOpen,
          },
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
          fill="#28646E"
        />
      </svg>
    </div>

    <Transition @enter="onEnter" @leave="onLeave">
      <div v-if="isOpen">
        <div class="laptop:pl-[108px] px-[32px] pb-[24px]">
          <hr class="w-[32px] mb-[8px] border-[#EBEBEB]">
          <slot name="answer" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'NFTFAQItem',
  props: {
    number: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    onEnter(el, done) {
      this.$gsap.gsap.from(el, {
        height: 0,
        duration: 0.25,
        clearProps: 'height',
        onComplete: () => {
          done();
        },
      });
    },
    onLeave(el, done) {
      this.$gsap.gsap.to(el, {
        height: 0,
        duration: 0.15,
        onComplete: () => {
          done();
        },
      });
    },
  },
};
</script>
