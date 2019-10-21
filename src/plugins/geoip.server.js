export default ({ app, store, req, res, query }) => {
  // gcloud magic geoip headers
  // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers#app_engine-specific_headers
  const ipCountry = req.headers['x-appengine-country'];
  const ipCity = req.headers['x-appengine-city'];
  if (ipCountry === 'HK' || ipCity === 'hong kong') {
    store.dispatch('setIsHK', true);
  }
};
