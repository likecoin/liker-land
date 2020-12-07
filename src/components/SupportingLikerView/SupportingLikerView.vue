<template>
  <PureSupportingLikerView
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
        :to="{ name: 'id-civic', params: { id: likerId } }"
      >{{ $t('edit') }}</nuxt-link>
    </template>
  </PureSupportingLikerView>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getPriceEmoji } from '../../util/civic';

import PureSupportingLikerView from './PureSupportingLikerView';

export default {
  name: 'SupprtingLikerView',
  components: {
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
