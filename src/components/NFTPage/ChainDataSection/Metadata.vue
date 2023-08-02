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
      <div v-if="nftId" class="min-w-0 truncate">
        <Label class="!text-[12px] text-medium-gray font-600">
          {{ $t('nft_details_page_section_metadata_nft_id') }}
        </Label>
        <Label class="!text-[12px] text-medium-gray">
          {{ nftId }}
        </Label>
      </div>
      <ul class="flex mt-[12px] gap-[8px] laptop:mt-0">
        <li
          v-for="{ type, label, records } in recordMap"
          :key="type"
        >
          <Dropdown v-if="records.length > 1">
            <template #trigger="{ toggle }">
              <ButtonV2
                size="mini"
                preset="tertiary"
                class="text-medium-gray"
                content-class="text-[12px]"
                @click="toggle"
              >
                {{ label }}
              </ButtonV2>
            </template>
            <MenuList>
              <ul>
                <li
                  v-for="record in records"
                  :key="record.href"
                >
                  <ButtonV2
                    :href="record.href"
                    size="mini"
                    preset="plain"
                    class="text-medium-gray"
                    content-class="text-[12px]"
                  >
                    {{ record.text | ellipsis }}&nbsp;<IconLinkExternal />
                  </ButtonV2>
                </li>
              </ul>
            </MenuList>
          </Dropdown>

          <ButtonV2
            v-else-if="records.length"
            :href="records[0].href"
            size="mini"
            preset="tertiary"
            class="text-medium-gray"
            content-class="text-[12px]"
          >
            {{ label }}&nbsp;<IconLinkExternal />
          </ButtonV2>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ARWEAVE_ENDPOINT, IPFS_VIEW_GATEWAY_URL } from '~/constant';
import { ellipsis } from '~/util/ui';

const CONTENT_FINGERPRINT_TYPES = ['iscn', 'ipfs', 'ar'];

export default {
  name: 'NFTPageChainDataSectionMetadata',
  filters: {
    ellipsis,
  },
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
    classId: {
      type: String,
      default: '',
    },
    nftId: {
      type: String,
      default: '',
    },
    contentFingerprints: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    recordMap() {
      const recordMap = {
        iscn: [
          {
            href: this.iscnUrl,
            text: this.iscnId,
          },
        ],
      };

      this.contentFingerprints.forEach(fingerprint => {
        const [protocol, text] = fingerprint.split('://');
        if (!recordMap[protocol]) recordMap[protocol] = [];
        switch (protocol) {
          case 'ar':
            recordMap[protocol].push({
              href: `${ARWEAVE_ENDPOINT}/${text}`,
              text,
            });
            break;
          case 'ipfs':
            recordMap[protocol].push({
              href: `${IPFS_VIEW_GATEWAY_URL}/${text}`,
              text,
            });
            break;
          default:
            break;
        }
      });

      return CONTENT_FINGERPRINT_TYPES.map(type => ({
        type,
        label: this.getRecordLabel(type),
        records: recordMap[type] || [],
      }));
    },
  },
  methods: {
    getRecordLabel(type) {
      switch (type) {
        case 'iscn':
          return this.$t('nft_details_page_section_metadata_iscn');
        case 'ipfs':
          return this.$t('nft_details_page_section_metadata_ipfs');
        case 'ar':
          return this.$t('nft_details_page_section_metadata_ar');
        default:
          return '';
      }
    },
  },
};
</script>
