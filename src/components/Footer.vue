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
              <a
                class="cursor-pointer hover:underline"
                @click="handleClickButton('about_team')"
                >{{ $t('footer_nav_about_liker_land') }}</a
              >
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
    <Dialog
      v-model="isOpenAboutTeam"
      preset="custom"
      panel-class="text-white shadow-lg bg-like-green max-w-[520px] w-full p-[48px] rounded-[24px]"
    >
      <div class="text-like-cyan-pale text-opacity-[0.4]">
        {{ $t('about_the_team_top_label') }}
      </div>
      <h1 class="text-like-cyan text-[32px] my-[40px] font-proxima font-[700]">
        {{ $t('about_the_team_title') }}
      </h1>
      <div>{{ $t('about_the_team_description') }}</div>
      <svg
        class="mt-[32px]"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M39.25 5.91784L50.9628 12.6802C55.4491 15.2704 58.2128 20.0573 58.2128 25.2376V38.7624C58.2128 43.9427 55.4491 48.7296 50.9628 51.3198L39.25 58.0822C34.7637 60.6723 29.2363 60.6723 24.75 58.0822L13.0372 51.3198C8.55087 48.7296 5.78719 43.9427 5.78719 38.7624V25.2376C5.78719 20.0573 8.55087 15.2704 13.0372 12.6802L24.75 5.91784C29.2363 3.32766 34.7637 3.32766 39.25 5.91784Z"
          stroke="#AAF1E7"
          stroke-width="3"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M33.5725 20.2827C32.6443 19.7468 31.5007 19.7468 30.5725 20.2827L22.6133 24.878C21.685 25.4139 21.1133 26.4043 21.1133 27.4761V36.6667C21.1133 37.7385 21.685 38.7289 22.6133 39.2648L30.5725 43.8601C31.5007 44.396 32.6443 44.396 33.5725 43.8601L41.5318 39.2648C42.46 38.7289 43.0318 37.7385 43.0318 36.6667V27.4761C43.0318 26.4043 42.46 25.4139 41.5318 24.878L33.5725 20.2827ZM31.5725 22.0148C31.8819 21.8361 32.2631 21.8361 32.5725 22.0148L40.5318 26.6101C40.8412 26.7887 41.0318 27.1188 41.0318 27.4761V36.6667C41.0318 37.024 40.8412 37.3541 40.5318 37.5327L32.5725 42.128C32.2631 42.3067 31.8819 42.3067 31.5725 42.128L23.6133 37.5327C23.3038 37.3541 23.1133 37.024 23.1133 36.6667V27.4761C23.1133 27.1188 23.3038 26.7887 23.6133 26.6101L31.5725 22.0148ZM27.0389 27.1868C26.5504 26.9292 25.9455 27.1165 25.688 27.605C25.4304 28.0935 25.6176 28.6984 26.1061 28.956L31.156 31.6184V38.0714C31.156 38.6237 31.6037 39.0714 32.156 39.0714C32.7082 39.0714 33.156 38.6237 33.156 38.0714V31.6099L38.0501 28.95C38.5353 28.6863 38.7149 28.0791 38.4512 27.5939C38.1874 27.1086 37.5803 26.929 37.095 27.1928L32.1488 29.881L27.0389 27.1868Z"
          fill="#28646E"
        />
      </svg>
    </Dialog>
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
    Dialog,
    Logo,
  },
  mixins: [crispMixin],
  data() {
    return {
      isOpenAboutTeam: false,
    };
  },
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
      if (buttonName === 'about_team') {
        this.isOpenAboutTeam = !this.isOpenAboutTeam;
      }
      logTrackerEvent(this, 'footer', `footer_click_${buttonName}`, '', 1);
    },
  },
};
</script>
