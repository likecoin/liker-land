<!-- eslint-disable vue/no-v-html -->
<template>
  <article class="get-app-page">
    <section class="container top-container">
      <img class="feature-image" src="./getapp-banner.png">
      <img v-if="showCross" class="cross" src="./cross_3x.png">

      <div class="center app-logo">
        <AppLogo width="160px" />
      </div>
      <h1 class="slogan center">
        <div class="slogan-text center">{{ $t('GetAppPage.Download') }}</div>
        <div class="slogan-text center">{{ $t('GetAppPage.Manage.like') }}</div>
      </h1>
    </section>
    <section class="container">
      <hr class="separate-line">
    </section>

    <section class="feature">
      <div>
        <div
          v-for="(feature, key) in combineFeatures"
          :key="key"
          class="container side-by-side"
        >
          <div class="icon-part">
            <img src="./phone_icon_3x.png" width="56px">
          </div>
          <div class="vp-part">
            <div class="main-vp">{{ feature.main }}</div>
            <div class="sub-vp">{{ feature.sub }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <hr class="separate-line">
    </section>
    <section class="footer-container">
      <h1 class="slogan center">
        <div class="slogan-text center">
          {{ $t('GetAppPage.Download.now') }}
        </div>
      </h1>
    </section>
    <section class="footer-container">
      <div class="center footer">
        <div class="text-center">
          <AppDownloadBadges :from="from" v-bind="utmProps" />
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
    showCross: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '160',
    },
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
      combinedVPs: [],
    };
  },
  computed: {
    combineFeatures() {
      const combinedVPs = [];
      for (let i = 0; i < this.$t('mainVPs').length; i += 1) {
        const singleVPPair = {
          main: this.$t('mainVPs')[i],
          sub: this.$t('subVPs')[i],
        };
        combinedVPs.push(singleVPPair);
      }
      return combinedVPs;
    },
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

  .separate-line {
    background-color: #d8d8d8;
    height: 1px;
    width: 80%;
  }

  .app-logo {
    padding-top: 20px;
    @media screen and (max-width: 600px) {
      display: inline-block;
      padding-bottom: 10px;
    }
  }

  .top-container {
    padding-top: 100px;
    @media screen and (max-width: 600px) {
      text-align: center;
    }
  }

  .footer-container {
    @media screen and (max-width: 600px) {
      text-align: center;
    }
  }

  .container {
    @apply px-16;

    width: 100%;
    max-width: 600px;
    margin-right: auto;
    margin-left: auto;

    @media screen and (max-width: 600px) {
      @apply px-0;
    }
  }

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer {
    padding-bottom: 55px;
    @media screen and (max-width: 600px) {
      text-align: center;
    }
  }

  .side-by-side {
    @apply py-16;
    display: flex;

    @media screen and (max-width: 600px) {
      max-width: 256px;
    }

    .icon-part {
      width: 38%;
      text-align: right;
      padding-right: 5%;

      @media screen and (max-width: 600px) {
        width: 20%;
        text-align: middle;
      }
    }

    .vp-part {
      width: 45%;

      @media screen and (max-width: 600px) {
        width: 80%;
        text-align: middle;
      }
    }
  }

  .slogan {
    @apply text-like-green;
    @apply my-20;

    display: flex;
    flex-wrap: wrap;
    text-align: center;

    @media screen and (max-width: 600px) {
      margin-top: 0px;
      margin-bottom: 0px;
    }

    svg {
      max-height: 2.5rem;
      fill: currentColor;

      @apply my-8;
    }

    @media screen and (max-width: 600px) {
      max-width: 256px;
      display: inline-block;
    }
  }
  .slogan-text {
    color: #28646e;
    font-size: 24px;
    width: 100%;
    padding: 10px;

    @media screen and (max-width: 600px) {
      font-size: 18px;
    }
  }

  .feature {
    margin-top: 20px;
    padding-bottom: 20px;

    .main-vp {
      font-weight: bold;
      color: #28646e;
      font-size: 16px;
      padding: 0 5px;
    }

    .sub-vp {
      color: #4a4a4a;
      font-size: 14px;
      padding: 5px;
      line-height: 20px;
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
      border-radius: 0px;
    }
  }

  .cross {
    z-index: 2;
    width: 21px;
    height: 22px;
    margin: -295px 0px 300px 32px;
    @media screen and (max-width: 600px) {
      width: 12px;
      height: 12.5px;
      margin: -75% 0% 53% -88%;
    }
  }
}
</style>
