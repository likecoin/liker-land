<template lang="pug">
  mixin PlatformSelectGridItem(href)
    a.creators-page__platform-select-grid-item(href=href)&attributes(attributes)
      svg(width="100%" viewBox="0 0 255 90")
        foreignObject(width="255" height="90")
          .creators-page__platform-select-grid-item-logo-wrapper
            block

  mixin LogoSeparator
    svg.creators-page__platform-list-item-logo-separator(width="35" height="59" viewBox="0 0 35 59" fill="none")
      path(d="M1.5 58L33.5 1" stroke="#979797")

  mixin LogoWrapper
    a(target="_blank")&attributes(attributes): block

  article.creators-page

    section.creators-page__hero
      .creators-page__hero-graph
        HeroGraph
      i18n.creators-page__hero-title(tag="h1" path="CreatorsPage.Title")
      .creators-page__hero-desc
        i18n.creators-page__hero-desc-text(path="CreatorsPage.Description")
          br(place="br")

      .creators-page__separator

    section.creators-page__platform-select
      i18n.creators-page__platform-select-title(tag="div" path="CreatorsPage.PlatformSelectLabel")
      .creators-page__platform-select-grid
        +PlatformSelectGridItem("#config-liker-id")(:alt="$t('Glossary.Matters')")
          MattersLogo
        +PlatformSelectGridItem("#config-liker-id")(:alt="$t('Glossary.Vocus')")
          VocusLogo
        +PlatformSelectGridItem("#plugin")(:alt="$t('Glossary.WordPress')")
          WordPressLogo
        +PlatformSelectGridItem("#provide-liker-id")(:alt="$t('Glossary.InMedia')")
          InMediaLogo
        +PlatformSelectGridItem("#provide-liker-id")(:alt="$t('Glossary.Standnews')")
          StandnewsLogo
        +PlatformSelectGridItem("#provide-liker-id")(:alt="$t('Glossary.HKCnews')")
          HKCnewsLogo
        +PlatformSelectGridItem("#embedly")(:alt="$t('Glossary.Medium')")
          MediumLogo
        +PlatformSelectGridItem("#config-liker-id")(:alt="$t('Glossary.Timelog')")
          TimelogLogo
        +PlatformSelectGridItem("#platform-plugin")(:alt="$t('Glossary.Pixnet')")
          PixnetLogo(width="120")
        +PlatformSelectGridItem("#platform-plugin")(:alt="$t('Glossary.Blogger')")
          BloggerLogo

      .creators-page__separator

    section.creators-page__platforms
      ul.creators-page__platform-list(role='list')
        li#config-liker-id.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(:href="getGuideLink('Matters')" :alt="$t('Glossary.Matters')"): MattersLogo
            +LogoSeparator
            +LogoWrapper()(:href="getGuideLink('Vocus')" :alt="$t('Glossary.Vocus')"): VocusLogo
            +LogoSeparator
            +LogoWrapper()(:href="getGuideLink('Timelog')" :alt="$t('Glossary.Timelog')"): TimelogLogo
          i18n.creators-page__platform-list-item-text(tag="p" path="CreatorsPage.PlatformDescription.ConfigLikerID")
            a(
              place="Matters"
              :href="getGuideLink('Matters')"
              target="_blank"
              :alt="$t('Glossary.Matters')"
            )
              | {{ $t('Glossary.Matters') }}
            a(
              place="Vocus"
              :href="getGuideLink('Vocus')"
              target="_blank"
              :alt="$t('Glossary.Vocus')"
            )
              | {{ $t('Glossary.Vocus') }}
            a(
              place="Timelog"
              :href="getGuideLink('timelog')"
              target="_blank"
              :alt="$t('Glossary.Timelog')"
            )
              | {{ $t('Glossary.Timelog') }}

        li#plugin.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(:href="getGuideLink('WordPress')" :alt="$t('Glossary.WordPress')"): WordPressLogo
          i18n.creators-page__platform-list-item-text(tag="p" path="CreatorsPage.PlatformDescription.Plugin.Content")
            a(
              place="WordPressPlugin"
              href="https://wordpress.org/plugins/likecoin/"
              target="_blank"
              :alt="$t('CreatorsPage.PlatformDescription.Plugin.WordPress')"
            )
              | {{ $t('CreatorsPage.PlatformDescription.Plugin.WordPress') }}

        li#provide-liker-id.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(href="https://www.inmediahk.net/" :alt="$t('Glossary.InMedia')"): InMediaLogo
            +LogoSeparator
            +LogoWrapper()(href="https://www.thestandnews.com/" :alt="$t('Glossary.Standnews')"): StandnewsLogo
            +LogoSeparator
            +LogoWrapper()(href="https://www.hkcnews.com/" :alt="$t('Glossary.HKCnews')"): HKCnewsLogo
          i18n.creators-page__platform-list-item-text(tag="p" path="CreatorsPage.PlatformDescription.ProvideLikerID")
            a(place="InMedia" href="https://www.inmediahk.net/" :alt="$t('Glossary.InMedia')" target="_blank") {{ $t('Glossary.InMedia') }}
            a(place="Standnews" href="https://www.thestandnews.com/" :alt="$t('Glossary.Standnews')" target="_blank") {{ $t('Glossary.Standnews') }}
            a(place="HKCnews" href="https://www.hkcnews.com/" :alt="$t('Glossary.HKCnews')" target="_blank") {{ $t('Glossary.HKCnews') }}

        li#embedly.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(:href="getGuideLink('Medium')" :alt="$t('Glossary.Medium')"): MediumLogo
          i18n.creators-page__platform-list-item-text(
            tag="p"
            path="CreatorsPage.PlatformDescription.Embedly"
          )
          CopyText.mt-24(:text="embedlyLink")
          img.mt-24(loading="lazy" src="./medium-demo.webp")

        li#platform-plugin.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(:href="getGuideLink('Blogger')" :alt="$t('Glossary.Blogger')"): BloggerLogo
            +LogoSeparator
            +LogoWrapper()(:href="getGuideLink('Pixnet')" :alt="$t('Glossary.Pixnet')"): PixnetLogo
          i18n.creators-page__platform-list-item-text(
            tag="p"
            path="CreatorsPage.PlatformDescription.PlatformPlugin"
          )
            a(
              place="Pixnet"
              :href="getGuideLink('Pixnet')"
              target="_blank"
              :alt="$t('Glossary.Pixnet')"
            )
              | {{ $t('Glossary.Pixnet') }}
            a(
              place="Blogger"
              :href="getGuideLink('Blogger')"
              target="_blank"
              :alt="$t('Glossary.Blogger')"
            )
              | {{ $t('Glossary.Blogger') }}
      .creators-page__separator

    section.py-32
      .center(class="phone:mt-32 tablet:mt-32")
        .text-center
          AppLogo
          AppDownloadBadges.mt-16(
            type="single"
            v-bind="getUtmProps({ utmMedium: 'creators_page' })"
          )
</template>

<script>
import AppDownloadBadges from '../AppDownloadBadges/AppDownloadBadges';
import CopyText from '../CopyText';
import utmMixin from '~/mixins/utm';

export default {
  name: 'CreatorPage',
  components: {
    AppLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ '~/assets/images/app-logo.svg'),
    AppDownloadBadges,
    CopyText,
    HeroGraph: () =>
      import(/* webpackChunkName: "svg-creator" */ './hero-graph.svg'),
    MattersLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/matters.svg'),
    VocusLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/vocus.svg'),
    WordPressLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/wordpress.svg'),
    InMediaLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/inmedia.svg'),
    StandnewsLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/standnews.svg'),
    HKCnewsLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/hkcnews.svg'),
    MediumLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/medium.svg'),
    BloggerLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/blogger.svg'),
    PixnetLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/pixnet.svg'),
    TimelogLogo: () =>
      import(/* webpackChunkName: "svg-creator" */ './logos/timelog.svg'),
  },
  mixins: [utmMixin],
  props: {
    likerId: {
      type: String,
      default: '',
    },
  },
  computed: {
    embedlyLink() {
      return `https://button.like.co/${this.likerId ||
        this.$t('CreatorsPage.LikerIDPlaceholer')}`;
    },
  },
  methods: {
    getGuideLink(suffix) {
      return this.$t(`CreatorsPage.GuideLink.${suffix}`);
    },
  },
};
</script>

<style lang="scss">
.creators-page {
  width: 100%;
  max-width: 1024px;
  margin-right: auto;
  margin-left: auto;

  &__hero {
    position: relative;

    @media screen and (max-width: 899px) {
      text-align: center;
    }
  }

  &__hero-title {
    @apply text-gray-4a;

    margin-top: 24px;
    padding-top: 0px;
    padding-bottom: 0px;
    font-size: 56px;
    line-height: 1em;
    font-weight: 300;

    @media screen and (min-width: 900px) {
      padding-left: 70px;
    }
  }

  &__hero-desc {
    margin-top: 40px;
    margin-bottom: -24px;
    padding: 32px;
    padding-bottom: 64px;
    background-color: #fff;

    @media screen and (min-width: 900px) {
      min-height: 292px;
      max-width: 75%;
      padding-left: 70px;
      padding-right: 212px;
      text-align: left;
    }
  }

  &__hero-desc-text {
    color: #28646e;
    font-size: 22px;
    line-height: 1.5em;
    font-weight: 400;
  }

  &__hero-graph {
    @media screen and (min-width: 900px) {
      position: absolute;
      top: 0;
      right: 70px;
      width: 100%;
      max-width: 400px;
      margin-right: -32px;
      text-align: right;
    }

    > svg {
      display: block;
      max-width: 400px;
      margin: 10px auto;
    }
  }

  &__separator {
    height: 2px;
    margin-right: 70px;
    margin-left: 70px;
    background-color: #e6e6e6;
  }

  &__platform-select {
    padding-top: 60px;

    &-title {
      margin: 0 32px;
      color: #6d7278;
      font-weight: 400;
      text-align: center;
    }

    &-grid {
      display: grid;
      grid-auto-columns: 1fr;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto auto;
      grid-row-gap: 16px;
      grid-column-gap: 16px;
      max-width: 832px;
      margin: 32px auto 72px;
      padding: 16px;

      @media screen and (max-width: 767px) {
        grid-template-columns: 1fr 1fr;
      }

      &-item {
        border-radius: 16px;
        background-color: #fff;
        box-shadow: 0 3px 7px rgba(0, 0, 0, 0.2);
        transition: all ease 0.2s;

        &:hover {
          background-color: #f7f7f7;
        }

        &:active {
          transform: translateY(2px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        &-logo-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  &__platform-list {
    max-width: 600px;
    margin: 8px auto 0px;
    padding: 0 16px;
    list-style-type: none;

    &-item {
      margin-top: 40px;
      margin-bottom: 40px;
      padding: 40px;
      border-radius: 14px;
      background-color: #fff;

      &-logos {
        display: flex;
        flex-wrap: wrap;
        min-height: 57px;
        margin-bottom: 40px;
        justify-content: center;
        align-items: center;

        @media screen and (max-width: 480px) {
          flex-direction: column;

          > a {
            margin: 12px;
          }
        }
      }

      &-logo-separator {
        margin: 0 12px;
        flex-shrink: 0;

        @media screen and (max-width: 767px) {
          margin: 0 8px;
        }

        @media screen and (max-width: 480px) {
          display: none;
        }
      }

      &-text {
        font-weight: 400;
        text-align: center;
        line-height: 1.5;

        a {
          @apply text-like-green;

          text-decoration: underline;
        }
      }
    }
  }

  .app-download-badges .button {
    min-width: 256px !important;

    font-size: 16px !important;
  }
}
</style>
