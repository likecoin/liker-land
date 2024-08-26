<template>
  <a
    class="flex flex-col items-center px-[24px] py-[14px] cursor-pointer bg-white rounded-[14px]"
    href="https://dao.like.co/"
    target="_blank"
    rel="noopener"
  >
    <div class="text-center text-like-green text-[32px] font-600">
      {{ balance | formatNumber }}
    </div>
    <div class="text-medium-gray text-[12px] leading-[1]">
      {{ $t('header_menu_LIKE') }}
    </div>
  </a>
</template>

<script>
import { formatNumber } from '~/util/ui';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'BalanceCard',
  filters: {
    formatNumber,
  },
  mixins: [walletMixin],
  props: {
    balance: {
      type: [Number, String],
      default: 0,
    },
  },
};
</script>
