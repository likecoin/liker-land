function handleRestfulError(req, res, next, err) {
  if (
    err.response &&
    err.response.status >= 400 &&
    err.response.status <= 499
  ) {
    res.set('Content-Type', 'text/plain');
    res.status(err.response.status).send(err.response.data);
    return;
  }
  next(err);
}

module.exports = {
  handleRestfulError,
};
