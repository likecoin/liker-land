<template>
  <div class="relative">
    <NFTBookHeroStatic />

    <div class="absolute inset-0">
      <Swiper
        ref="swiper"
        :options="{
          slidesPerView: '1',
          centeredSlides: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          loop: true,
        }"
        style="height: 100%"
        @slide-change="handleSwiperChange"
      >
        <SwiperSlide>
          <div class="bg-transparent h-full" />
        </SwiperSlide>
      </Swiper>

      <ul
        class="absolute inset-x-0 bottom-0 flex justify-center gap-[0.5rem] w-full p-[0.5rem] z-10"
      >
        <li v-for="slide in 1" :key="`slide-${slide}`">
          <button
            :class="[
              'w-[12px]',
              'h-[12px]',
              'rounded-full',
              'border-2',
              'border-[#ffffff]',
              'transition',
              'duration-300',
              'ease-in-out',
              'transform',
              'shadow-sm',
              slide - 1 === activeSlideIndex
                ? 'bg-like-cyan scale-125'
                : 'bg-white',
            ]"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'NFTStoreCarousel',
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      activeSlideIndex: 0,
    };
  },
  computed: {
    swiper() {
      return this.$refs.swiper.$swiper;
    },
  },
  methods: {
    handleSwiperChange() {
      this.activeSlideIndex = this.swiper.realIndex;
    },
  },
};
</script>
