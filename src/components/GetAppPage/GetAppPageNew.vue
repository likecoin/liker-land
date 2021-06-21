<!-- eslint-disable vue/no-v-html -->
<template>
  <article class="get-app-page">
    <section class="container top-container">
      <img class="feature-image block" src="./Getapp_civic3_2x.png">
      <img class="cross" src="./cross_3x.png">
      <div class="center app-logo">
        <AppLogo class="phone:hidden tablet:hidden" />
      </div>
      <h1 class="slogan center">
        <template v-if="$i18n.locale === 'zh-Hant'">
          <div class="slogan-text center"> Install the Liker Land app</div>
          <div class="slogan-text center"> Manage your LIKE</div>
        </template>
        <template v-else>
          <div class="slogan-text center"> Install the Liker Land app</div>
          <div class="slogan-text center"> Manage your LIKE</div>
        </template>
      </h1>
    </section>
    <section class="container">
      <hr class="separate-line">
    </section>

    <section class="feature">
      <div>
        <div class="container side-by-side" v-for="(feature, key) in $t('GetAppPage.Feature')" :key="key">
          <div class="icon-part">
            <img src="./phone_icon_3x.png" width="56px">
          </div>
          <div>
            <div class="main-vp" v-html="feature.mainVP" /> 
            <div class="sub-vp" v-html="feature.subVP" />
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <hr class="separate-line">
    </section>
    <section class="container">
      <h1 class="slogan center">
        <div class="slogan-text center"> Download Now </div>
      </h1>
    </section>
    <section class="container">
      <div class="center footer phone:mt-32 tablet:mt-32">
        <div class="text-center">
          <AppDownloadBadges
            :from="from"
            v-bind="utmProps"
          />
        </div>
      </div>
    </section>    
  </article>
</template>

<script>
import AppDownloadBadges from '~/components/AppDownloadBadges/AppDownloadBadges';

import AppLogo from '~/assets/images/app-logo.svg';

export default {
  name: 'GetAppPageNew',
  components: {
    AppDownloadBadges,
    AppLogo,
  },
  props: {
    from: {
      type: String,
      default: '',
    },
    utmCampaign: {
      type: String,
      default: '',
    },
    utmMedium: {
      type: String,
      default: 'getapp_page',
    },
    utmSource: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      singleFeature: '<div>feature.mainVP</div>',
    };
  },
  computed: {
    utmProps() {
      return {
        utmCampaign: this.utmCampaign,
        utmMedium: this.utmMedium,
        utmSource: this.utmSource,
      };
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

  .cross {
    z-index: 2;
    width: 21px;
    height: 22px;
    margin: -295px 0px 300px 32px;
  }

  .separate-line {
    background-color: #d8d8d8;
    height: 1px;
    width: 80%;
  }

  .app-logo {
    padding-top: 40px;
  }

  .top-container {
    padding-top: 100px;
  }

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

  .footer {
    padding-bottom: 55px;
  }

  .side-by-side {
    @apply py-16;

    .icon-part {
      width: 38%;
      text-align: right;
      padding-right: 5%;
    }

    @media screen and (min-width: 769px) {
      display: flex;
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
  .slogan-text {
    color: #28646e;
    font-size: 24px;
    width: 100%;
    padding: 10px;
  }

  .feature {
    margin-top: 20px;
    padding-bottom: 20px;

    .main-vp {
      font-weight: bold;
      color:#28646e;
      font-size: 16px;
      padding: 0 5px;
    }

    .sub-vp {
      color:#4a4a4a;
      font-size: 14px;
      padding: 5px;
      line-height: 20px;
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
    border-radius: 10px 10px 0px 0px;
    margin-top: -80px;
    background-color: #28646e;

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
