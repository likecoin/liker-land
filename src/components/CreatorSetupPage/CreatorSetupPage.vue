<template lang="pug">
  mixin LinkWrapper(key)
    - var alt = `$t('Glossary.${key}')`
    - var href = `getGuideLink('${key}')`
    a(
      :alt=alt
      :href=href
    )&attributes(attributes)
      if block
        block
      else
        | {{ !{alt} }}

  mixin PlatformSelectGridItem(id, key)
    +LinkWrapper(key).creators-page__platform-select-grid-item(href=id)&attributes(attributes)
      svg(width="100%" viewBox="0 0 255 90")
        foreignObject(width="255" height="90")
          .creators-page__platform-select-grid-item-logo-wrapper
            block

  mixin PlatformListItem(id)
    li.creators-page__platform-list-item(id=id): block

  mixin LogoSeparator
    svg.creators-page__platform-list-item-logo-separator(width="35" height="59" viewBox="0 0 35 59" fill="none")
      path(d="M1.5 58L33.5 1" stroke="#979797")

  mixin LogoWrapper(key)
    +LinkWrapper(key)(target="_blank")&attributes(attributes): block

  mixin PlatformDescription(key)
    - var path = `CreatorsPage.PlatformDescription.${key}`
    i18n.creators-page__platform-list-item-text(tag="p" path=path): block

  mixin PlatformDescriptionLink(key)
    +LinkWrapper(key)(target="_blank" place=key)

  article.creators-page

    section.creators-page__hero
      .creators-page__hero-graph
        img(src="./hero-graph.svg")
      i18n.creators-page__hero-title(tag="h1" path="CreatorsPage.Title")
      .creators-page__hero-desc
        i18n.creators-page__hero-desc-text(path="CreatorsPage.Description")
          br(place="br")

      .creators-page__separator

    EasySetup.mt-32.mx-16(
      preset="setup"
      class="laptop:mx-40"
      v-bind="{ likerId, displayName, avatarUrl }"
    )

    section.creators-page__platform-select
      i18n.creators-page__platform-select-title(tag="div" path="CreatorsPage.PlatformSelectLabel")
      .creators-page__platform-select-grid
        +PlatformSelectGridItem("#config-liker-id", "Matters"): img(src="./logos/matters.svg")
        +PlatformSelectGridItem("#config-liker-id", "Vocus"): img(src="./logos/vocus.svg")
        +PlatformSelectGridItem("#wordpress", "WordPress"): img(src="./logos/wordpress.svg")
        +PlatformSelectGridItem("#provide-liker-id", "InMedia"): img(src="./logos/inmedia.svg")
        +PlatformSelectGridItem("#embedly", "Medium"): img(src="./logos/medium.svg")
        +PlatformSelectGridItem("#config-liker-id", "Timelog"): img(src="./logos/timelog.svg")
        +PlatformSelectGridItem("#plugin", "Pixnet"): img(src="./logos/pixnet.svg" width="120")
        +PlatformSelectGridItem("#plugin", "Blogger"): img(src="./logos/blogger.svg")

      .creators-page__separator

    section.creators-page__platforms
      ul.creators-page__platform-list(role='list')

        +PlatformListItem('config-liker-id')
          .creators-page__platform-list-item-logos
            +LogoWrapper('Matters'): img(src="./logos/matters.svg")
            +LogoSeparator
            +LogoWrapper('Vocus'): img(src="./logos/vocus.svg")
            +LogoSeparator
            +LogoWrapper('Timelog'): img(src="./logos/timelog.svg")
          +PlatformDescription('ConfigLikerID')
            +PlatformDescriptionLink('Matters')
            +PlatformDescriptionLink('Vocus')
            +PlatformDescriptionLink('Timelog')

        +PlatformListItem('wordpress')
          .creators-page__platform-list-item-logos
            +LogoWrapper('WordPress'): img(src="./logos/wordpress.svg")
          +PlatformDescription('Plugin.Content')
            - var wpAlt = "$t('CreatorsPage.PlatformDescription.Plugin.WordPress')"
            - var wpText = `\{\{ ${alt} \}\}`
            a(
              place="WordPressPlugin"
              href="https://wordpress.org/plugins/likecoin/"
              target="_blank"
              :alt="$t('CreatorsPage.PlatformDescription.Plugin.WordPress')"
            )
              | {{ $t('CreatorsPage.PlatformDescription.Plugin.WordPress') }}

        +PlatformListItem('provide-liker-id')
          .creators-page__platform-list-item-logos
            +LogoWrapper('InMedia'): img(src="./logos/inmedia.svg")
          +PlatformDescription('ProvideLikerID')
            +PlatformDescriptionLink('InMedia')
            +PlatformDescriptionLink('Standnews')

        +PlatformListItem('embedly')
          .creators-page__platform-list-item-logos
            +LogoWrapper('Medium'): img(src="./logos/medium.svg")
          +PlatformDescription('Embedly')
          CopyText.mt-24(:text="embedlyLink")
          img.mt-24(loading="lazy" src="./medium-demo.webp")

        +PlatformListItem('plugin')
          .creators-page__platform-list-item-logos
            +LogoWrapper('Blogger'): img(src="./logos/blogger.svg")
            +LogoSeparator
            +LogoWrapper('Pixnet'): img(src="./logos/pixnet.svg")
          +PlatformDescription('PlatformPlugin')
            +PlatformDescriptionLink('Pixnet')
            +PlatformDescriptionLink('Blogger')

      .creators-page__separator

    slot(name="footer")
</template>

<script>
import utmMixin from '~/mixins/utm';

import CopyText from '../CopyText';
import EasySetup from '../CreatorsPage/sections/EasySetup/EasySetup';

export default {
  name: 'CreatorPage',
  components: {
    EasySetup,
    CopyText,
  },
  mixins: [utmMixin],
  props: {
    likerId: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    avatarUrl: {
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

    > img {
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
}
</style>
