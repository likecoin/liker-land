<template>
  <main class="overflow-hidden">
    <section
      id="hero"
      class="pt-[124px] bg-like-green font-serif overflow-hidden"
    >
      <div
        class="relative desktop:grid grid-cols-5 w-full max-w-[600px] laptop:max-w-[1920px] mx-auto desktop:min-h-[464px] px-[32px]"
      >
        <img
          class="absolute left-[40%] h-full"
          src="~assets/images/index/v2/hero-image.png"
          style="mix-blend-mode: screen"
        />

        <div
          class="relative flex flex-col justify-end col-span-2 font-bold pb-[3.75rem]"
        >
          <h1 class="text-[3.75rem] text-like-cyan-light">
            {{ $t('index_hero_slogan_part1') }}
          </h1>
          <h1 class="text-[6.25rem] leading-1 text-white">
            {{ $t('index_hero_slogan_part2') }}
          </h1>
        </div>

        <div
          class="relative flex flex-col desktop:items-end justify-end col-span-3 text-like-green desktop:text-right"
        >
          <svg
            class="hidden desktop:block absolute bottom-0 left-0 w-[2560px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2560 141"
          >
            <path
              d="M270.22,20.13L80.74,120.87c-24.86,13.22-52.59,20.13-80.74,20.13h2560V0H350.97c-28.16,0-55.89,6.91-80.75,20.13Z"
              fill="#f7f7f7"
            />
          </svg>

          <svg
            class="absolute bottom-0 desktop:hidden right-0 w-[2560px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2560 141"
          >
            <path
              fill="#f7f7f7"
              d="M2289.78,20.13l189.48,100.74c24.86,13.22,52.59,20.13,80.74,20.13H0V0h2209.03c28.16,0,55.89,6.91,80.75,20.13Z"
            />
          </svg>

          <div class="relative mt-[3rem] max-w-[490px]">
            <h2 class="text-[2.25rem]">{{ $t('index_intro_title') }}</h2>
            <p class="text-[1.125rem] mt-[0.25rem]">
              {{ $t('index_intro_description') }}
            </p>
            <NuxtLink
              class="mt-[0.75rem]"
              :to="localeLocation({ name: 'about-nft-book' })"
            >
              {{ $t('index_intro_more_button') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section
      id="bookstore"
      class="w-full max-w-[600px] laptop:max-w-[1920px] mx-auto mt-[3rem] px-[10px]"
    >
      <div class="desktop:flex gap-[10px]">
        <div
          class="desktop:w-[80px] mb-[1rem] desktop:mb-0 text-[3rem] desktop:text-center desktop:break-all font-serif font-bold"
        >
          {{ $t('index_bookstore_title') }}
        </div>

        <div
          class="desktop:grid grid-cols-5 items-stretch gap-[20px] flex-grow"
        >
          <div class="col-span-2 relative">
            <NFTBookItemCardV2
              class="w-full sticky top-[124px]"
              class-cover-frame-aspect-ratio="min-h-[360px] desktop:min-h-[0] desktop:aspect-[4/5]"
              :class-id="stickyBookstoreItem.classId"
              preset="shelf"
              theme="spencer"
              :cover-size="600"
              :is-link-disabled="stickyBookstoreItem.isMultiple"
              @click-cover="handleClickItem($event, stickyBookstoreItem)"
            />
          </div>

          <ul
            class="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-[20px] items-stretch mt-[2rem] desktop:mt-0"
          >
            <li v-for="item in bookstoreItemsInGrid" :key="item.classId">
              <NFTBookItemCardV2
                :class-id="item.classId"
                class-cover-frame-aspect-ratio="min-h-[360px] sm:aspect-[4/5]"
                @click-cover="handleClickItem($event, item)"
              />
            </li>
          </ul>
        </div>
      </div>

      <div class="flex justify-center item-center pt-[6.25rem] pb-[5rem]">
        <ButtonV2
          :text="$t('index_bookstore_more_button')"
          :to="localeLocation({ name: 'store' })"
        />
      </div>

      <Dialog
        :open="dialogNFTClassList.length > 0"
        :header-text="$t('nft_book_shelf_multiple_nft_class_dialog_title')"
        panel-container-class="phone:max-w-[520px] laptop:max-w-[768px]"
        panel-component="CardV2"
        panel-class="overflow-y-scroll shadow-lg"
        @close="closeMultipleNFTClassDialog"
      >
        <ul class="flex flex-col gap-[2rem]">
          <li
            v-for="classId in dialogNFTClassList"
            :id="classId"
            :key="classId"
          >
            <NFTBookItemCard
              :class-id="classId"
              component-class="!bg-like-cyan-pale"
            />
          </li>
        </ul>
      </Dialog>
    </section>

    <section
      id="features"
      class="px-[2rem] pt-[5.5rem] pb-[7.5rem] bg-like-cyan-pale"
    >
      <div class="w-full max-w-[600px] laptop:max-w-[1024px] mx-auto">
        <h2 :class="['text-[2.5rem] text-center font-serif']">
          {{ $t('index_features_title') }}
        </h2>

        <ul
          :class="[
            'grid sm:grid-cols-2 desktop:grid-cols-4 gap-[5.5rem] mt-[5.5rem]',
          ]"
        >
          <li>
            <a
              class="flex flex-col items-center"
              href="https://dungfookei.com/en/why-should-i-publish-a-book-using-nft/"
              target="_blank"
              rel="noopener"
            >
              <img
                class="w-[100px] h-[100px]"
                src="~assets/images/about/nft-book/icons/ownership.png"
              />
              <h4 class="font-600 mt-[3rem]">
                {{ $t('about_nft_book_section_features_ownership_title') }}
              </h4>
              <p class="mt-[0.5rem] text-center">
                {{
                  $t('about_nft_book_section_features_ownership_description')
                }}
              </p>
            </a>
          </li>
          <li>
            <a
              class="flex flex-col items-center"
              href="https://newsletter.liker.land/p/4de"
              target="_blank"
              rel="noopener"
            >
              <img
                class="w-[100px] h-[100px]"
                src="~assets/images/about/nft-book/icons/gifting.png"
              />
              <h4 class="font-600 mt-[3rem]">
                {{ $t('about_nft_book_section_features_gifting_title') }}
              </h4>
              <p class="mt-[0.5rem] text-center">
                {{ $t('about_nft_book_section_features_gifting_description') }}
              </p>
            </a>
          </li>
          <li>
            <NuxtLink
              class="flex flex-col items-center"
              :to="localeLocation({ name: 'gutenberg' })"
            >
              <img
                class="w-[100px] h-[100px]"
                src="~assets/images/about/nft-book/icons/multimedia.png"
              />
              <h4 class="font-600 mt-[3rem]">
                {{ $t('about_nft_book_section_features_multimedia_title') }}
              </h4>
              <p class="mt-[0.5rem] text-center">
                {{
                  $t('about_nft_book_section_features_multimedia_description')
                }}
              </p>
            </NuxtLink>
          </li>
          <li>
            <a
              class="flex flex-col items-center"
              href="https://blog.like.co/zh/%E5%85%A7%E5%AE%B9%E6%84%9B%E5%A5%BD%E8%80%85%E7%9A%84%E5%BB%A3%E5%A0%B4-liker-land-%E6%96%B0%E5%8A%9F%E8%83%BD/"
              target="_blank"
              rel="noopener"
            >
              <img
                class="w-[100px] h-[100px]"
                src="~assets/images/about/nft-book/icons/social.png"
              />
              <h4 class="font-600 mt-[3rem]">
                {{ $t('about_nft_book_section_features_social_title') }}
              </h4>
              <p class="mt-[0.5rem] text-center">
                {{ $t('about_nft_book_section_features_social_description') }}
              </p>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section id="categories" class="bg-gradient-to-b from-like-cyan-pale">
      <ul class="flex justify-center items-center gap-[2.25rem]">
        <li>
          <NuxtLink
            :class="[
              'flex',
              'items-center',
              'gap-[10px]',
              'text-like-green',
              'font-serif',
              'rounded-[12px]',
              'border-[1px]',
              'bg-gradient-to-b',
              'from-[#F3EFEB]',
              'to-[#ECE9E2]',
              'border-[#CFC6BC]',
            ]"
            :to="localeLocation({ name: 'store' })"
          >
            <div class="p-[2rem] pr-0 text-left">
              <div class="opacity-50">
                {{ $t('index_category_button_browse_label') }}
              </div>
              <div class="text-[2.25rem]">
                {{ $t('index_category_button_ebook') }}
              </div>
            </div>
            <img
              class="max-w-[380px] my-[-2rem] translate-x-[2rem] scale-[1.2] object-contain h-full"
              :alt="$t('index_category_button_ebook')"
              src="~assets/images/index/v2/category-ebook.png"
            />
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section id="faq" class="pt-[12rem] pb-[3rem] font-serif">
      <div
        class="laptop:grid grid-cols-5 w-full max-w-[600px] laptop:max-w-[1600px] mx-auto px-[10px]"
      >
        <div class="flex flex-col items-start justify-start col-span-2">
          <div class="relative flex laptop:justify-center">
            <img
              class="absolute top-[50%] translate-y-[-50%] pointer-events-none scale-[4]"
              src="~assets/images/index/v2/faq-bg.png"
            />
            <h2
              class="relative text-[2rem] laptop:text-[3rem] text-like-green font-[600]"
            >
              {{ $t('index_faq_title') }}
            </h2>
          </div>
        </div>

        <div class="relative mt-[2.5rem] laptop:mt-0 col-span-3">
          <ul class="w-full space-y-[1rem]">
            <li v-for="(faq, index) in faqs" :key="`faq-${index}`">
              <IndexPageFAQItem
                :number="index + 1"
                :is-initial-open="index === 0"
              >
                <template #question>
                  {{ faq.question }}
                </template>
                <template #answer>
                  <div v-html="faq.answer" />
                </template>
              </IndexPageFAQItem>
            </li>
          </ul>

          <div class="flex justify-center mt-[32px]">
            <ButtonV2
              theme="glow"
              preset="tertiary"
              href="https://docs.like.co/faq"
              :text="$t('about_nft_page_faq_more_button')"
            />
          </div>
        </div>
      </div>
    </section>

    <section id="social" class="py-[48px]">
      <h2
        class="flex flex-wrap items-center justify-center gap-[0.75rem] text-[2rem] font-serif font-bold"
      >
        {{ $t('index_social_title') }}
        <ButtonV2
          theme="glow"
          preset="tertiary"
          text="@liker.land"
          href="https://instagram.com/@liker.land?utm_medium=web&utm_source=likerlandweb"
        />
      </h2>
    </section>
  </main>
</template>

<script>
import bookstoreMixin from '~/mixins/bookstore';

export default {
  name: 'IndexV2',
  mixins: [bookstoreMixin],
  data() {
    return {
      dialogNFTClassList: [],
    };
  },
  async fetch({ store }) {
    try {
      await store.dispatch('fetchBookstoreList');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  head() {
    const title = this.$t('og_title');
    const description = this.$t('og_description');

    const classIds = Array.from(
      new Set(this.bookstoreItems.map(b => b.classId).flat())
    );
    const links = [];
    classIds.forEach(classId =>
      links.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${classId}`,
      })
    );

    const meta = [
      {
        hid: 'og:title',
        property: 'og:title',
        content: title,
      },
      {
        hid: 'description',
        name: 'description',
        content: description,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: description,
      },
    ];
    return {
      title,
      meta,
      link: links,
    };
  },
  computed: {
    bookstoreItems() {
      return this.bookstoreListItemsInHighlighted.slice(0, 7).map(item => {
        const isMultiple =
          Array.isArray(item.classId) && item.classId.length > 1;

        const newItem = {
          ...item,
          isMultiple,
          classId: isMultiple ? item.classId[0] : item.classId,
        };

        if (isMultiple) {
          newItem.classIds = item.classId;
        }

        return newItem;
      });
    },
    stickyBookstoreItem() {
      return this.bookstoreItems[0];
    },
    bookstoreItemsInGrid() {
      return this.bookstoreItems.slice(1);
    },
    faqs() {
      return this.$t('faq_list').map(({ q: question, a: answer }) => ({
        question,
        answer,
      }));
    },
  },
  methods: {
    handleClickItem(event, item) {
      if (item.isMultiple) {
        event.stopPropagation();
        event.preventDefault();
        this.dialogNFTClassList = item.classIds;
      }
    },
    closeMultipleNFTClassDialog() {
      this.dialogNFTClassList = [];
    },
  },
};
</script>
