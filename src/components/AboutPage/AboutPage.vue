<template>
  <article>
    <header class="bg-like-green">
      <div class="about-page-column">
        <p class="pt-48 my-0 text-white">
          <span class="text-24">LikeCoin Foundation</span><br>is a section-88 non-profit organization registered in Hong Kong.
          The foundation has been promoting the Civic Liker movement, which encourages readers
          to contribute USD5 per month to support creativity. We also develop an open-source
          toolkit for content rewards, curation, and archive. All latest project developments
          documented in <a class="text-like-cyan" href="https://github.com/likecoin/likecoin" target="_blank" alt="GitHub">Github</a>,
          open for volunteers and contributors to participate in the project.
        </p>
        <p class="pb-24 mt-8 cta-section">
          <a
            class="btn btn--outlined btn--dark"
            href="https://github.com/likecoin/likecoin"
            target="_blank"
            alt="Contribute"
          >Contribute</a>
        </p>
      </div>
    </header>
    <div class="about-page-column">
      <p>
        The foundation has a mission to empower content creators and publishers through the
        formation of Liker Land. Content creators are able to receive actual rewards from
        readers through the reinvented Like button in Liker Land. The foundation supports
        the <nuxt-link :to="localeLocation({ name: 'civic' })" alt="Civic Liker Movement">Civic Liker Movement</nuxt-link>
        in a form of matching funds, which distribute rewards to content creators on a daily
        basis by the “like” they receive every day.
      </p>
      <p>
        The foundation also organizes various events with schools and non-profits to promote
        writings and content creation.
      </p>

      <ul class="gallery-list">
        <li class="gallery-list__block">
          <img src="./images/01.jpg" alt="Writing workshop at the Direction Association For The Fandi">
        </li>
        <li class="gallery-list__block">
          <img src="./images/02.jpg" alt="Writing workshop at the Direction Association For The Fandi">
        </li>
        <li class="gallery-list__block gallery-list__block--big">
          <img src="./images/03.jpg" alt="Mozilla Foundation">
        </li>
        <li class="gallery-list__block gallery-list__block--big public-report-statistics">
          <h3>Public report and statistic</h3>
          <ul>
            <li
              v-for="link in links"
              :key="link.name"
            >
              <a
                :href="link.href"
                target="_blank"
                :alt="link.name"
              >{{ link.name }}</a>
            </li>
          </ul>
        </li>
      </ul>

      <p class="cta-section">
        <a
          class="btn btn--outlined"
          href="https://github.com/sponsors/likecoin"
          target="_blank"
          alt="Contribute"
        >Donate</a>
      </p>
    </div>
  </article>
</template>

<script>
export default {
  name: 'AboutPage',
  computed: {
    links() {
      return [
        {
          name: 'Liker Land Open Statistic',
          href:
            'https://datastudio.google.com/u/0/reporting/e6168171-b61d-4871-b39f-7b6308f2facc/page/qgR',
        },
      ];
    },
  },
};
</script>

<style lang="scss">
.about-page-column {
  width: 100%;
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;

  line-height: 1.5;

  @apply text-gray-4a;
  @apply font-200;

  @media screen and (max-width: 600px) {
    @apply px-32;
  }

  h3 {
    margin: 0 0 16px;
  }

  p {
    margin: 32px 0;

    line-height: 1.8;
  }

  .gallery-list {
    display: grid;
    list-style: none;
    margin: 32px 0;
    padding: 0;

    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;

    > li {
      margin: 0;
    }

    img {
      display: block;
      transition: all 0.5s ease;

      &:not(:hover) {
        filter: sepia(100%) saturate(0.8) hue-rotate(120deg) brightness(70%);
      }
    }

    &__block {
      &--big {
        @media screen and (max-width: 600px) {
          grid-column-start: 1;
          grid-column-end: 3;
        }
      }
    }
  }

  .public-report-statistics {
    @apply bg-like-green;
    @apply p-24;

    h3 {
      @apply text-like-cyan;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin: 8px 0;

        a {
          @apply text-white;
          @apply font-200;
        }
      }
    }
  }

  a {
    @apply text-like-green;
    @apply font-400;

    text-decoration: underline;
  }

  .cta-section {
    text-align: center;

    a {
      @apply font-600;

      text-decoration: none;
    }
  }
}
</style>
