<template>
  <div>
    <div v-if="state === 'loading'"> loading... </div>
    <div v-else>
      <AuthorListItem
        :liker-id="authorId"
        tag="div"
      />
      <select v-model="selectedQuantity">
        <option
          v-for="option in quantityOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
      <a href="#" @click.prevent="cancelSubscription">cancel subsciption</a>
      <hr>
      <a href="#" @click.prevent="updateSubscription">Confirm</a>
    </div>
    <div>
      <h2>Summary</h2>
      <div>Current {{ authorId }} Charge: {{ currentQuantity * 5 }}</div>
      <div v-if="selectedQuantity !== currentQuantity">
        New {{ authorId }} Charge: {{ selectedQuantity * 5 }}
      </div>
      <div>Other Charge: {{ otherQuantity * 5 }}</div>
      <div>Total: {{ (otherQuantity + selectedQuantity) * 5 }}</div>
      <div>{{ nextBillingDate }}</div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import AuthorListItem from '~/components/AuthorListItem';

export default {
  components: {
    AuthorListItem,
  },
  middleware: 'authenticated',
  data() {
    return {
      state: 'loading',
      selectedQuantity: 1,
    };
  },
  computed: {
    ...mapGetters([
      'getUserSubscriptionInfo',
      'getCivicSupportingUserInfo',
      'getUserIsCivicLiker',
      'getUserInfoById',
    ]),
    quantityOptions() {
      return Array(10)
        .fill()
        .map((_, i) => ({ text: `USD${(i + 1) * 5} / month`, value: i + 1 }));
    },
    authorId() {
      return this.$route.params.id;
    },
    currentQuantity() {
      const { quantity = 0 } =
        this.getCivicSupportingUserInfo(this.authorId) || {};
      return quantity;
    },
    otherQuantity() {
      if (!this.getUserSubscriptionInfo) return 0;
      return this.getUserSubscriptionInfo.quantity - this.currentQuantity;
    },
    nextBillingDate() {
      if (this.getUserSubscriptionInfo) {
        return this.getUserSubscriptionInfo.currentPeriodEndString;
      }
      return dateFormat(Date.now(), 'YYYY/MM/DD');
    },
  },
  async mounted() {
    const promises = [];
    if (!this.getUserIsCivicLiker) {
      this.$router.replace({ name: 'settings-support' });
    }
    if (!this.getCivicSupportingUserInfo(this.authorId)) {
      promises.push(this.fetchCivicSupportingUsers());
    }
    if (!this.getUserSubscriptionInfo) {
      promises.push(this.fetchUserSubscriptionInfo());
    }
    try {
      await Promise.all(promises);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      this.$router.replace({ name: 'settings-support' });
    }
    this.state = 'done';
    // Set default to  1 for new subscription
    const { quantity = 1 } =
      this.getCivicSupportingUserInfo(this.authorId) || {};
    this.selectedQuantity = quantity;
  },
  methods: {
    ...mapActions([
      'fetchCivicSupportingUsers',
      'fetchUserSubscriptionInfo',
      'updateCivicSupportQuantity',
      'removeCivicSupportUser',
    ]),
    async updateSubscription() {
      const { currentQuantity, selectedQuantity, authorId } = this;
      if (currentQuantity === selectedQuantity) return;
      await this.updateCivicSupportQuantity({
        user: authorId,
        quantity: selectedQuantity,
      });
      await this.fetchUserSubscriptionInfo();
      this.$router.push({ name: 'settings-support' });
    },
    async cancelSubscription() {
      const { authorId } = this;
      if (!this.currentQuantity) return;
      await this.removeCivicSupportUser(authorId);
      await this.fetchUserSubscriptionInfo();
      this.$router.push({ name: 'settings-support' });
    },
  },
};
</script>
