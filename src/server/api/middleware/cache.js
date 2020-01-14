function setPrivateCacheHeader(res) {
  res.set('Cache-Control', 'private');
  res.set('Vary', 'Cookie');
}

module.exports = {
  setPrivateCacheHeader,
};
