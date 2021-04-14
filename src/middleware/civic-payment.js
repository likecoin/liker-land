export default async function({ store, redirect }) {
  if (
    store.getters.getUserIsCivicLiker ||
    store.getters.getUserShouldRenewCivic
  ) {
    if (!store.getters.getUserSubscriptionInfo) {
      try {
        await store.dispatch('fetchUserSubscriptionInfo');
      } catch {
        // no-op
      }
    }
    if (store.getters.getIsUserSubscriptionPastDue) {
      // Redirect user to /settings/civic to handle payment issue first
      return redirect({ name: 'settings-civic' });
    }
  }
  return undefined;
}
