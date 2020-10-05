<!-- eslint-disable vue/no-v-html -->
<template>
  <article class="get-app-page">
    <section class="container">
      <h1 class="slogan center">
        <template v-if="$i18n.locale === 'zh-Hant'">
          <LessBrowsingTC />
          <MoreReadingTC />
        </template>
        <template v-else>
          <LessBrowsingEN />
          <MoreReadingEN />
        </template>
      </h1>
      <AppDownloadBadges :from="from" type="start" utm-source="getapp_page" />
    </section>

    <section class="feature">
      <div class="container side-by-side">
        <div class="center">
          <img class="feature-image" src="./featured-image.jpg">
        </div>
        <ul class="phone:mt-32 tablet:mt-32">
          <li
            v-for="(feature, key) in $t('GetAppPage.Feature')"
            :key="key"
            v-html="feature"
          />
        </ul>
      </div>
    </section>

    <section class="preview container side-by-side flex phone:flex-col-reverse tablet:flex-col-reverse">
      <div class="center phone:mt-32 tablet:mt-32">
        <div class="text-center">
          <AppLogo class="phone:hidden tablet:hidden mb-20" />
          <AppDownloadBadges :from="from" utm-source="getapp_page" />
        </div>
      </div>
      <div class="center">
        <AppScreenshotsViewer />
      </div>
    </section>
  </article>
</template>

<script>
import AppDownloadBadges from '~/components/AppDownloadBadges/AppDownloadBadges';
import AppScreenshotsViewer from '~/components/AppScreenshotsViewer/AppScreenshotsViewer';

import AppLogo from '~/assets/images/app-logo.svg';
import LessBrowsingTC from './slogan/less-browsing-tc.svg';
import MoreReadingTC from './slogan/more-reading-tc.svg';
import LessBrowsingEN from './slogan/less-browsing-en.svg';
import MoreReadingEN from './slogan/more-reading-en.svg';

export default {
  name: 'GetAppPage',
  components: {
    AppDownloadBadges,
    AppLogo,
    AppScreenshotsViewer,
    LessBrowsingEN,
    LessBrowsingTC,
    MoreReadingEN,
    MoreReadingTC,
  },
  props: {
    from: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.get-app-page {
  width: 100%;
  max-width: 1024px;
  margin-right: auto;
  margin-left: auto;

  .container {
    @apply px-16;

    width: 100%;
    max-width: 600px;
    margin-right: auto;
    margin-left: auto;
  }

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .side-by-side {
    @apply py-32;

    @media screen and (min-width: 769px) {
      display: flex;

      > * {
        width: 50%;
      }
    }
  }

  .slogan {
    @apply text-like-green;
    @apply my-20;

    display: flex;
    flex-wrap: wrap;

    text-align: center;

    svg {
      max-height: 2.5rem;
      fill: currentColor;

      @apply my-8;
    }
  }

  .feature {
    @apply bg-like-green;
    @apply text-14;
    @apply text-white;
    @apply font-400;

    margin-top: 80px;
    padding-bottom: 20px;

    ul {
      @apply pl-32;
      @apply pb-16;

      list-style: none;

      li {
        &:not(:first-child) {
          @apply mt-16;
        }

        /deep/ b {
          display: block;
          @apply mb-8;
          @apply text-like-cyan;
          @apply text-20;
          @apply font-600;
        }
      }
    }

    @media screen and (min-width: 1025px) {
      border-radius: 10px;
    }

    @media screen and (max-width: 768px) {
      padding-bottom: 440px;

      ul {
        text-align: center;

        @apply pl-0;
      }
    }
  }

  .feature-image {
    display: block;
    width: 100%;
    margin: auto;
    border-radius: 10px;
    margin-top: -80px;

    @media screen and (max-width: 768px) {
      max-width: 256px;
    }
  }

  .preview {
    margin-top: -64px;

    @media screen and (max-width: 768px) {
      margin-top: -482px;
    }
  }
}
</style>
