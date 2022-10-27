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
        <i18n :path="hasConfirmed ? 'portfolio_subscribe_message_success' : 'portfolio_subscribe_message'">
          <span class="font-[600] text-like-green" place="creator">{{ creatorDisplayName }}</span>
          <span class="font-[600] text-like-green" place="email">{{ email }}</span>
        </i18n>
      </Label>
      <ProgressIndicator v-if="isLoading" class="mt-[16px] h-[44px]" />
      <ButtonV2
        v-else-if="!hasConfirmed"
        class="mt-[16px] font-[600]"
        preset="secondary"
        :text="$t('portfolio_subscribe_confirm_button')"
        :is-disabled="isLoading"
        @click="handleClickConfirm"
      />
      <ButtonV2
        v-else
        class="mt-[16px] font-[600]"
        preset="outline"
        :text="$t('portfolio_subscription_back_button')"
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
  name: 'NFTSubscribeCreatorConfirmPage',
  mixins: [alertMixin],
  data() {
    return {
      // From asyncData
      wallet: '',
      hasConfirmed: false,

      isLoading: false,
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
      return this.$t('portfolio_subscribe_title', {
        creator: this.creatorDisplayName,
      });
    },
    email() {
      return this.$route.query.email;
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
        hasConfirmed: res.isVerified,
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
        await this.$api.$put(
          nftMintSubscriptionAPI({
            id: this.$route.params.subscriptionId,
            email: this.email,
          })
        );
        this.hasConfirmed = true;
        this.alertPromptSuccess(
          this.$t('portfolio_subscribe_success_alert', {
            creator: this.formattedCreatorDisplayName,
          })
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        this.alertPromptError(
          this.$t('portfolio_subscribe_error_alert', {
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
