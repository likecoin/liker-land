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
import { AFFILIATION_CHANNELS } from '~/constant';
import { getUserMinAPI } from '~/util/api';

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
  watch: {
    channel: {
      immediate: true,
      handler(newVal) {
        this.fetchAffiliationName(newVal);
      },
    },
  },
  methods: {
    async fetchAffiliationName(channel) {
      if (channel.startsWith('@')) {
        const id = channel.slice(1);
        try {
          const { displayName, avatar } = await this.$api.$get(
            getUserMinAPI(id)
          );
          this.affiliationName = displayName || id;
          this.avatarUrl = avatar;
          return;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          this.affiliationName = id;
          return;
        }
      }

      const affiliation = AFFILIATION_CHANNELS.find(
        store => store.id === channel
      );
      if (affiliation) {
        this.affiliationName =
          affiliation.name[this.$i18n.locale] || affiliation.name.en;
      } else {
        this.affiliationName = channel;
      }
    },
  },
};
</script>
