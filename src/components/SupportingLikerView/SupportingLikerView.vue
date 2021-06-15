<template>
  <PureSupportingClassicView
    v-if="isClassic"
    :is-active="price > 0"
    :button-to="to"
  />
  <PureSupportingLikerView
    v-else
    :avatar-url="avatarUrl"
    :display-name="displayName"
    :is-civic-liker="isCivicLiker"
    @click-identity="onClickIdentity"
  >
    <template #footer>
      <div
        v-if="price"
        class="text-20 text-gray-4a font-500"
      ><span class="font-emoji">{{ priceEmoji }}</span>
        {{ `${price} ${$t('Currency.USD')}/${$t('SubscriptionPeriod.Month')}` }}</div>
      <nuxt-link
        class="mt-8 text-12 text-like-green underline"
        :to="to"
      >{{ $t('edit') }}</nuxt-link>
    </template>
  </PureSupportingLikerView>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { CIVIC_LIKER_CLASSIC_LIKER_ID } from '../../constant';

import { getPriceEmoji } from '../../util/civic';

import PureSupportingClassicView from './PureSupportingClassicView';
import PureSupportingLikerView from './PureSupportingLikerView';

export default {
  name: 'SupprtingLikerView',
  components: {
    PureSupportingClassicView,
    PureSupportingLikerView,
  },
  props: {
    likerId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      displayName: '',
      avatarUrl: '',
      isCivicLiker: false,
    };
  },
  computed: {
    ...mapGetters(['getUserInfoById']),

    priceEmoji() {
      return getPriceEmoji(this.price);
    },
    isClassic() {
      return this.likerId === CIVIC_LIKER_CLASSIC_LIKER_ID;
    },
    to() {
      return {
        name: 'id-civic',
        params: { id: this.likerId },
        query: { initial_state: 'select-quantity' },
      };
    },
  },
  mounted() {
    this.fetchLikerInfo();
  },
  methods: {
    ...mapActions(['fetchUserInfo']),

    async fetchLikerInfo() {
      try {
        this.isLoading = true;
        if (this.likerId && !this.getUserInfoById(this.likerId)) {
          await this.fetchUserInfo(this.likerId);
        }
        const authorData = this.getUserInfoById(this.likerId) || {};
        this.displayName = authorData.displayName;
        this.avatarUrl = authorData.avatar;
        this.isCivicLiker =
          authorData.isCivicLikerTrial || authorData.isSubscribedCivicLiker;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    onClickIdentity() {
      this.$router.push({ name: 'id', params: { id: this.likerId } });
    },
  },
};
</script>
