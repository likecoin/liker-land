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
        <i18n :path="messageI18nPath">
          <span class="font-[600] text-like-green" place="creator">{{ creatorDisplayName }}</span>
          <span class="font-[600] text-like-green" place="email">{{ email }}</span>
        </i18n>
      </Label>
      <ProgressIndicator v-if="isLoading" class="mt-[16px] h-[44px]" />
      <ButtonV2
        v-else-if="!isCompleted"
        class="mt-[16px] font-[600]"
        preset="secondary"
        :text="confirmButtonTitle"
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
import { logTrackerEvent } from '~/util/EventLogger';

import { createUserInfoMixin } from '~/mixins/user-info';
import alertMixin from '~/mixins/alert';

const creatorInfoMixin = createUserInfoMixin({ propKey: 'Creator' });

function isSubscribePage(route) {
  return route.name === 'id-index-subscribe-subscriptionId';
}

export default {
  // Both subscribe page and unsubscribe page share the same component
  name: 'NFTCreatorSubscriptionPage',
  mixins: [alertMixin, creatorInfoMixin],
  data() {
    return {
      // From asyncData
      wallet: '',
      isCompleted: false,

      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(['getUserInfoByAddress']),
    isSubscribePage() {
      return isSubscribePage(this.$route);
    },
    headerText() {
      return this.$t(
        this.isSubscribePage
          ? 'portfolio_subscribe_title'
          : 'portfolio_unsubscribe_title',
        {
          creator: this.creatorDisplayName,
        }
      );
    },
    messageI18nPath() {
      if (this.isCompleted) {
        return this.isSubscribePage
          ? 'portfolio_subscribe_message_success'
          : 'portfolio_unsubscribe_message_success';
      }
      return this.isSubscribePage
        ? 'portfolio_subscribe_message'
        : 'portfolio_unsubscribe_message';
    },
    confirmButtonTitle() {
      return this.$t(
        this.isSubscribePage
          ? 'portfolio_subscribe_confirm_button'
          : 'portfolio_unsubscribe_confirm_button'
      );
    },
    email() {
      return this.$route.query.email;
    },
  },
  async asyncData({ $api, route, params, redirect }) {
    const { id: creatorId, subscriptionId } = params;
    try {
      const res = await $api.$get(
        nftMintSubscriptionAPI({ id: subscriptionId })
      );
      return {
        wallet: res.subscribedWallet,
        isCompleted: isSubscribePage(route) ? res.isVerified : false,
      };
    } catch (err) {
      redirect({ name: 'id', params: { id: creatorId } });
      return undefined;
    }
  },
  async mounted() {
    await this.lazyGetUserInfoByAddress(this.wallet);
    if (this.isSubscribePage) {
      this.confirmSubscription();
    }
  },
  methods: {
    ...mapActions(['lazyGetUserInfoByAddress']),
    handleClickClose() {
      this.$router.replace({
        name: 'id',
        params: { id: this.wallet },
      });
    },
    handleClickConfirm() {
      return this.isSubscribePage
        ? this.confirmSubscription()
        : this.unsubscribe();
    },
    async confirmSubscription() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_mint_subscription_confirm',
        this.wallet,
        1
      );
      try {
        this.isLoading = true;
        await this.$api.$put(
          nftMintSubscriptionAPI({
            id: this.$route.params.subscriptionId,
            email: this.email,
          })
        );
        this.isCompleted = true;
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
    async unsubscribe() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_mint_subscription_cancel',
        this.wallet,
        1
      );
      try {
        this.isLoading = true;
        await this.$api.$delete(
          nftMintSubscriptionAPI({ id: this.$route.params.subscriptionId })
        );
        this.isCompleted = true;
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
