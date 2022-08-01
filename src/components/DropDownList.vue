<template>
  <CardV2 class="bg-white rounded-[24px] overflow-hidden">
    <div
      class="flex justify-between cursor-pointer w-ful"
      @click="isOpen = !isOpen"
    >
      <div
        :class="[
          'flex',
          'justify-between',
          'items-center',
          'mb-[12px]',
          'text-like-green',
        ]"
      >
        <Label
          class="w-min font-600"
          :text="title"
          tag="div"
          preset="h5"
          valign="middle"
          content-class="whitespace-nowrap text-like-green "
          prepend-class="text-like-green"
        >
          <template #prepend>
            <slot name="titleIcon" />
          </template>
        </Label>
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
        <hr class="w-full mb-[8px] border-[#EBEBEB]">
        <slot name="content" />
      </div>
    </Transition>
  </CardV2>
</template>

<script>
export default {
  name: 'DropDownList',
  props: {
    title: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isOpen: true,
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
