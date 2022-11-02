<template>
  <div>
    <Label
      class="my-[20px]"
      :text="$t('nft_details_page_section_metadata_intro')"
      tag="div"
      preset="p6"
    />
    <div class="flex flex-col laptop:flex-row laptop:items-end laptop:justify-between">
      <div class="flex-col items-start">
        <Label class="!text-[12px] text-medium-gray font-600">
          {{ $t('nft_details_page_section_metadata_url') }}&nbsp;<IconLinkExternal />
        </Label>
        <a :href="contentUrl" target="_blank" class="block text-medium-gray underline text-[12px]">{{ contentUrl }}</a>
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
import {
  ARWEAVE_ENDPOINT,
  APP_LIKE_CO_URL_BASE,
  IPFS_VIEW_GATEWAY_URL,
} from '~/constant';

export default {
  name: 'NFTPageMetadataSection',
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
        },
      ];
      const array = this.contentFingerprints;
      const sorted = array.sort((a, b) => {
        const sortOrder = {
          ipfs: 1,
          ar: 2,
        };
        if (sortOrder[a.split('://')[0]] < sortOrder[b.split('://')[0]])
          return -1;
        if (sortOrder[a.split('://')[0]] > sortOrder[b.split('://')[0]])
          return 1;
        return 0;
      });

      sorted.forEach(fingerprint => {
        const [protocol, text] = fingerprint.split('://');
        switch (protocol) {
          case 'ar':
            records.push({
              label: this.$t('nft_details_page_section_metadata_ar'),
              href: `${ARWEAVE_ENDPOINT}/${text}`,
              text,
            });
            break;
          case 'ipfs':
            records.push({
              label: this.$t('nft_details_page_section_metadata_ipfs'),
              href: `${IPFS_VIEW_GATEWAY_URL}/${text}`,
              text,
            });
            break;
          default:
            break;
        }
      });
      return records;
    },
  },
};
</script>
