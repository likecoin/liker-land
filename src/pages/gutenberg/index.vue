<template>
  <div class="flex flex-col justify-center text-dark-gray gap-[24px]">
    <section name="hero" :class="['mb-[36px]', 'desktop:mb-[60px]']">
      <div
        :class="[
          'relative',
          'flex',
          'justify-center',
          'mb-[48px]',

          'px-[36px]',
          'laptop:px-[24px]',

          'pb-[60px]',
          'desktop:pb-[160px]',
        ]"
      >
        <img
          :class="['w-full', 'max-w-[90%]', 'desktop:max-w-[936px]']"
          src="~/assets/images/gutenberg/hero.png"
          alt=""
        />
        <div
          :class="[
            'absolute',
            'w-full',
            'bottom-0',
            'bg-like-cyan-pale',
            '-z-1',

            'h-[120px]',
            'sm:h-[160px]',
            'desktop:h-[398px]',
          ]"
        />
        <img
          :class="[
            'absolute',
            'bottom-0',

            'w-full',
            'max-w-[95%]',
            'sm:w-auto',
          ]"
          src="~/assets/images/gutenberg/library.svg"
          alt=""
        />
        <img
          :class="[
            'absolute',

            'w-full',
            'max-w-[40%]',
            'laptop:w-auto',

            'bottom-[-20px]',
            'laptop:bottom-[-30px]',
          ]"
          src="~/assets/images/gutenberg/title.svg"
          alt=""
        />
      </div>
      <Label
        :class="[
          'w-full',

          'text-[36px]',
          'laptop:text-[52px]',

          'text-like-green',
          'font-[300]',
          'italic',
          'whitespace-pre-wrap',
        ]"
        align="center"
        :text="$t('gutenberg_intro_title')"
      />
    </section>

    <section
      name="intro"
      :class="[
        'grid',
        'grid-cols-3',
        'mb-[60px]',

        'px-[24px]',
        'laptop:px-[85px]',

        'w-full',
        'mx-auto',
        'max-w-[1024px]',
      ]"
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
        :class="[
          'col-span-3',
          'desktop:col-span-2',
          'desktop:col-start-2',

          'mt-[12px]',
          'desktop:mt-0',
        ]"
      >
        <i18n
          :class="['text-like-green', 'text-left']"
          tag="div"
          path="gutenberg_intro_description"
        >
          <a
            href="https://www.gutenberg.org/"
            target="_blank"
            rel="noopener"
            class="underline"
            place="ProjectGutenberg"
            >{{ $t('gutenberg_external_link_gutenberg') }}</a
          >
        </i18n>
      </div>
    </section>

    <section
      name="gutenbergProject"
      :class="[
        'flex',
        'flex-col',
        'relative',
        'items-center',

        'px-[24px]',
        'laptop:px-[85px]',

        'mb-[180px]',
        'w-full',
        'mx-auto',
        'max-w-[1024px]',

        'desktop:grid',
        'desktop:grid-cols-2',
      ]"
    >
      <div :class="['col-span-1', 'relative', 'flex', 'justify-center']">
        <div
          :class="[
            'relative',
            'w-[60%]',

            'mb-[12px]',
            'desktop:mb-0',
            'desktop:ml-[-24px]',
          ]"
        >
          <img
            :class="['absolute', 'top-[-12px]', 'left-[-12px]']"
            src="~/assets/images/gutenberg/imgContainer.svg"
            alt=""
          />
          <img
            :class="['w-full', 'max-w-[256px]']"
            src="~/assets/images/gutenberg/gutenbergProject.png"
            alt=""
          />
        </div>
      </div>
      <img
        :class="[
          'absolute',
          'translate-y-[50%]',

          'bottom-[-75px]',
          'laptop:bottom-[-35px]',
          'desktop:z-1',
        ]"
        src="~/assets/images/gutenberg/sound.svg"
        alt=""
      />
      <div :class="['col-span-1', 'flex', 'flex-col', 'gap-[24px]']">
        <Label preset="h2" :text="$t('gutenberg_project_title')" />
        <i18n
          :class="['text-like-green', 'text-left']"
          tag="div"
          path="gutenberg_project_description"
        >
          <a
            href="https://marhamilresearch4.blob.core.windows.net/gutenberg-public/Website/index.html"
            target="_blank"
            rel="noopener"
            class="underline"
            place="MIT"
            >{{ $t('gutenberg_external_link_MIT') }}</a
          >
        </i18n>
      </div>
    </section>

    <section
      name="decentralize"
      :class="[
        'relative',
        'flex',
        'items-center',
        'justify-center',
        'px-[24px]',

        'mb-[160px]',
        'laptop:mb-[220px]',

        'w-full',
        'mx-auto',
        'max-w-[1024px]',
      ]"
    >
      <div
        :class="[
          'flex',
          'flex-col',
          'items-center',
          'gap-[24px]',

          'w-full',
          'desktop:w-[60%]',
        ]"
      >
        <Label preset="h2" :text="$t('gutenberg_decentralize_title')" />
        <i18n
          :class="['text-like-green', 'text-left']"
          tag="div"
          path="gutenberg_decentralize_description"
        >
          <a
            href="https://www.gutenberg.org/"
            target="_blank"
            rel="noopener"
            class="underline"
            place="ProjectGutenberg"
            >{{ $t('gutenberg_external_link_gutenberg') }}</a
          >
          <a
            href="https://docs.like.co/general-guides/decentralized-publishing"
            target="_blank"
            rel="noopener"
            class="underline"
            place="decentralized"
            >{{ $t('gutenberg_external_link_decentralized_publishing') }}</a
          >
        </i18n>
      </div>
      <img
        :class="[
          'absolute',
          'translate-y-[50%]',

          'bottom-[-105px]',
          'laptop:bottom-[-125px]',
        ]"
        src="~/assets/images/gutenberg/decentralize.svg"
        alt=""
      />
    </section>

    <section
      name="blende"
      :class="[
        'flex',
        'flex-col',
        'items-center',
        'px-[12px]',
        'mx-auto',
        'my-[40px]',
        'w-full',
        'max-w-[1024px]',

        'desktop:pr-[85px]',
        'desktop:grid',
        'grid-cols-7',
        'gap-x-[48px]',
        'gap-y-[32px]',
      ]"
    >
      <div
        :class="[
          'col-span-3',
          'flex',
          'flex-col',
          'items-center',
          'gap-[24px]',
        ]"
      >
        <img src="~/assets/images/gutenberg/blende.png" alt="" />
      </div>
      <div
        :class="[
          'flex',
          'laptop:hidden',

          'flex-col',
          'justify-center',
          'gap-[24px]',
          'px-[24px]',
        ]"
      >
        <Label
          preset="h2"
          align="center"
          :text="$t('gutenberg_blende_title')"
        />
        <i18n
          :class="['text-like-green', 'text-left']"
          tag="div"
          path="gutenberg_blende_description"
        >
          <a
            href="https://like.co"
            target="_blank"
            rel="noopener"
            class="underline"
            place="LikeCoin"
            >{{ $t('gutenberg_external_link_likecoin') }}</a
          >
          <a
            href="https://docs.like.co/general-guides/decentralized-publishing"
            target="_blank"
            rel="noopener"
            class="underline"
            place="decentralized"
            >{{ $t('gutenberg_external_link_decentralized_publishing') }}</a
          >
          <a
            href="https://docs.like.co/general-guides/decentralized-publishing/what-is-iscn"
            target="_blank"
            rel="noopener"
            class="underline"
            place="ISCN"
            >{{ $t('gutenberg_external_link_ISCN') }}</a
          >
          <a
            href="https://liker.land"
            target="_blank"
            rel="noopener"
            class="underline"
            place="LikerLand"
            >{{ $t('gutenberg_external_link_likerland') }}</a
          >
          <a
            href="https://www.gutenberg.org/"
            target="_blank"
            rel="noopener"
            class="underline"
            place="ProjectGutenberg"
            >{{ $t('gutenberg_external_link_gutenberg') }}</a
          >
        </i18n>
      </div>
      <div
        :class="[
          'hidden',
          'laptop:flex',
          'laptop:items-start',

          'col-span-4',
          'flex-col',
          'gap-[24px]',

          'px-[24px]',
          'laptop:px-0',
        ]"
      >
        <Label preset="h2" :text="$t('gutenberg_blende_title')" />
        <i18n
          :class="['text-like-green', 'text-left']"
          tag="div"
          path="gutenberg_blende_description"
        >
          <a
            href="https://like.co"
            target="_blank"
            rel="noopener"
            class="underline"
            place="LikeCoin"
            >{{ $t('gutenberg_external_link_likecoin') }}</a
          >
          <a
            href="https://docs.like.co/general-guides/decentralized-publishing"
            target="_blank"
            rel="noopener"
            class="underline"
            place="decentralized"
            >{{ $t('gutenberg_external_link_decentralized_publishing') }}</a
          >
          <a
            href="https://docs.like.co/general-guides/decentralized-publishing/what-is-iscn"
            target="_blank"
            rel="noopener"
            class="underline"
            place="ISCN"
            >{{ $t('gutenberg_external_link_ISCN') }}</a
          >
          <a
            href="https://liker.land"
            target="_blank"
            rel="noopener"
            class="underline"
            place="LikerLand"
            >{{ $t('gutenberg_external_link_likerland') }}</a
          >
          <a
            href="https://www.gutenberg.org/"
            target="_blank"
            rel="noopener"
            class="underline"
            place="ProjectGutenberg"
            >{{ $t('gutenberg_external_link_gutenberg') }}</a
          >
        </i18n>
      </div>
    </section>

    <section
      id="download"
      ref="download"
      :class="[
        'flex',
        'flex-col',
        'gap-[18px]',
        'my-[40px]',
        'px-[12px]',
        'pt-[50px]',
        'w-full',
        'bg-like-cyan-pale',
      ]"
      name="freeEpub"
    >
      <Label
        align="center"
        preset="h2"
        :text="$t('gutenberg_download_title')"
      />
      <Label
        align="center"
        :class="['text-[20px]', 'text-like-green']"
        :text="$t('gutenberg_download_subtitle')"
      />
      <div :class="['hidden', 'laptop:flex', 'justify-center']">
        <ul
          :class="[
            'flex',
            'flex-wrap',
            'items-end',
            'justify-center',
            'gap-[24px]',
            'laptop:gap-[48px]',
          ]"
        >
          <li v-for="book of freeDownloadList" :key="book.classId">
            <GutenbergDownloadItem
              :book-info="book"
              @download="handleClickDownload"
            />
          </li>
        </ul>
      </div>
      <div
        :class="[
          'flex',
          'laptop:hidden',

          'items-end',
          'justify-center',

          'gap-[12px]',
          'laptop:gap-[48px]',
        ]"
      >
        <GutenbergDownloadItem
          :book-info="freeDownloadList[0]"
          @download="handleClickDownload"
        />
      </div>
    </section>
    <div :class="['flex', 'justify-center', 'mt-[220px]']">
      <NuxtLink :to="localeLocation({ name: 'gutenberg-free-audio-books' })">
        <GutenbergButton
          :text="$t('gutenberg_download_more')"
          preset="primary"
          @click="handleClickMore"
        />
      </NuxtLink>
    </div>

    <section
      name="publish"
      :class="[
        'flex',
        'flex-col',
        'items-center',
        'justify-center',

        'px-[12px]',
        'laptop:p-0',

        'w-full',
        'max-w-[820px]',
        'mx-auto',
      ]"
    >
      <div
        :class="[
          'flex',
          'flex-col',
          'justify-center',
          'gap-[12px]',
          'border-[1px]',
          'border-like-cyan',
          'py-[40px]',
          'my-[40px]',

          'px-[24px]',
          'laptop:px-[88px]',
        ]"
      >
        <client-only>
          <iframe
            :class="['w-full', 'aspect-video']"
            src="https://www.youtube.com/embed/85DOlacoy5Q"
            title="What is Decentralized Publishing"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </client-only>
        <Label preset="h3" :text="$t('gutenberg_publish_title')" />
        <Label
          :class="['text-[20px]', 'text-medium-gray']"
          :text="$t('gutenberg_publish_subtitle')"
        />
        <i18n
          :class="['text-like-green', 'text-left']"
          tag="div"
          path="gutenberg_publish_description"
        >
          <a
            href="https://docs.like.co/general-guides/decentralized-publishing"
            target="_blank"
            rel="noopener"
            class="underline"
            place="decentralized"
            >{{ $t('gutenberg_external_link_decentralized_publishing') }}</a
          >
          <a
            href="https://docs.like.co/general-guides/decentralized-publishing/what-is-iscn"
            target="_blank"
            rel="noopener"
            class="underline"
            place="ISCN"
            >{{ $t('gutenberg_external_link_ISCN') }}</a
          >
          <a
            href="https://liker.land/store"
            target="_blank"
            rel="noopener"
            class="underline"
            place="bookstore"
            >{{ $t('gutenberg_external_link_bookstore') }}</a
          >
        </i18n>
      </div>
    </section>

    <section
      name="sign"
      :class="[
        'flex',
        'flex-col',
        'justify-center',
        'gap-[18px]',
        'px-[12px]',
        'mt-[24px]',
        'mb-[180px]',
        'w-full',
        'mx-auto',
        'max-w-[740px]',
      ]"
    >
      <Label
        align="center"
        :class="[
          'text-[40px]',
          'laptop:text-[52px]',

          'font-200',
          'text-like-green',
          'whitespace-pre-wrap',
        ]"
        :text="$t('gutenberg_sign_title')"
      />
      <i18n
        :class="['text-like-green', 'text-left']"
        tag="div"
        path="gutenberg_sign_description"
      >
        <a
          href="https://docs.like.co/general-guides/decentralized-publishing"
          target="_blank"
          rel="noopener"
          class="underline"
          place="decentralized"
          >{{ $t('gutenberg_external_link_decentralized_publishing') }}</a
        >
      </i18n>
      <div
        :class="[
          'flex',
          'justify-center',
          'items-center',
          'w-full',
          'my-[68px]',
        ]"
      >
        <Substack domain-type="LikeCoin" preset="dark" />
      </div>
    </section>
  </div>
</template>
<script>
import {
  GUTENBERG_ISCN_VIDEO_LINK,
  GUTENBERG_FREE_DOWNLOAD_LIST,
} from '~/constant';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'GutenbergPage',
  layout: 'default',
  data() {
    return {
      isOpenBookListDialog: false,
    };
  },
  head() {
    return {
      title: this.$t('gutenbergPage_og_title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('gutenbergPage_og_title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('gutenbergPage_og_description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('gutenbergPage_og_description'),
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
      logTrackerEvent(this, 'Gutenberg', 'clickDownload', classId, 1);
    },
    handleClickMore() {
      logTrackerEvent(this, 'Gutenberg', 'clickShowMore', '', 1);
    },
    scrollToElement(hash) {
      setTimeout(() => {
        const currentRef = this.$refs[hash];
        currentRef?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    },
  },
};
</script>
