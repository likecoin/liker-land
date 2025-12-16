<script>
import { EXTERNAL_HOST, BOOK3_HOSTNAME } from '~/constant';
import { getUserMinAPI } from '~/util/api';
import { checkUserNameValid } from '~/util/user';

export default {
  async fetch({ redirect, $api, query, localeLocation }) {
    const { from: id } = query;
    if (id && checkUserNameValid(id)) {
      try {
        const userInfo = await $api.$get(getUserMinAPI(id));
        redirect(
          301,
          localeLocation({
            name: 'id',
            params: { id: userInfo.likeWallet },
          })
        );
        return;
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    const search = new URLSearchParams(query);
    if (!search.has('utm_source')) {
      search.set('utm_source', 'likerland');
    }
    redirect(301, `https://${BOOK3_HOSTNAME}/member?${search.toString()}`);
  },
  head() {
    const title = this.$t('civic_page_v3_title');
    const description = this.$t('civic_page_v3_description');
    const ogImage = 'https://liker.land/images/og/civic-v3.png';
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: ogImage,
        },
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify([
            {
              '@context': 'http://www.schema.org',
              '@type': 'Product',
              name: title,
              image: [ogImage],
              description,
              brand: {
                '@context': 'http://www.schema.org',
                '@type': 'Brand',
                url: `${EXTERNAL_HOST}/civic`,
                name: 'Civic Liker',
              },
              url: `${EXTERNAL_HOST}${this.$route.path}`,
              offers: {
                '@context': 'http://www.schema.org',
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'InStock',
              },
            },
          ]),
          type: 'application/ld+json',
          body: true,
        },
      ],
    };
  },
};
</script>
