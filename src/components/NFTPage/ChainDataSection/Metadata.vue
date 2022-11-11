<template>
  <div>
    <Label
      class="my-[20px]"
      :text="$t('nft_details_page_section_metadata_intro')"
      tag="div"
      preset="p6"
    />
    <div class="flex flex-col laptop:flex-row laptop:items-end laptop:justify-between gap-x-[32px]">
      <div class="min-w-0 truncate">
        <Label class="!text-[12px] text-medium-gray font-600">
          {{ $t('nft_details_page_section_metadata_url') }}&nbsp;<IconLinkExternal />
        </Label>
        <a
          class="text-medium-gray underline text-[12px]"
          :href="contentUrl"
          rel="noopener"
          target="_blank"
        >{{ contentUrl }}</a>
      </div>
      <div class="flex mt-[12px] gap-[8px] laptop:mt-0">
        <ButtonV2
          v-for="record in records"
          :key="record.text"
          :href="record.href"
          size="mini"
          preset="tertiary"
          class="text-medium-gray"
          content-class="text-[12px]"
        >
          {{ record.label }}&nbsp;<IconLinkExternal />
        </ButtonV2>
      </div>
    </div>
  </div>
</template>

<script>
import { ARWEAVE_ENDPOINT, IPFS_VIEW_GATEWAY_URL } from '~/constant';

const sortOrder = {
  iscn: 1,
  ipfs: 2,
  ar: 3,
};

export default {
  name: 'NFTPageChainDataSectionMetadata',
  props: {
    contentUrl: {
      type: String,
      default: '',
    },
    iscnId: {
      type: String,
      default: '',
    },
    iscnUrl: {
      type: String,
      default: '',
    },
    contentFingerprints: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    records() {
      const records = [
        {
          label: this.$t('nft_details_page_section_metadata_iscn'),
          href: this.iscnUrl,
          text: this.iscnId,
          order: this.getProtocolOrder('iscn'),
        },
      ];

      this.contentFingerprints.forEach(fingerprint => {
        const [protocol, text] = fingerprint.split('://');
        const order = this.getProtocolOrder(protocol);
        switch (protocol) {
          case 'ar':
            records.push({
              label: this.$t('nft_details_page_section_metadata_ar'),
              href: `${ARWEAVE_ENDPOINT}/${text}`,
              text,
              order,
            });
            break;
          case 'ipfs':
            records.push({
              label: this.$t('nft_details_page_section_metadata_ipfs'),
              href: `${IPFS_VIEW_GATEWAY_URL}/${text}`,
              text,
              order,
            });
            break;
          default:
            break;
        }
      });
      return records.sort((a, b) => a.order - b.order);
    },
  },
  methods: {
    getProtocolOrder(protocol) {
      return sortOrder[protocol];
    },
  },
};
</script>
