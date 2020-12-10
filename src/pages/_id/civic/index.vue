<template lang="pug">
  .settings-page
      PageHeader
        template
          SiteNavBar.text-like-green

      main.page-content
        CivicSubscriptionView(
          :is-show-backdrop="false"
          :initial-state="$route.query.initial_state"
        )
</template>

<script>
import CivicSubscriptionView from '~/components/CivicSubscriptionView/CivicSubscriptionView';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  components: {
    CivicSubscriptionView,
    PageHeader,
    SiteNavBar,
  },
  fetch({ store, redirect, route, query }) {
    const currentUserLikerID = store.getters.getUserId;
    if (route.params.id === currentUserLikerID) {
      redirect({ name: 'id', params: { id: currentUserLikerID }, query });
    }
  },
};
</script>
