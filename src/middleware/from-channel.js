export default context => {
  if (!process.client) return;

  const {
    from: fromRoute,
    route: toRoute,
    redirect,
    getRouteBaseName,
  } = context;

  // If the from query is present in the current route but not in the next route, add it to the next route
  if (
    fromRoute &&
    fromRoute.query.from &&
    !toRoute.query.from &&
    // Exclude navigating from /nft/* routes
    !getRouteBaseName(fromRoute).startsWith('nft')
  ) {
    redirect({
      ...toRoute,
      query: { ...toRoute.query, from: fromRoute.query.from },
    });
  }
};
