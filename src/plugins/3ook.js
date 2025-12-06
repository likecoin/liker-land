import { BOOK_COM_DOMAIN } from '~/constant';

export default ({ redirect, route }, inject) => {
  inject('redirectTo3ookByNFTClassId', (code = 301, nftClassId) => {
    const url = new URL(`/store/${nftClassId}`, BOOK_COM_DOMAIN);
    Object.keys(route.query).forEach(key => {
      const values = Array.isArray(route.query[key])
        ? route.query[key]
        : [route.query[key]];
      values.forEach(value => {
        url.searchParams.append(key, value);
      });
    });
    if (!url.searchParams.has('utm_source')) {
      url.searchParams.set('utm_source', 'likerland');
    }
    redirect(code, url.toString());
  });
};
