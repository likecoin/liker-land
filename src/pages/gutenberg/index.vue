<template>
  <div class="flex flex-col justify-center text-dark-gray gap-[24px]">
    <section name="hero" class="mb-[36px] desktop:mb-[60px]">
      <div
        class="relative flex justify-center px-[36px] pb-[60px] mb-[48px] laptop:px-[24px] desktop:pb-[160px]"
      >
        <img
          class="w-full max-w-[90%] desktop:max-w-[936px]"
          src="~/assets/images/gutenberg/hero.png"
          alt=""
        />
        <div
          class="absolute w-full h-[120px] sm:h-[160px] bottom-0 bg-like-cyan-pale -z-1 desktop:h-[398px]"
        />
        <img
          class="absolute bottom-0 w-full max-w-[95%] sm:w-auto"
          src="~/assets/images/gutenberg/library.svg"
          alt=""
        />
        <img
          class="absolute bottom-[-20px] w-full max-w-[40%] laptop:w-auto laptop:bottom-[-30px]"
          src="~/assets/images/gutenberg/title.svg"
          alt=""
        />
      </div>
      <Label
        class="w-full text-[36px] text-like-green font-[300] italic whitespace-pre-wrap laptop:text-[52px]"
        align="center"
        :text="$t('gutenberg_intro_title')"
      />
    </section>

    <section
      name="intro"
      class="grid grid-cols-3 mb-[60px] px-[24px] w-full mx-auto max-w-[1024px] laptop:px-[85px]"
    >
      <div class="col-span-3">
        <Label
          class="w-full laptop:whitespace-pre-wrap"
          preset="h2"
          align="left"
          :text="$t('gutenberg_intro_subtitle')"
        />
      </div>
      <div
        class="col-span-3 mt-[12px] desktop:col-span-2 desktop:col-start-2 desktop:mt-0"
      >
        <Label
          class="w-full text-like-green"
          preset="p5"
          align="left"
          :text="$t('gutenberg_intro_description')"
        />
      </div>
    </section>

    <section
      name="gutenbergProject"
      class="flex flex-col relative items-center px-[24px] mb-[180px] w-full mx-auto max-w-[1024px] laptop:px-[85px] desktop:grid desktop:grid-cols-2"
    >
      <div class="relative flex justify-center col-span-1">
        <div class="relative w-[60%] mb-[12px] desktop:ml-[-24px] desktop:mb-0">
          <img
            class="absolute top-[-12px] left-[-12px]"
            src="~/assets/images/gutenberg/imgContainer.svg"
            alt=""
          />
          <img
            class="w-full max-w-[256px]"
            src="~/assets/images/gutenberg/gutenbergProject.png"
            alt=""
          />
        </div>
      </div>
      <img
        class="absolute translate-y-[50%] bottom-[-75px] laptop:bottom-[-35px] laptop:z-1"
        src="~/assets/images/gutenberg/sound.svg"
        alt=""
      />
      <div class="col-span-1 flex flex-col gap-[24px]">
        <Label preset="h2" :text="$t('gutenberg_project_title')" />
        <Label
          class="text-like-green"
          :text="$t('gutenberg_project_description')"
        />
      </div>
    </section>

    <section
      name="decentralize"
      class="relative flex items-center justify-center px-[24px] mb-[160px] w-full mx-auto max-w-[1024px] laptop:mb-[220px]"
    >
      <div class="flex flex-col items-center gap-[24px] desktop:w-[60%]">
        <Label preset="h2" :text="$t('gutenberg_decentralize_title')" />
        <Label
          class="text-like-green"
          :text="$t('gutenberg_decentralize_description')"
        />
      </div>
      <img
        class="absolute bottom-[-105px] translate-y-[50%] laptop:bottom-[-125px]"
        src="~/assets/images/gutenberg/decentralize.svg"
        alt=""
      />
    </section>

    <section
      name="blende"
      class="flex flex-col items-center mx-auto my-[40px] w-full max-w-[1024px] px-[12px] desktop:pr-[85px] desktop:grid grid-cols-7 gap-x-[48px] gap-y-[32px]"
    >
      <div class="col-span-3 flex flex-col items-center gap-[24px]">
        <img src="~/assets/images/gutenberg/blende.png" alt="" />
      </div>
      <div
        class="flex flex-col justify-center gap-[24px] px-[24px] laptop:hidden"
      >
        <Label
          preset="h2"
          align="center"
          :text="$t('gutenberg_blende_title')"
        />
        <Label
          class="text-like-green"
          align="left"
          :text="$t('gutenberg_blende_description')"
        />
      </div>
      <div
        class="hidden col-span-4 flex-col gap-[24px] px-[24px] laptop:flex laptop:items-start laptop:px-0"
      >
        <Label preset="h2" :text="$t('gutenberg_blende_title')" />
        <Label
          class="text-like-green"
          :text="$t('gutenberg_blende_description')"
        />
      </div>
    </section>

    <section
      id="download"
      ref="download"
      class="flex flex-col gap-[18px] my-[40px] px-[12px] pt-[50px] w-full bg-like-cyan-pale"
      name="freeEpub"
    >
      <Label
        align="center"
        preset="h2"
        :text="$t('gutenberg_download_title')"
      />
      <Label
        align="center"
        class="text-[20px] text-like-green"
        :text="$t('gutenberg_download_subtitle')"
      />
      <div
        class="items-end justify-center gap-[12px] hidden laptop:gap-[48px] laptop:flex"
      >
        <div
          v-for="book of freeDownloadList"
          :key="book.classId"
          class="flex flex-col gap-[24px] relative max-w-[220px]"
        >
          <img class="shadow-2xl" :src="book.imgSrc" :alt="book.title" />
          <div
            class="flex flex-col justify-start gap-[12px] absolute translate-y-[100%] bottom-[-24px]"
          >
            <Label align="left" preset="h4" :text="book.title" />
            <Label
              align="left"
              class="text-[14px] text-medium-gray"
              :text="book.author"
            />
            <div class="flex">
              <GutenbergButton
                class="w-min mt-[8px]"
                :text="$t('gutenberg_download')"
                @click="() => handleClickDownload(book.classId)"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex items-end justify-center gap-[12px] laptop:gap-[48px] laptop:hidden"
      >
        <div class="flex flex-col gap-[24px] relative max-w-[220px]">
          <img
            class="shadow-2xl"
            :src="freeDownloadList[0].imgSrc"
            :alt="freeDownloadList[0].title"
          />
          <div
            class="flex flex-col justify-start gap-[12px] absolute translate-y-[100%] bottom-[-24px]"
          >
            <Label align="left" preset="h4" :text="freeDownloadList[0].title" />
            <Label
              align="left"
              class="text-[14px] text-medium-gray"
              :text="freeDownloadList[0].author"
            />
            <div class="flex">
              <GutenbergButton
                class="w-min mt-[8px]"
                :text="$t('gutenberg_download')"
                @click="() => handleClickDownload(freeDownloadList[0].classId)"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="w-full mb-[12px] laptop:hidden">
        <client-only>
          <Swiper
            ref="swiper"
            :options="swiperOptions"
            @slider-move="handleSliderMove"
          >
            <SwiperSlide
              v-for="book of freeDownloadList"
              :key="book.classId"
              class="px-[30px] sm:px-0"
              style="
          width: 240px; /* NOTE: Set width in style for auto slide per view calculation */
        "
            >
              <div class="flex flex-col gap-[24px] relative">
                <img class="shadow-2xl" :src="book.imgSrc" :alt="book.title" />
                <div class="flex flex-col justify-start gap-[12px]">
                  <Label align="left" preset="h4" :text="book.title" />
                  <Label
                    align="left"
                    class="text-[14px] text-medium-gray"
                    :text="book.author"
                  />
                  <div class="flex">
                    <GutenbergButton
                      class="w-min mt-[8px]"
                      :text="$t('gutenberg_download')"
                      @click="() => handleClickDownload(book.classId)"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </client-only>
      </div> -->
    </section>
    <div class="flex justify-center mt-[220px]">
      <GutenbergButton
        :text="$t('gutenberg_download_more')"
        preset="primary"
        @click="handleClickMore"
      />
    </div>

    <section
      name="publish"
      class="flex flex-col items-center justify-center px-[12px] w-full max-w-[820px] mx-auto laptop:p-0"
    >
      <div
        class="flex flex-col justify-center gap-[12px] border-[1px] border-like-cyan py-[40px] px-[24px] my-[40px] laptop:px-[88px]"
      >
        <client-only>
          <div class="w-full">
            <VuePlyr>
              <div class="plyr__video-embed">
                <iframe
                  width="100%"
                  src="https://www.youtube.com/embed/85DOlacoy5Q"
                  title="What is Decentralized Publishing"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            </VuePlyr>
          </div>
        </client-only>
        <Label preset="h3" :text="$t('gutenberg_publish_title')" />
        <Label
          class="text-[20px] text-medium-gray"
          :text="$t('gutenberg_publish_subtitle')"
        />
        <Label
          preset="p5"
          class="w-full text-like-green"
          :text="$t('gutenberg_publish_description')"
        />
      </div>
    </section>

    <section
      name="sign"
      class="flex flex-col justify-center gap-[18px] px-[12px] mt-[24px] mb-[180px] w-full mx-auto max-w-[740px] "
    >
      <Label
        align="center"
        class="text-[40px] font-200 text-like-green whitespace-pre-wrap laptop:text-[52px]"
        :text="$t('gutenberg_sign_title')"
      />
      <Label
        class="whitespace-pre-line"
        align="center"
        :text="$t('gutenberg_sign_description')"
      />
      <div class="flex justify-center mt-[12px]">
        <iframe
          src="https://newsletter.like.co/embed"
          width="480"
          height="320"
          style="border:1px solid #EEE; background:white;"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
    </section>

    <GutenbergBookListDialog
      :is-open-dialog="isOpenBookListDialog"
      @close="isOpenBookListDialog = false"
    />
  </div>
</template>
<script>
import {
  GUTENBERG_ISCN_VIDEO_LINK,
  GUTENBERG_FREE_DOWNLOAD_LIST,
} from '~/constant';

// import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'GutenbergPage',
  // components: {
  //   Swiper,
  //   SwiperSlide,
  // },
  layout: 'default',
  data() {
    return {
      isOpenBookListDialog: false,
    };
  },
  head() {
    return {
      title: this.$t('gutenbergPage.Title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('gutenbergPage.Og.Title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('gutenbergPage.Og.Description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('gutenbergPage.Og.Description'),
        },
      ],
    };
  },
  computed: {
    youtubeUrl() {
      return GUTENBERG_ISCN_VIDEO_LINK;
    },
    freeDownloadList() {
      return GUTENBERG_FREE_DOWNLOAD_LIST;
    },
    swiperOptions() {
      return {
        slidesPerView: 'auto',
        spaceBetween: 40,
        centeredSlides: true,
        breakpoints: {
          769: {
            centeredSlides: true,
          },
        },
        loop: true,
      };
    },
    swiper() {
      return this.$refs.swiper?.$swiper;
    },
  },
  mounted() {
    const hashValue = this.$route.hash?.substring(1);
    if (hashValue) {
      this.scrollToElement(hashValue);
    }
  },
  methods: {
    handleClickDownload(classId) {
      const url = this.$router.resolve(
        this.localeLocation({
          name: 'nft-class-classId',
          params: {
            classId,
          },
        })
      ).href;
      window.open(url, '_blank');
    },
    handleClickMore() {
      this.isOpenBookListDialog = true;
    },
    handleClickPrev() {
      this.$emit('slide-prev');
      this.swiper.slidePrev();
    },
    handleClickNext() {
      this.$emit('slide-next');
      this.swiper.slideNext();
    },
    handleSliderMove() {
      this.$emit('slider-move');
    },
    scrollToElement(hash) {
      setTimeout(() => {
        const currentRef = this.$refs[hash];
        currentRef.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    },
  },
};
</script>
