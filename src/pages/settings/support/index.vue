<template>
  <Transition name="fade" mode="out-in">
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
  </Transition>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import AuthorListItem from '~/components/AuthorListItem';

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
    authorLikerIds() {
      return Object.keys(this.getCivicSupportingUsers);
    },
  },
  async mounted() {
    if (!this.getUserIsCivicLiker) {
      this.state = 'error-not-civic';
      return;
    }
    try {
      await this.fetchCivicSupportingUsers();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      this.state = 'error-civic-v2';
    }
    this.state = 'done';
  },
  methods: {
    ...mapActions(['fetchCivicSupportingUsers']),
    getAuthorQuantity(id) {
      const { quantity } = this.getCivicSupportingUsers[id];
      return `${5 * quantity} USD/month`;
    },
  },
};
</script>
