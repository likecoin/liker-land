<template>
  <div v-if="!isPopUp || isShow" :class="rootClass">
    <div
      v-if="isPopUp"
      class="absolute opacity-50 bg-gray-c pin"
      @click="close"
    />
    <div :class="dialogClass">
      <div class="flex items-start justify-between p-32 bg-like-gradient text-like-green">
        <div class="flex items-center">
          <img
            class="mr-16"
            src="~/assets/images/civic-liker-icon.png"
            :alt="$t('civic_page_v3_title')"
            style="width:64px"
          >
          <i18n class="text-32" path="civic_liker_web_3_notice_header">
            <i18n
              class="font-600"
              tag="span"
              path="civic_liker_web_3_notice_header_web3"
              place="web3"
            />
          </i18n>
        </div>
        <Button v-if="isPopUp" preset="plain" @click="close">
          <Close class="w-16" />
        </Button>
      </div>
      <div class="p-32 bg-white">
        <i18n class="leading-1_5 font-200" path="civic_liker_web_3_notice_message">
          <i18n
            v-for="(path, i) in [
              'civic_liker_web_3_notice_message_highlight_1',
              'civic_liker_web_3_notice_message_highlight_2',
            ]"
            :key="`${i}`"
            class="font-400 text-like-green"
            tag="span"
            :path="path"
            :place="`${i}`"
          />
        </i18n>
        <div class="flex justify-center mt-32">
          <Button
            :title="$t('civic_liker_web_3_notice_button')"
            content-class="px-16"
            :to="{ name: 'civic' }"
            rel="noopener"
          >
            <template #prepend>
              <AlertCircle class="w-16" />
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlertCircle from '~/assets/icons/alert-circle.svg?inline';
import Close from '~/assets/icons/cross.svg?inline';

import Button from './LegacyButton/Button';

export default {
  name: 'CivicLikerWeb3Notice',
  components: {
    AlertCircle,
    Button,
    Close,
  },
  props: {
    isPopUp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: true,
    };
  },
  computed: {
    rootClass() {
      return this.isPopUp
        ? [
            'fixed',
            'pin',
            'flex',
            'justify-center',
            'items-start',
            'pt-64',
            'z-50',
          ]
        : undefined;
    },
    dialogClass() {
      return ['overflow-hidden', 'rounded-14'].concat(
        ...(this.isPopUp ? ['relative', 'max-w-phone', 'mx-auto'] : [])
      );
    },
  },
  methods: {
    close() {
      this.isShow = false;
    },
  },
};
</script>
