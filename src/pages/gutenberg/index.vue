<template>
  <div class="flex flex-col justify-center text-dark-gray gap-[24px]">
    <section
      name="intro"
      class="grid grid-cols-3 mb-[60px] px-[85px] w-full mx-auto max-w-[1024px]"
    >
      <div class="col-span-3 mb-[120px]">
        <Label
          class="w-full whitespace-pre-wrap text-[54px] text-like-green"
          align="left"
          :text="$t('gutenberg_intro_title')"
        />
      </div>
      <div class="col-span-3">
        <Label
          class="w-full whitespace-pre-wrap"
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
      class="flex flex-col desktop:grid desktop:grid-cols-2 relative items-center px-[85px] mb-[180px] w-full mx-auto max-w-[1024px]"
    >
      <div class="flex justify-center col-span-1">
        <div class="relative w-[60%] mb-[12px] desktop:ml-[-24px] desktop:mb-0">
          <img
            class="absolute top-[-12px] left-[-12px]"
            src="~/assets/images/gutenberg/imgContainer.svg"
            alt=""
          />
          <img src="~/assets/images/gutenberg/gutenbergProject.png" alt="" />
        </div>
      </div>
      <div class="col-span-1 flex flex-col gap-[24px]">
        <Label preset="h2" :text="$t('gutenberg_project_title')" />
        <Label
          class="text-like-green"
          :text="$t('gutenberg_project_description')"
        />
      </div>
      <img
        class="absolute bottom-[-35px] translate-y-[50%]"
        src="~/assets/images/gutenberg/sound.svg"
        alt=""
      />
    </section>

    <section
      name="decentralize"
      class="relative flex items-center justify-center mb-[220px] w-full mx-auto max-w-[1024px]"
    >
      <div class="flex flex-col items-center gap-[24px] desktop:w-[60%]">
        <Label preset="h2" :text="$t('gutenberg_decentralize_title')" />
        <Label
          class="text-like-green"
          :text="$t('gutenberg_decentralize_description')"
        />
      </div>
      <img
        class="absolute bottom-[-125px] translate-y-[50%]"
        src="~/assets/images/gutenberg/decentralize.svg"
        alt=""
      />
    </section>

    <section
      name="blende"
      class="flex flex-col my-[40px] px-[85px] desktop:pr-[85px] pl-0 desktop:grid grid-cols-3 gap-x-[48px] gap-y-[32px] items-center w-full mx-auto max-w-[1024px]"
    >
      <div class="col-span-1 flex flex-col items-center gap-[24px]">
        <img src="~/assets/images/gutenberg/blende.png" alt="" />
      </div>
      <div class="col-span-2 flex flex-col items-start gap-[24px]">
        <Label preset="h2" :text="$t('gutenberg_blende_title')" />
        <Label
          class="text-like-green"
          :text="$t('gutenberg_blende_description')"
        />
      </div>
    </section>

    <section
      class="flex flex-col gap-[18px] my-[40px] pt-[50px] bg-like-cyan-pale w-full"
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
      <div class="flex items-center justify-center gap-[48px]">
        <div class="flex flex-col gap-[24px] relative max-w-[220px]">
          <img
            class="shadow-xl"
            src="~/assets/images/gutenberg/Frankenstein.png"
            alt=""
          />
          <div
            class="flex flex-col justify-start gap-[12px] desktop:absolute desktop:translate-y-[100%] desktop:bottom-[-24px]"
          >
            <Label
              align="left"
              preset="h4"
              :text="$t('gutenberg_book_frankenstein')"
            />
            <Label
              align="left"
              class="text-[14px] text-medium-gray"
              :text="$t('gutenberg_author_frankenstein')"
            />
            <div class="flex">
              <GutenbergButton
                class="w-min mt-[8px]"
                :text="$t('gutenberg_download')"
                @click="handleClickFrankenstein"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-[24px] relative max-w-[220px]">
          <img
            class="shadow-xl"
            src="~/assets/images/gutenberg/WhiteFang.jpeg"
            alt=""
          />
          <div
            class="flex flex-col justify-start gap-[12px] desktop:absolute desktop:translate-y-[100%] desktop:bottom-[-24px]"
          >
            <Label
              align="center"
              preset="h4"
              :text="$t('gutenberg_book_whiteFang')"
            />
            <Label
              align="left"
              class="text-[14px] text-medium-gray"
              :text="$t('gutenberg_author_whiteFang')"
            />
            <div class="flex">
              <GutenbergButton
                class="mt-[8px]"
                :text="$t('gutenberg_download')"
                @click="handleClickWhiteFang"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="flex justify-center mt-[160px]">
      <GutenbergButton
        :text="$t('gutenberg_download_more')"
        preset="primary"
        @click="handleClickMore"
      />
    </div>

    <section
      name="publish"
      class="flex flex-col justify-center gap-[12px] border-[1px] border-like-cyan py-[40px] px-[88px] my-[40px] w-full mx-auto max-w-[820px]"
    >
      <Label preset="h2" :text="$t('gutenberg_publish_title')" />
      <Label
        class="text-[20px] text-medium-gray"
        :text="$t('gutenberg_publish_subtitle')"
      />
      <Label
        preset="p5"
        class="w-full text-like-green"
        :text="$t('gutenberg_publish_description')"
      />
    </section>

    <section
      name="sign"
      class="flex flex-col justify-center gap-[18px] mt-[24px] mb-[180px] w-full mx-auto max-w-[740px] "
    >
      <Label
        align="center"
        class="text-[54px] font-200 text-like-green whitespace-pre-wrap"
        :text="$t('gutenberg_sign_title')"
      />
      <Label
        class="whitespace-pre-line"
        align="center"
        :text="$t('gutenberg_sign_description')"
      />
      <div class="flex justify-center mt-[12px]">
        <GutenbergButton
          class="w-min"
          :text="$t('gutenberg_sign_button')"
          preset="primary"
          @click="handleClickMore"
        />
      </div>
    </section>

    <GutenbergBookListDialog
      :is-open-dialog="isOpenBookListDialog"
      @close="isOpenBookListDialog = false"
    />
  </div>
</template>
<script>
export default {
  name: 'GutenbergPage',
  layout: 'default',
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
  computed: {},
  data() {
    return {
      isOpenBookListDialog: false,
    };
  },
  methods: {
    handleClickFrankenstein() {
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId',
          params: {
            classId:
              'likenft1hk54hskjr0hn4lqjsexuj8gd7w9m6pvpzn0yyrqlhrvstj07d97qyesck4',
          },
        })
      );
    },
    handleClickWhiteFang() {
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId',
          params: {
            classId:
              'likenft199wngygyv2nj7yv8264kxrzqstvptv35awn20c64djz9y4c00xmsvz08yy',
          },
        })
      );
    },
    handleClickMore() {
      console.log('here');
      this.isOpenBookListDialog = true;
    },
  },
};
</script>
