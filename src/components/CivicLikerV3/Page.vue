<template>
  <div class="flex flex-col items-center px-[12px] laptop:px-[24px]">
    <section class="w-full max-w-[976px] mx-auto">
      <div
        :class="[
          'flex',
          'flex-col',
          'items-stretch',
          'justify-center',
          'w-full',
          'h-full',
          'rounded-[32px]',
          'overflow-hidden',
          'border-[1px]',
          'border-shade-gray',

          'laptop:flex-row',
          'laptop:flex-nowrap',
        ]"
      >
        <div class="flex flex-grow basis-2/3">
          <img
            v-if="$i18n.locale === 'zh-Hant'"
            src="~/assets/images/civic-v3/keyBanner-zh.png"
            :alt="$t('og_description')"
            class="object-contain"
          />
          <img
            v-else
            src="~/assets/images/civic-v3/keyBanner-en.png"
            :alt="$t('og_description')"
            class="object-contain"
          />
        </div>
        <div
          class="flex flex-col justify-center flex-grow basis-1/3 h-full bg-like-green px-[32px] py-[46px]"
        >
          <Label
            class="text-white font-600 mb-[4px]"
            :text="$t('civic_dashboard_v3_banner_writing_nft')"
          />
          <Label
            class="text-like-cyan font-200 mb-[18px]"
            :text="$t('civic_dashboard_v3_banner_writing_nft_description')"
          />
          <Label
            class="text-white font-600 mb-[4px]"
            :text="$t('civic_dashboard_v3_banner_book_nft')"
          />
          <Label
            class="text-like-cyan font-200 mb-[24px]"
            :text="$t('civic_dashboard_v3_banner_book_nft_description')"
          />
          <ButtonV2
            preset="secondary"
            :to="localeLocation({ name: 'store' })"
            :text="$t('civic_dashboard_v3_banner_button')"
            @click.native="handleClickToStore"
          />
        </div>
      </div>
    </section>
    <div class="w-full max-w-[976px] h-[2px] bg-shade-gray my-[48px]" />
    <section class="civic-dashboard">
      <div class="w-full mx-auto max-w-phone phone:px-12 tablet:px-12">
        <header class="flex items-center justify-between mb-24">
          <div class="flex items-center">
            <img
              src="~/assets/images/civic-liker-icon.png"
              :alt="$t('civic_page_v3_title')"
              style="height:64px; width:68px"
            />
            <span class="ml-16 text-like-green text-24">{{
              $t('civic_page_v3_title')
            }}</span>
          </div>
          <ButtonV2
            preset="outline"
            :text="$t('civicLiker.about')"
            :href="$t('civic_dashboard_v3_about_url')"
            target="_blank"
            rel="noopener"
          >
            <template #prepend>
              <AlertCircle class="w-[16px]" />
            </template>
            <template #append>
              <ExternalLink class="w-16" />
            </template>
          </ButtonV2>
        </header>
        <CivicDashboardV3 class="pb-64" />
      </div>
    </section>
  </div>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

import AlertCircle from '~/assets/icons/alert-circle.svg?inline';
import ExternalLink from '~/assets/icons/external-link.svg?inline';

import CivicDashboardV3 from './Dashboard';

export default {
  components: {
    AlertCircle,
    ExternalLink,
    CivicDashboardV3,
  },
  layout: 'default',
  methods: {
    handleClickToStore() {
      logTrackerEvent(this, 'civic-index', 'RedirectToStoreClicked', '', 1);
    },
  },
};
</script>
