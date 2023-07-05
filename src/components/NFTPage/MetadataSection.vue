<template>
  <CardV2>
    <Label
      class="font-600"
      :text="$t('nft_details_page_section_metadata')"
      tag="div"
      preset="h5"
      valign="middle"
      content-class="text-like-green"
      prepend-class="text-like-green"
    >
      <template #prepend>
        <IconCreativeWork />
      </template>
    </Label>

    <Label
      class="mt-[24px]"
      :text="$t('nft_details_page_section_metadata_intro')"
      tag="div"
      preset="p6"
    />

    <ul>
      <li
        v-for="record in records"
        :key="record.text"
      >
        <Separator class="mt-[24px]" />

        <Label
          tag="div"
          preset="h6"
          content-class="text-medium-gray font-600"
          :text="record.label"
        />
        <LinkV2 class="text-medium-gray" :href="record.href">
          <Label class="truncate" preset="p6" :is-raw="true">{{ record.text }}</Label>
        </LinkV2>
      </li>
    </ul>
  </CardV2>
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
          label: this.$t('nft_details_page_section_metadata_url'),
          href: this.contentUrl,
          text: this.contentUrl,
        },
        {
          label: this.$t('nft_details_page_section_metadata_iscn'),
          href: this.iscnUrl,
          text: this.iscnId,
        },
      ];

      this.contentFingerprints.forEach(fingerprint => {
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
          case 'num':
            records.push({
              label: this.$t('nft_details_page_section_metadata_ipfs'),
              href: `${APP_LIKE_CO_URL_BASE}/api/numbers-protocol/assets/${text}`,
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
