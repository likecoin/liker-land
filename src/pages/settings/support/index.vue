<template>
  <div>
    <template
      v-if="state.startsWith('error')"
    >
      <div v-if="state === 'error-not-civic'">
        <div>Support feature is only available to civic liker</div>
        <nuxt-link :to="{ name: 'civic' }">Become Civic Liker</nuxt-link>
      </div>
      <span v-else-if="state === 'error-civic-v2'">
        <div>Support feature is only available to v2 civic liker'</div>
      </span>
      <span v-else>Unknown error</span>
    </template>
    <ul
      v-else-if="state === 'loading'"
      key="loading"
      class="author-follow-settings-list author-follow-settings-list--loading"
    />
    <template v-else>
      <h2> Supporting </h2>
      <ul
        v-if="authorLikerIds.length"
        key="content"
        class="author-follow-settings-list"
      >
        <li
          v-for="id in authorLikerIds"
          :key="id"
        >
          <AuthorListItem
            :liker-id="id"
            tag="div"
          />
          {{ getAuthorQuantity(id) }}
        </li>
      </ul>
      <div
        v-else
      >You are not supporting anyone yet!</div>
    </template>
    <hr>
    <div v-if="getUserSubscriptionInfo">
      <h2> Billing info </h2>
      <div><a :href="getStripeBillingPortalAPI">manage info and history</a></div>
      <div>{{ maskedCardNumber }}</div>
      <div>{{ getUserSubscriptionInfo.currentPeriodEndString }}</div>
      <div>{{ `${getUserSubscriptionInfo.quantity * 5} USD / Month` }}</div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import AuthorListItem from '~/components/AuthorListItem';
import { getStripeBillingPortalAPI } from '~/util/api';

function getMaskedCardNumber(brand, last4) {
  switch (brand) {
    case 'visa':
    case 'mastercard':
      return `•••• •••• •••• ${last4}`;

    case 'amex':
      return `•••• •••••• •${last4}`;

    default:
      return `•••• ${last4}`;
  }
}

export default {
  middleware: 'authenticated',
  components: {
    AuthorListItem,
  },
  data() {
    return {
      state: 'loading',
    };
  },
  computed: {
    ...mapGetters([
      'getUserSubscriptionInfo',
      'getUserIsCivicLiker',
      'getCivicSupportingUsers',
      'getUserInfoById',
    ]),
    getStripeBillingPortalAPI,
    authorLikerIds() {
      return Object.keys(this.getCivicSupportingUsers);
    },
    maskedCardNumber() {
      if (this.getUserSubscriptionInfo) {
        const {
          card: { brand, last4 },
        } = this.getUserSubscriptionInfo;
        return getMaskedCardNumber(brand, last4);
      }
      return '';
    },
  },
  async mounted() {
    if (!this.getUserIsCivicLiker) {
      this.state = 'error-not-civic';
      return;
    }
    try {
      await Promise.all([
        this.fetchCivicSupportingUsers(),
        this.fetchUserSubscriptionInfo(),
      ]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      this.state = 'error-civic-v2';
    }
    this.state = 'done';
  },
  methods: {
    ...mapActions(['fetchUserSubscriptionInfo', 'fetchCivicSupportingUsers']),
    getAuthorQuantity(id) {
      const { quantity } = this.getCivicSupportingUsers[id];
      return `${5 * quantity} USD/month`;
    },
  },
};
</script>
