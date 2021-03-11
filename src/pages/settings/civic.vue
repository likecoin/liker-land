<template lang="pug">
  NuxtChild(v-if="$route.name === 'settings-civic-unsubscribe'")
  div(v-else)
    CivicSettingsV2(v-if="getUserIsCivicLikerV2")
    CivicSettingsV1(v-else)
    NuxtChild
</template>

<script>
import { mapGetters } from 'vuex';

import { DEFAULT_CL_SUPPORTER } from '~/constant';

import CivicSettingsV1 from '~/components/CivicSettingsV1';
import CivicSettingsV2 from '~/components/CivicSettingsV2';

export default {
  middleware: 'authenticated',
  components: {
    CivicSettingsV1,
    CivicSettingsV2,
  },
  computed: {
    ...mapGetters(['getUserIsCivicLikerV2']),
  },
  fetch({ store, redirect }) {
    const { getUserIsCivicLiker, getUserShouldRenewCivic } = store.getters;
    if (!getUserIsCivicLiker && !getUserShouldRenewCivic) {
      redirect({ name: 'id-civic', params: { id: DEFAULT_CL_SUPPORTER } });
    }
  },
};
</script>
