<template>
  <Dialog
    :open="true"
    :has-close-button="true"
    :header-text="headerText"
    panel-container-class="phone:max-w-[520px] laptop:w-[520px]"
    panel-class="shadow-lg bg-white w-full p-[48px] phone:px-[18px] rounded-[24px]"
    :is-disabled-backdrop-click="true"
    @close="handleClickClose"
  >
    <div class="flex flex-col items-center">
      <Identity
        :avatar-url="creatorInfo.avatar"
        :avatar-size="88"
        :is-avatar-outlined="isCreatorCivicLiker"
      />
      <Label
        class="mt-[24px]"
        preset="p5"
        align="center"
      >
        <i18n :path="hasUnsubscribed ? 'portfolio_unsubscribe_message_success' : 'portfolio_unsubscribe_message'">
          <span class="font-[600] text-like-green" place="creator">{{ creatorDisplayName }}</span>
          <span class="font-[600] text-like-green" place="email">{{ email }}</span>
        </i18n>
      </Label>
      <ButtonV2
        v-if="!hasUnsubscribed"
        class="mt-[16px] font-[600]"
        preset="secondary"
        :text="$t('portfolio_unsubscribe_confirm_button')"
        :is-disabled="isLoading"
        @click="handleClickConfirm"
      />
      <ButtonV2
        v-else
        class="mt-[16px] font-[600]"
        preset="outline"
        :text="$t('portfolio_unsubscribe_back_button')"
        @click="handleClickClose"
      />
    </div>
  </Dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { nftMintSubscriptionAPI } from '~/util/api';
import { ellipsis } from '~/util/ui';

import alertMixin from '~/mixins/alert';

export default {
  name: 'NFTUnsubscribeCreatorPage',
  mixins: [alertMixin],
  data() {
    return {
      // From asyncData
      wallet: '',
      email: '',

      isLoading: false,
      hasUnsubscribed: false,
    };
  },
  computed: {
    ...mapGetters(['getUserInfoByAddress']),
    creatorInfo() {
      return this.getUserInfoByAddress(this.wallet);
    },
    creatorDisplayName() {
      return ellipsis(this.creatorInfo?.displayName);
    },
    isCreatorCivicLiker() {
      return !!(
        this.creatorInfo?.isCivicLikerTrial ||
        this.creatorInfo?.isSubscribedCivicLiker
      );
    },
    headerText() {
      return this.$t('portfolio_unsubscribe_title', {
        creator: this.creatorDisplayName,
      });
    },
  },
  async asyncData({ $api, params, redirect }) {
    const { id: creatorId, subscriptionId } = params;
    try {
      const res = await $api.$get(
        nftMintSubscriptionAPI({ id: subscriptionId })
      );
      return {
        wallet: res.subscribedWallet,
        email: res.subscriberEmail,
      };
    } catch (err) {
      redirect({ name: 'id', params: { id: creatorId } });
      return undefined;
    }
  },
  mounted() {
    this.lazyGetUserInfoByAddress(this.wallet);
  },
  methods: {
    ...mapActions(['lazyGetUserInfoByAddress']),
    handleClickClose() {
      this.$router.replace({
        name: 'id',
        params: { id: this.wallet },
      });
    },
    async handleClickConfirm() {
      try {
        this.isLoading = true;
        await this.$api.$delete(
          nftMintSubscriptionAPI({ id: this.$route.params.subscriptionId })
        );
        this.hasUnsubscribed = true;
        this.alertPromptSuccess(
          this.$t('portfolio_unsubscribe_success_alert', {
            creator: this.formattedCreatorDisplayName,
          })
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        this.alertPromptError(
          this.$t('portfolio_unsubscribe_error_alert', {
            creator: this.formattedCreatorDisplayName,
            error: err.response.data,
          })
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
