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
        +PlatformSelectGridItem("#config-liker-id")
          MattersLogo
        +PlatformSelectGridItem("#config-liker-id")
          VocusLogo
        +PlatformSelectGridItem("#plugin")
          WordPressLogo
        +PlatformSelectGridItem("#provide-liker-id")
          InMediaLogo
        +PlatformSelectGridItem("#provide-liker-id")
          StandnewsLogo
        +PlatformSelectGridItem("#provide-liker-id")
          HKCnewsLogo
        +PlatformSelectGridItem("#embedly")
          MediumLogo

      .creators-page__separator

    section.creators-page__platforms
      ul.creators-page__platform-list(role='list')
        li#config-liker-id.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(:href="getGuideLink('matters')"): MattersLogo
            +LogoSeparator
            +LogoWrapper()(:href="getGuideLink('vocus')"): VocusLogo
          i18n.creators-page__platform-list-item-text(tag="p" path="CreatorsPage.PlatformDescription.ConfigLikerID")

        li#plugin.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(:href="getGuideLink('wordpress')"): WordPressLogo
          i18n.creators-page__platform-list-item-text(tag="p" path="CreatorsPage.PlatformDescription.Plugin.Content")
            a(place="wordpress" href="https://wordpress.org/plugins/likecoin/" target="_blank")
              | {{ $t('CreatorsPage.PlatformDescription.Plugin.WordPress') }}

        li#provide-liker-id.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(href="https://www.inmediahk.net/"): InMediaLogo
            +LogoSeparator
            +LogoWrapper()(href="https://www.thestandnews.com/"): StandnewsLogo
            +LogoSeparator
            +LogoWrapper()(href="https://www.hkcnews.com/"): HKCnewsLogo
          i18n.creators-page__platform-list-item-text(tag="p" path="CreatorsPage.PlatformDescription.ProvideLikerID")
            a(place="inmedia" href="https://www.inmediahk.net/" target="_blank") {{ $t('Glossary.InMedia') }}
            a(place="standnews" href="https://www.thestandnews.com/" target="_blank") {{ $t('Glossary.Standnews') }}
            a(place="hkcnews" href="https://www.hkcnews.com/" target="_blank") {{ $t('Glossary.HKCnews') }}

        li#embedly.creators-page__platform-list-item
          .creators-page__platform-list-item-logos
            +LogoWrapper()(:href="getGuideLink('medium')"): MediumLogo
          i18n.creators-page__platform-list-item-text(tag="p" path="CreatorsPage.PlatformDescription.Embedly")
          CopyText.mt-24(:text="embedlyLink")
          img.mt-24(src="./medium-demo.webp")

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
import AppLogo from '~/assets/images/app-logo.svg';
import AppDownloadBadges from '../AppDownloadBadges/AppDownloadBadges';
import CopyText from '../CopyText';
import utmMixin from '~/mixins/utm';

import HeroGraph from './hero-graph.svg';
import MattersLogo from './logos/matters.svg';
import VocusLogo from './logos/vocus.svg';
import WordPressLogo from './logos/wordpress.svg';
import InMediaLogo from './logos/inmedia.svg';
import StandnewsLogo from './logos/standnews.svg';
import HKCnewsLogo from './logos/hkcnews.svg';
import MediumLogo from './logos/medium.svg';

export default {
  name: 'CreatorPage',
  components: {
    AppLogo,
    AppDownloadBadges,
    CopyText,
    HeroGraph,
    MattersLogo,
    VocusLogo,
    WordPressLogo,
    InMediaLogo,
    StandnewsLogo,
    HKCnewsLogo,
    MediumLogo,
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
    guideLinkPrefix() {
      return this.$t('CreatorsPage.GuideLinkPrefix');
    },
  },
  methods: {
    getGuideLink(suffix) {
      return `${this.guideLinkPrefix}${suffix}`;
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
        min-height: 57px;
        margin-bottom: 40px;
        justify-content: center;
        align-items: center;
      }

      &-logo-separator {
        margin: 0 32px;

        @media screen and (max-width: 767px) {
          margin: 0 8px;
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
}
</style>
