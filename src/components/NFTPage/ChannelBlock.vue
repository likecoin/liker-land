<template>
  <div
    v-if="affiliationName"
    :class="[
      'flex',
      'flex-col',
      'items-start',
      'gap-[0]',
      'px-[16px]',
      'py-[8px]',
      'border-[1px]',
      'border-shade-gray',
      'shadow-sm',
      'rounded-[12px]',
      'rounded-bl-[4px]',
      'bg-white',
    ]"
  >
    <div
      :class="[
        'relative',
        'flex',
        'justify-start',
        'items-end',
        'gap-[18px]',
        'mb-[0]',
        'w-full',
        'pl-[50px]',
      ]"
    >
      <Identity
        class="absolute top-0 left-0 flex-shrink-0 translate-y-[-50%]"
        :avatar-url="avatarUrl"
        :avatar-size="40"
      />
      <p class="text-black whitespace-normal break-words font-600 text-[14px]">
        {{
          isCollection
            ? $t('campaign_nft_collection_channel', {
                channel: affiliationName,
              })
            : $t('campaign_nft_book_channel', { channel: affiliationName })
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { AFFILIATION_CHANNEL_LEGACY_STRINGS } from '~/constant';

export default {
  name: 'NFTPageChannelBlock',
  props: {
    isCollection: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['getUserInfoById']),
    channel() {
      const { from } = this.$route.query;
      return from;
    },
    affiliationLikerId() {
      if (!this.channel) {
        return undefined;
      }

      if (this.channel.startsWith('@')) {
        return this.channel.slice(1);
      }

      const affiliationId = AFFILIATION_CHANNEL_LEGACY_STRINGS[this.channel];
      if (affiliationId) {
        return affiliationId.slice(1);
      }

      return undefined;
    },
    affiliationName() {
      if (!this.affiliationLikerId) {
        return undefined;
      }
      const userData = this.getUserInfoById(this.affiliationLikerId);

      return userData?.displayName;
    },
    avatarUrl() {
      if (!this.affiliationLikerId) {
        return undefined;
      }
      const userData = this.getUserInfoById(this.affiliationLikerId);
      return userData?.avatar;
    },
  },
  watch: {
    affiliationLikerId: {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchAffiliationName();
        }
      },
    },
  },

  methods: {
    ...mapActions(['fetchUserInfo']),
    async fetchAffiliationName() {
      try {
        await this.fetchUserInfo({ id: this.affiliationLikerId });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
};
</script>
