<template>
  <BaseDialog
    :content-key="state"
    :is-show="true"
    :is-show-backdrop="isShowBackdrop || state === 'loading'"
    :is-animated="true"
    content-container-class="rounded-8 phone:rounded-none"
    @click-outside="onClickBackdrop"
  >
    <div
      v-if="state === 'new'"
      key="new"
      class="p-32 phone:px-16"
    >
      <button
        class="mb-32 settings-page-header__back-button text-like-green"
        @click="onClickBackButton"
      ><span class="whitespace-no-wrap">{{ $t('goBack') }}</span></button>

      <div class="mx-40 phone:mx-0">
        <CivicLikerSupportLikerView
          :avatar-url="avatarUrl"
          :display-name="displayName"
          :is-civic-liker="isCivicLiker"
          :subtitle="$t('SettingsSupportUsersPage.Slogan')"
        />

        <hr class="my-24 border-t-1 border-gray-d8">

        <CivicLikerSupportAmountView
          :price="selectedQuantity * dollar"
          :currency="currency"
          :period="$t('SubscriptionPeriod.Month')"
          :prefix="priceEmoji"
          :hint-text="$t('UpdateSupportQuantity.HintText', { name: displayName })"
          @click-add="goToSelectQuantity"
        />

        <div class="mx-40 mt-16">
          <Button
            :title="$t('UpdateSupportQuantity.Subscribe')"
            :full="true"
            size="large"
            @click="goToConfirm"
          />
        </div>

        <hr class="my-24 border-t-1 border-gray-d8">

        <ul class="m-0 p-0 list-style-none">
          <li class="flex items-center">
            <img class="w-80" src="~/assets/images/civic-v2/support/support-group.png">
            <div class="flex-grow ml-24 phone:ml-12">
              <h1
                class="text-like-green text-16"
              >{{ $t(`SettingsSupportUsersPage.Benefits.0.Title`) }}</h1>
              <p
                class="mt-8 text-14 font-200"
              >{{ $t(`SettingsSupportUsersPage.Benefits.0.Description`) }}</p>
            </div>
          </li>
          <li class="flex items-center mt-24">
            <img class="w-80" src="~/assets/images/civic-v2/support/follow-me.png">
            <div class="flex-grow ml-24 phone:ml-12">
              <h1
                class="text-like-green text-16"
              >{{ $t(`SettingsSupportUsersPage.Benefits.1.Title`) }}</h1>
              <p
                class="mt-8 text-14 font-200"
              >{{ $t(`SettingsSupportUsersPage.Benefits.1.Description`) }}</p>
            </div>
          </li>
          <li class="flex items-center mt-24">
            <img class="w-80" src="~/assets/images/civic-v2/support/contribute.png">
            <div class="flex-grow ml-24 phone:ml-12">
              <h1
                class="text-like-green text-16"
              >{{ $t(`SettingsSupportUsersPage.Benefits.2.Title`) }}</h1>
              <p
                class="mt-8 text-14 font-200"
              >{{ $t(`SettingsSupportUsersPage.Benefits.2.Description`) }}</p>
            </div>
          </li>
        </ul>

        <div class="mx-40 mt-32">
          <Button
            :title="$t('UpdateSupportQuantity.Subscribe')"
            :full="true"
            size="large"
            @click="goToConfirm"
          />
        </div>
      </div>
    </div>

    <div
      v-else-if="state === 'select-quantity'"
      key="select-quantity"
      class="p-32 phone:px-24"
    >
      <button
        class="settings-page-header__back-button text-like-green"
        @click="onClickBackButton"
      ><span class="whitespace-no-wrap">{{ $t('goBack') }}</span></button>

      <div class="mt-16 px-40 phone:px-0">
        <Identity
          :avatar-url="avatarUrl"
          :avatar-size="64"
          :is-avatar-outlined="isCivicLiker"
        />

        <h2
          class="mt-12 text-24 text-like-green font-500 leading-1_5"
        >{{ $t('UpdateSupportQuantity.Title', { name: displayName }) }}</h2>

        <div class="mx-24 phone:mx-0">
          <SelectButton
            v-for="option in quantityOptions"
            :key="option.value"
            class="w-full mt-12"
            :is-selected="selectedQuantity === option.value"
            @click="selectedQuantity = option.value"
          >
            <span class="font-emoji text-24">{{ getPriceEmoji(option.value * dollar) }}</span> {{ option.text }}
          </SelectButton>

          <Button
            class="mt-24"
            :title="$t(selectedQuantity === currentQuantity ? 'confirm' : 'UpdateSupportQuantity.Next')"
            :full="true"
            size="large"
            @click="confirmQuantity"
          />
        </div>
      </div>
    </div>

    <div
      v-else-if="state === 'confirm'"
      key="confirm"
      class="p-32 phone:px-24"
    >
      <button
        class="mb-16 settings-page-header__back-button text-like-green"
        @click="onClickBackButton"
      ><span class="whitespace-no-wrap">{{ $t('goBack') }}</span></button>

      <CivicLikerSupportAmountView
        :price="selectedQuantity * dollar"
        :currency="currency"
        :period="$t('SubscriptionPeriod.Month')"
        :prefix="priceEmoji"
        @click-add="goToSelectQuantity"
      />

      <hr class="my-16 border-t-1 border-gray-d8">

      <CivicLikerSupportLikerView
        :class="{ 'my-24 ml-8': isCivicLiker }"
        :avatar-url="avatarUrl"
        :display-name="displayName"
        :is-civic-liker="isCivicLiker"
        :subtitle="$t('SettingsSupportUsersPage.SloganConfirm')"
        :is-subtitle-top="true"
      />

      <hr class="my-16 border-t-1 border-gray-d8">

      <div class="mt-20 mx-40 phone:mx-0 text-14 text-gray-4a font-200">
        <h2 class="mb-16 text-16 font-500">{{ $t('SupportSummary.Title') }}</h2>

        <div class="flex justify-between py-12 border-t-1 border-gray-d8">
          <div>{{ $t('SupportSummary.NewCharge', { name: displayName }) }}</div>
          <div class="font-500 whitespace-no-wrap">{{ `${currency} ${selectedQuantity * dollar}` }}</div>
        </div>

        <div class="flex justify-between py-12 border-t-1 border-gray-d8">
          <div>{{ $t('SupportSummary.OtherCharge') }}</div>
          <div class="font-500 whitespace-no-wrap">{{ `${currency} ${otherQuantity * dollar}` }}</div>
        </div>

        <div class="flex justify-between py-12 border-t-1 border-gray-d8 text-16 font-500">
          <div>{{ $t('SupportSummary.Total') }}</div>
          <div class="text-like-green whitespace-no-wrap">{{ `${currency} ${(otherQuantity + selectedQuantity) * dollar}` }}</div>
        </div>

        <div
          v-if="!isUserCurrentCivicV1"
          class="mt-24 text-16 font-500"
        >{{ $t('SupportSummary.BillingDate', { date: nextBillingDate }) }}</div>

        <Button
          class="mt-24"
          :title="$t('confirm')"
          :full="true"
          :disabled="isConfirmButtonDisabled"
          size="large"
          @click="onClickConfirmSubscriptionButton"
        />

        <div
          v-if="isConfirmButtonDisabled"
          class="flex mt-32 text-like-green"
        >
          <AlertCircle class="w-24 h-24 flex-no-shrink mr-12" />
          <i18n
            class="flex-grow text-like-green text-14 font-500 leading-1_5"
            :path="confimrButtonDisabledHintI18nPath"
            tag="p"
            :places="{ date: nextBillingDate }"
          >
            <NuxtLink
              class="text-like-green underline"
              :to="{ name: 'settings-civic-unsubscribe' }"
              place="unsubscribe"
            >{{ $t('SupportSummary.Error.CivicV1.Unsubscribe') }}</NuxtLink>
            <CL1VsCL2Link place="compare" />
          </i18n>
        </div>
      </div>
    </div>

    <div
      v-else-if="state === 'cancel'"
      key="cancel"
      class="p-32 phone:px-24"
    >
      <button
        class="mb-16 settings-page-header__back-button text-like-green"
        @click="onClickBackButton"
      ><span class="whitespace-no-wrap">{{ $t('goBack') }}</span></button>

      <div class="mx-24 phone:mx-0">
        <hr class="my-16 border-t-1 border-gray-d8">
        <CivicLikerSupportLikerView
          :class="{ 'my-24 ml-8': isCivicLiker }"
          :avatar-url="avatarUrl"
          :display-name="displayName"
          :is-civic-liker="isCivicLiker"
          :subtitle="$t('CancelSubscription.Subtitle')"
        />
        <hr class="my-16 border-t-1 border-gray-d8">
      </div>

      <div class="mt-32 mx-40 phone:mx-0">
        <BrokenHeart class="block mx-auto" />

        <div
          class="mt-16 text-24 text-like-green font-500 text-center"
        >{{ $t('CancelSubscription.Title') }}</div>

        <i18n
          class="mt-32 text-gray-4a text-14 leading-1_5"
          path="CancelSubscription.Description"
          tag="p"
          :places="{ date: nextBillingDate }"
        >
          <span class="font-500 text-like-green" place="name">{{ displayName }}</span>
        </i18n>

        <Button
          class="mt-32"
          :title="$t('CancelSubscription.Cancel')"
          :full="true"
          size="large"
          @click="goToWelcomePage"
        />

        <Button
          class="mt-12"
          preset="danger"
          :title="$t('CancelSubscription.Confirm')"
          :full="true"
          size="large"
          @click="cancelSubscription"
        />
      </div>
    </div>

    <div
      v-else-if="state === 'post-cancel'"
      key="cancel"
      class="px-72 pt-40 pb-32 phone:px-24"
    >
      <i18n
        tag="div"
        class="mt-16 text-24 text-like-green font-500 text-center"
        path="CancelSubscription.GoodBye"
        :places="{ name: displayName }"
      />

      <Button
        class="mt-24"
        :title="$t('ok')"
        :full="true"
        size="large"
        :to="{ name: 'settings-civic' }"
      />
    </div>

    <BaseDialog
      :is-show="isShowUpgradeWarning"
      content-container-class="max-w-phone-min rounded-8 phone:rounded-none mx-auto"
    >
      <div class="p-24">
        <div class="relative py-12">
          <Button
            class="absolute pin-t w-48 h-48 rounded-full shadow-4"
            preset="primary-invert"
            @click="isShowUpgradeWarning = false"
          >
            <Cross class="w-16 h-16" />
          </Button>
          <AlertCircle class="block mx-auto text-like-green w-24 h-24" />
        </div>
        <i18n
          class="mt-16 text-gray-4a leading-1_5 font-400"
          path="UpdateSupportQuantity.CL1.Content"
          tag="p"
        >
          <NuxtLink
            class="text-like-green underline"
            :to="{ name: 'settings-civic' }"
            place="here"
          >{{ $t('UpdateSupportQuantity.CL1.Here') }}</NuxtLink>
        </i18n>
        <Button
          class="mt-24"
          :title="$t('UpdateSupportQuantity.CL1.Upgrade')"
          :full="true"
          size="large"
          @click="confirmSubscription"
        />
      </div>
    </BaseDialog>

    <template #footer>
      <div
        v-if="state === 'loading'"
        key="loading"
      >
        <Spinner class="mx-auto my-96" />
      </div>
      <div
        v-else-if="state === 'select-quantity' && isUserCurrentCivic && currentQuantity > 0 && !isCancelled"
        class="text-center mt-16"
      >
        <a
          class="text-12 text-gray-4a underline"
          href="#"
          @click.prevent="state = 'cancel'"
        >{{ $t('UpdateSupportQuantity.Unsubscribe') }}</a>
      </div>
    </template>
  </BaseDialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import { getPriceEmoji } from '~/util/civic';

import BaseDialog from '~/components/BaseDialog';
import Button from '~/components/Button/Button';
import CivicLikerSupportAmountView from '~/components/CivicLikerSupportView/CivicLikerSupportAmountView';
import CivicLikerSupportLikerView from '~/components/CivicLikerSupportView/CivicLikerSupportLikerView';
import CL1VsCL2Link from '~/components/CL1VsCL2Link';
import Identity from '~/components/Identity/Identity';
import SelectButton from '~/components/SelectButton/SelectButton';
import Spinner from '~/components/Spinner/Spinner';

const STATES = ['select-quantity', 'confirm'];

export default {
  components: {
    AlertCircle: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/alert-circle.svg'),
    BaseDialog,
    BrokenHeart: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/images/civic-v2/broken-heart.svg'),
    Button,
    CivicLikerSupportLikerView,
    CivicLikerSupportAmountView,
    CL1VsCL2Link,
    Cross: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/cross.svg'),
    Identity,
    SelectButton,
    Spinner,
  },
  props: {
    isShowBackdrop: {
      type: Boolean,
      default: false,
    },
    initialState: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      state: 'loading',
      selectedQuantity: 1,

      displayName: '',
      avatarUrl: '',
      isCivicLiker: false,
      isShowUpgradeWarning: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getUserSubscriptionInfo',
      'getCivicSupportingUserInfo',
      'getUserIsCivicLiker',
      'getUserIsCivicLikerV2',
      'getUserShouldRenewCivic',
      'getUserInfoById',
    ]),
    dollar() {
      return 5.0;
    },
    currency() {
      return this.$t('Currency.USD');
    },
    authorId() {
      return this.$route.params.id;
    },
    quantityOptions() {
      return [1, 4, 20].map(quantity => ({
        text: `${quantity * this.dollar} ${this.currency}/${this.$t(
          'SubscriptionPeriod.Month'
        )}`,
        value: quantity,
      }));
    },
    currentQuantity() {
      const { quantity = 0 } =
        this.getCivicSupportingUserInfo(this.authorId) || {};
      return quantity;
    },
    otherQuantity() {
      if (!this.getUserSubscriptionInfo || !this.getUserIsCivicLikerV2) {
        return 0;
      }
      return this.getUserSubscriptionInfo.quantity - this.currentQuantity;
    },
    priceEmoji() {
      return getPriceEmoji(this.selectedQuantity * this.dollar);
    },
    nextBillingDate() {
      if (this.getUserSubscriptionInfo) {
        return this.getUserSubscriptionInfo.currentPeriodEndString;
      }
      return dateFormat(Date.now(), 'YYYY/MM/DD');
    },
    isCancelled() {
      return (
        this.getUserSubscriptionInfo && this.getUserSubscriptionInfo.willCancel
      );
    },
    isSelf() {
      return this.authorId === this.getUserId;
    },
    isUserCurrentCivic() {
      // allow old v1 user to renew to v2 by not treating shouldRenew(grace) user as current
      return this.getUserIsCivicLiker && !this.getUserShouldRenewCivic;
    },
    isUserCurrentCivicV1() {
      return this.isUserCurrentCivic && !this.getUserIsCivicLikerV2;
    },
    isConfirmButtonDisabled() {
      return this.isSelf || this.isUserCurrentCivicV1;
    },
    confimrButtonDisabledHintI18nPath() {
      if (this.isSelf) {
        return 'SupportSummary.Error.UnableSubSelf';
      }
      if (this.isUserCurrentCivicV1) {
        return 'SupportSummary.Error.CivicV1.Content';
      }
      return '';
    },
  },
  watch: {
    authorId(authorId, prevAuthorId) {
      if (authorId !== prevAuthorId) {
        this.fetchInfo();
      }
    },
  },
  mounted() {
    this.fetchInfo();
  },
  methods: {
    ...mapActions([
      'fetchUserInfo',
      'fetchUserSubscriptionInfo',
      'fetchCivicSupportingUsers',
      'updateCivicSupportQuantity',
      'removeCivicSupportUser',
    ]),

    getPriceEmoji,

    setState(newState) {
      if (!this.stateHistory) {
        this.stateHistory = [];
      }
      const { state } = this;
      if (state !== 'loading') {
        this.stateHistory.push(state);
      }
      this.state = newState;
    },

    async fetchLikerInfo() {
      try {
        if (this.authorId && !this.getUserInfoById(this.authorId)) {
          await this.fetchUserInfo(this.authorId);
        }
        const authorData = this.getUserInfoById(this.authorId) || {};
        this.displayName = authorData.displayName;
        this.avatarUrl = authorData.avatar;
        this.isCivicLiker =
          authorData.isCivicLikerTrial || authorData.isSubscribedCivicLiker;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },

    async fetchInfo() {
      const promises = [this.fetchLikerInfo()];
      if (this.isUserCurrentCivic) {
        if (
          this.getUserIsCivicLikerV2 &&
          !this.getCivicSupportingUserInfo(this.authorId)
        ) {
          promises.push(this.fetchCivicSupportingUsers());
        }
        if (!this.getUserSubscriptionInfo) {
          promises.push(this.fetchUserSubscriptionInfo());
        }
      }
      try {
        await Promise.all(promises);
      } catch (err) {
        this.$router.replace({ name: 'settings-civic' });
      }
      // Set default to  1 for new subscription
      let { quantity = 1 } =
        this.getCivicSupportingUserInfo(this.authorId) || {};
      const parsedQuantity = parseInt(this.$route.query.quantity, 10);
      if (parsedQuantity && parsedQuantity > 0) {
        quantity = parsedQuantity;
      }
      this.selectedQuantity = quantity;
      this.prevSelectedQuantiy = quantity;

      let state;
      if (STATES.includes(this.initialState)) {
        state = this.initialState;
      } else if (this.isUserCurrentCivic) {
        state = 'confirm';
      } else {
        state = 'new';
      }
      this.setState(state);
    },

    goToSelectQuantity() {
      this.setState('select-quantity');
    },

    confirmQuantity() {
      this.prevSelectedQuantiy = this.selectedQuantity;
      if (this.selectedQuantity === this.currentQuantity) {
        this.$router.push({ name: 'settings-civic' });
      } else {
        this.goToConfirm();
      }
    },

    goToConfirm() {
      if (this.getUserId) {
        this.setState('confirm');
      } else {
        this.$router.push({
          name: 'id-civic-register',
          query: {
            from: this.authorId,
            quantity: this.selectedQuantity,
            utm_source: this.$route.query.utm_source,
            utm_medium: this.$route.query.utm_medium,
          },
        });
      }
    },

    goToWelcomePage() {
      this.state = 'loading';
      this.$router.push({
        name: 'id',
        params: { id: this.authorId },
        query: { civic_welcome: '1' },
      });
    },

    goBack() {
      if (this.stateHistory && this.stateHistory.length) {
        this.state = this.stateHistory.pop();
      } else if (this.currentQuantity > 0) {
        // Go back to settings for updating subscription
        this.$router.push({ name: 'settings-civic' });
      } else {
        // Go back to portfolio for new subscription
        this.$router.push({ name: 'id', params: { id: this.authorId } });
      }
    },

    onClickConfirmSubscriptionButton(e) {
      if (this.getUserShouldRenewCivic) {
        this.isShowUpgradeWarning = true;
      } else {
        this.confirmSubscription(e);
      }
    },

    confirmSubscription(e) {
      this.$emit('confirm-subscription', e);
      if (this.isUserCurrentCivic) {
        this.updateSubscription();
      } else {
        this.$router.push({
          name: `civic-register-stripe`,
          query: {
            from: this.authorId,
            civic_liker_version: 2,
            quantity: this.selectedQuantity,
            utm_source: this.$route.query.utm_source,
            utm_medium: this.$route.query.utm_medium,
          },
        });
      }
    },

    async updateSubscription() {
      const { currentQuantity, selectedQuantity, authorId } = this;
      if (currentQuantity === selectedQuantity) return;
      this.state = 'loading';
      await this.updateCivicSupportQuantity({
        user: authorId,
        quantity: selectedQuantity,
      });
      await this.fetchUserSubscriptionInfo();
      this.goToWelcomePage();
    },

    async cancelSubscription() {
      const { authorId } = this;
      if (!this.currentQuantity) return;
      this.state = 'loading';
      await this.removeCivicSupportUser(authorId);
      await this.fetchUserSubscriptionInfo();
      this.state = 'post-cancel';
    },

    onClickBackButton() {
      if (this.state === 'select-quantity') {
        this.selectedQuantity = this.prevSelectedQuantiy;
      }
      this.goBack();
    },

    onClickBackdrop() {
      if (this.state !== 'loading' && this.isUserCurrentCivic) {
        this.goBack();
      }
    },
  },
};
</script>
