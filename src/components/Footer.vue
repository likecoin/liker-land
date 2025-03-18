<template>
  <footer>
    <div class="bg-like-green text-like-cyan">
      <div
        class="
          laptop:flex
          justify-between
          items-center
          pl-[56px]
          pr-[32px]
          pt-[32px]
          pb-[16px]
        "
      >
        <NuxtLink
          class="text-white transition-colors hover:text-like-cyan"
          to="/"
          @click.native="handleClickButton('home')"
        >
          <Logo class="fill-current h-[16px]" />
        </NuxtLink>
        <CommunityCTA class="mt-[24px] laptop:mt-0 !justify-start" />
      </div>

      <div
        class="flex flex-col-reverse desktop:flex-row pl-[56px] pr-[32px] pt-[24px] pb-[48px] gap-[3rem]"
      >
        <div class="flex-grow space-y-[3rem]">
          <aside class="space-y-[1rem]">
            <h3 class="text-[2rem] text-like-cyan-light font-bold">
              {{ $t('inquiry_form_title') }}
            </h3>
            <p>{{ $t('inquiry_form_description') }}</p>
            <p>{{ $t('inquiry_form_callout') }}</p>
            <ButtonV2 preset="secondary" @click="handleClickHelp">
              {{ $t('inquiry_form_button') }}
            </ButtonV2>
          </aside>

          <div
            class="
              grid
              laptop:grid-flow-col
              justify-start
              gap-x-[4rem]
              gap-y-[1rem]
            "
          >
            <div class="grid grid-flow-row gap-y-[16px]">
              <NuxtLink
                class="hover:underline"
                :to="localeLocation({ name: 'about' })"
                @click.native="handleClickButton('about_liker_land')"
              >
                {{ $t('footer_nav_about_liker_land') }}
              </NuxtLink>
            </div>
            <div class="grid grid-flow-row gap-y-[16px]">
              <NuxtLink
                class="hover:underline"
                :to="localeLocation({ name: 'about-nft-book' })"
                @click.native="handleClickButton('about_nft_book')"
              >
                {{ $t('footer_nav_about_nft_book') }}
              </NuxtLink>
            </div>
            <div class="grid grid-flow-row gap-y-[16px]">
              <NuxtLink
                class="hover:underline"
                :to="
                  localeLocation({
                    name: 'store',
                    query: {
                      ll_medium: 'footer',
                    },
                  })
                "
                @click.native="handleClickButton('store_books')"
              >
                {{ $t('footer_nav_store_books') }}
              </NuxtLink>
            </div>
            <div class="grid grid-flow-row gap-y-[16px]">
              <a
                class="hover:underline"
                target="_blank"
                :href="mintNftURL"
                @click="handleClickButton('mint_nft')"
              >
                {{ $t('footer_nav_mint_nft') }}
              </a>
            </div>
          </div>
        </div>
        <div class="flex items-start self-start">
          <Substack class="w-auto" />
        </div>
      </div>
    </div>
    <div
      class="
        bg-like-cyan-light
        px-[24px] laptop:px-[56px]
        py-[16px]
        grid grid-flow-col
        justify-center
        laptop:justify-start
        gap-x-[48px]
        text-like-green
      "
    >
      <a
        class="hover:underline"
        href="https://blog.liker.land?utm_source=likerland"
        >{{ $t('footer_nav_blog') }}</a
      >
      <a
        class="hover:underline"
        href="https://newsletter.liker.land?utm_source=likerland"
        >{{ $t('footer_nav_newsletter') }}</a
      >
      <a class="hover:underline" :href="$t('footer_nav_faq_link')">{{
        $t('footer_nav_faq')
      }}</a>
      <a
        class="hover:underline"
        href="https://likecoin.notion.site/liker-land-Terms-of-Service-dfcc13cf114e4fbc809c25559ce1d0e8?pvs=4"
        >{{ $t('footer_nav_tnc') }}</a
      >
      <button class="cursor-pointer hover:underline" @click="handleClickHelp">
        {{ $t('footer_nav_help') }}
      </button>
    </div>
  </footer>
</template>

<script>
import Logo from '~/assets/icons/logo.svg?inline';
import { logTrackerEvent } from '~/util/EventLogger';

import crispMixin from '~/mixins/crisp';
import { BOOK_PRESS_BASE } from '~/constant';

import Dialog from './Dialog';

export default {
  name: 'Footer',
  components: {
    Logo,
  },
  mixins: [crispMixin],
  computed: {
    mintNftURL() {
      return BOOK_PRESS_BASE;
    },
  },
  mounted() {
    window.CustomSubstackWidget = {
      substackUrl: 'likerland.substack.com',
      placeholder: 'example@gmail.com',
      buttonText: this.$t('footer_subscribe_newsletter_button'),
      theme: 'custom',
      colors: {
        primary: '#AAF1E7',
        input: '#00000000',
        email: '#AAF1E7',
        text: '#28646E',
      },
    };
  },
  methods: {
    handleClickHelp() {
      logTrackerEvent(this, 'footer', 'footer_click_help', '', 1);
      if (this.$crisp) {
        this.showCrisp();
        this.$crisp.push(['do', 'chat:open']);
      } else if (window.CRISP_WEBSITE_ID) {
        window.open(
          `https://go.crisp.chat/chat/embed/?website_id=${
            window.CRISP_WEBSITE_ID
          }`
        );
      } else {
        window.open(
          'https://discord.com/channels/763001015712350231/814761730349596712'
        );
      }
    },
    handleClickButton(buttonName) {
      logTrackerEvent(this, 'footer', `footer_click_${buttonName}`, '', 1);
    },
  },
};
</script>
