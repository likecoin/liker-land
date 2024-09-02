<template>
  <div
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
import { AFFILIATION_CHANNELS } from '~/constant';

export default {
  name: 'NFTPageChannelBlock',
  props: {
    channel: {
      type: String,
      default: '',
    },
    isCollection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      affiliationName: '',
      avatarUrl: '',
    };
  },
  computed: {
    ...mapGetters(['getUserInfoById']),
  },
  watch: {
    channel: {
      immediate: true,
      handler(newVal) {
        this.fetchAffiliationName(newVal);
      },
    },
  },

  methods: {
    ...mapActions(['fetchUserInfo']),
    async fetchAffiliationName(channel) {
      let likerId = '';

      if (channel.startsWith('@')) {
        likerId = channel.slice(1);
      } else {
        const legacyEntry = AFFILIATION_CHANNELS.find(
          store => store.legacyId === channel
        );
        if (legacyEntry) {
          likerId = legacyEntry.id.slice(1);
        }
      }

      if (!likerId) {
        this.affiliationName = channel;
        return;
      }

      try {
        await this.fetchUserInfo({ id: likerId });
        const { displayName, avatar } = this.getUserInfoById(likerId);
        this.affiliationName = displayName || likerId;
        this.avatarUrl = avatar;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.affiliationName = likerId;
      }
    },
  },
};
</script>
