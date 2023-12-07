<template>
  <div
    class="flex flex-col justify-center w-full mx-auto max-w-[1020px] text-dark-gray px-[12px] gap-[24px]"
  >
    <img src="~/assets/images/gutenberg/bookStore.png" alt="" />
    <Label
      class="w-full"
      preset="h2"
      align="center"
      :text="$t('gutenberg_intro_title')"
    />
    <Label
      class="w-full"
      preset="h3"
      align="center"
      :text="$t('gutenberg_intro_subtitle')"
    />
    <div class="flex justify-center">
      <Label
        class="w-full max-w-[800px]"
        preset="p5"
        align="center"
        :text="$t('gutenberg_intro_description')"
      />
    </div>
    <section
      name="gutenbergProject"
      class="flex flex-col my-[24px] desktop:grid grid-cols-2 gap-x-[16px] gap-y-[32px]"
    >
      <div class="col-span-1 flex flex-col items-center gap-[24px]">
        <Label preset="h3" :text="$t('gutenberg_project_title')" />
        <Label :text="$t('gutenberg_project_description')" />
      </div>
      <div class="col-span-1 flex flex-col items-center gap-[24px]">
        <img src="~/assets/images/gutenberg/gutenbergProject.png" alt="" />
      </div>
    </section>

    <section
      name="decentralize"
      class="flex flex-col my-[24px] desktop:grid grid-cols-2 gap-x-[16px] gap-y-[32px]"
    >
      <div class="col-span-1 flex flex-col items-center gap-[24px]">
        <img src="~/assets/images/gutenberg/decentralize.png" alt="" />
      </div>
      <div class="col-span-1 flex flex-col items-center gap-[24px]">
        <Label preset="h3" :text="$t('gutenberg_decentralize_title')" />
        <Label :text="$t('gutenberg_decentralize_description')" />
      </div>
    </section>

    <section
      name="blende"
      class="flex flex-col my-[24px] desktop:grid grid-cols-2 gap-x-[16px] gap-y-[32px]"
    >
      <div class="col-span-1 flex flex-col items-center gap-[24px]">
        <Label preset="h3" :text="$t('gutenberg_blende_title')" />
        <Label :text="$t('gutenberg_blende_description')" />
      </div>
      <div class="col-span-1 flex flex-col items-center gap-[24px]">
        <img src="~/assets/images/gutenberg/blende.jpeg" alt="" />
      </div>
    </section>

    <section class="flex flex-col gap-[18px] my-[24px]" name="freeEpub">
      <Label
        align="center"
        preset="h3"
        :text="$t('gutenberg_download_title')"
      />
      <Label
        align="center"
        preset="h5"
        :text="$t('gutenberg_download_subtitle')"
      />
      <div class="flex justify-center mb-[12px]">
        <Label
          class="w-full max-w-[800px]"
          preset="p5"
          align="center"
          :text="$t('gutenberg_download_description')"
        />
      </div>
      <div class="flex flex-col items-center justify-evenly desktop:flex-row">
        <div class="flex flex-col gap-[12px]">
          <img src="~/assets/images/gutenberg/Frankenstein.png" alt="" />
          <Label
            align="center"
            preset="h4"
            :text="$t('gutenberg_book_frankenstein')"
          />
          <ButtonV2
            preset="tertiary"
            :text="$t('gutenberg_download')"
            @click="handleClickFrankenstein"
          ></ButtonV2>
        </div>
        <div class="flex flex-col gap-[12px]">
          <img src="~/assets/images/gutenberg/WhiteFang.jpeg" alt="" />
          <Label
            align="center"
            preset="h4"
            :text="$t('gutenberg_book_whiteFang')"
          />
          <ButtonV2
            preset="tertiary"
            :text="$t('gutenberg_download')"
            @click="handleClickWhiteFang"
          ></ButtonV2>
        </div>
      </div>
      <ButtonV2
        class="w-[80%] h-[52px] mx-auto my-[12px]"
        preset="primary"
        :text="$t('gutenberg_download_more')"
        @click="handleClickMore"
      ></ButtonV2>
    </section>

    <section
      name="publish"
      class="flex flex-col justify-center gap-[18px] my-[24px]"
    >
      <Label align="center" preset="h3" :text="$t('gutenberg_publish_title')" />
      <Label
        align="center"
        preset="h5"
        :text="$t('gutenberg_publish_subtitle')"
      />
      <img src="~/assets/images/gutenberg/publish.png" alt="" />
      <div class="flex justify-center mb-[12px]">
        <Label
          class="w-full"
          preset="p5"
          align="center"
          :text="$t('gutenberg_publish_description')"
        />
      </div>
    </section>

    <section
      name="sign"
      class="flex flex-col justify-center gap-[18px] mt-[24px] mb-[120px] "
    >
      <Label align="center" preset="h3" :text="$t('gutenberg_sign_title')" />
      <Label
        class="whitespace-pre-line"
        align="center"
        :text="$t('gutenberg_sign_description')"
      />
      <ButtonV2
        class="mx-auto w-min"
        :text="$t('gutenberg_sign_button')"
      ></ButtonV2>
    </section>

    <GutenbergBookListDialog
      :is-open-dialog="isOpenBookListDialog"
      @close="isOpenBookListDialog = false"
    />
  </div>
</template>
<script>
import { fetchGutenbergCsv } from '~/util/api';

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
  async mounted() {
    await this.loadCSVFile();
  },
  methods: {
    async loadCSVFile() {
      try {
        console.log('here');
        const response = await this.$api.$get(fetchGutenbergCsv()); // 替换为你的CSV文件路径
        console.log('response', response);
        // if (response.ok) {
        //   const content = await response.text();
        //   this.csvContent = content;
        //   // 在这里处理CSV文件内容，例如将其解析为数据结构
        //   console.log(content);
        // } else {
        //   console.error('Failed to fetch CSV file');
        // }
      } catch (error) {
        console.error('Error loading CSV file:', error);
      }
    },
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
      this.isOpenBookListDialog = true;
    },
  },
};
</script>
