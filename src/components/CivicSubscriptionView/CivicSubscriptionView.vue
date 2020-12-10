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
        @click="$router.back()"
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
          @click-add="onClickUpdateQuantity"
        />

        <div class="mx-40 mt-16">
          <Button
            :title="$t('UpdateSupportQuantity.Subscribe')"
            :full="true"
            size="large"
            @click="newSubscription"
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
            <div class="flex-grow ml-24">
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
            <div class="flex-grow ml-24">
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
            @click="newSubscription"
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
        @click="onGoBackFromSelectQuantity"
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
        @click="state = 'select-quantity'"
      ><span class="whitespace-no-wrap">{{ $t('goBack') }}</span></button>

      <CivicLikerSupportAmountView
        :price="selectedQuantity * dollar"
        :currency="currency"
        :period="$t('SubscriptionPeriod.Month')"
        :prefix="priceEmoji"
        @click-add="onClickUpdateQuantity"
      />

      <hr class="my-16 border-t-1 border-gray-d8">

      <CivicLikerSupportLikerView
        :class="{ 'my-24 ml-8': isCivicLiker }"
        :avatar-url="avatarUrl"
        :display-name="displayName"
        :is-civic-liker="isCivicLiker"
        :subtitle="$t('SettingsSupportUsersPage.SloganConfirm')"
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
          class="mt-24 text-16 font-500"
        >{{ $t('SupportSummary.BillingDate', { date: nextBillingDate }) }}</div>

        <Button
          class="mt-24"
          :title="$t('confirm')"
          :full="true"
          size="large"
          @click="updateSubscription"
        />
      </div>
    </div>

    <div
      v-else-if="state === 'cancel'"
      key="cancel"
      class="p-32 phone:px-24"
    >
      <button
        class="mb-16 settings-page-header__back-button text-like-green"
        @click="state = 'select-quantity'"
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
          @click="postsubscribe"
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
      <div
        class="mt-16 text-24 text-like-green font-500 text-center"
      >{{ $t('CancelSubscription.GoodBye') }}</div>

      <Button
        class="mt-24"
        :title="$t('ok')"
        :full="true"
        size="large"
        :to="{ name: 'settings-civic' }"
      />
    </div>

    <template #footer>
      <div
        v-if="state === 'loading'"
        key="loading"
      >
        <Spinner class="mx-auto my-96" />
      </div>
      <div
        v-else-if="state === 'select-quantity' && getUserIsCivicLiker && currentQuantity > 0 && !isCancelled"
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
import Identity from '~/components/Identity/Identity';
import SelectButton from '~/components/SelectButton/SelectButton';
import Spinner from '~/components/Spinner/Spinner';

const STATES = ['select-quantity', 'new', 'confirm'];

export default {
  components: {
    BaseDialog,
    BrokenHeart: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/images/civic-v2/broken-heart.svg'),
    Button,
    CivicLikerSupportLikerView,
    CivicLikerSupportAmountView,
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
      default: undefined,
    },
  },
  data() {
    return {
      state: 'loading',
      selectedQuantity: 1,

      displayName: '',
      avatarUrl: '',
      isCivicLiker: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserSubscriptionInfo',
      'getCivicSupportingUserInfo',
      'getUserIsCivicLiker',
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
      return [1, 2, 10, 20].map(quantity => ({
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
      if (!this.getUserSubscriptionInfo) return 0;
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

    async fetchLikerInfo() {
      try {
        this.isLoading = true;
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
      } finally {
        this.isLoading = false;
      }
    },

    async fetchInfo() {
      const promises = [this.fetchLikerInfo()];
      if (this.getUserIsCivicLiker) {
        if (!this.getCivicSupportingUserInfo(this.authorId)) {
          promises.push(this.fetchCivicSupportingUsers());
        }
        if (!this.getUserSubscriptionInfo) {
          promises.push(this.fetchUserSubscriptionInfo());
        }
      }
      try {
        await Promise.all(promises);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
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
      if (STATES.includes(this.initialState)) {
        this.state = this.initialState;
      } else {
        this.state = this.getUserIsCivicLiker ? 'select-quantity' : 'new';
      }
    },

    confirmQuantity() {
      this.prevSelectedQuantiy = this.selectedQuantity;
      if (this.selectedQuantity === this.currentQuantity) {
        this.$router.push({ name: 'settings-civic' });
      } else {
        this.state = this.getUserIsCivicLiker ? 'confirm' : 'new';
      }
    },

    newSubscription() {
      this.$router.push({
        name: `civic-register-stripe`,
        query: {
          from: this.authorId,
          civic_liker_version: 2,
          quantity: this.selectedQuantity,
        },
      });
    },
    postsubscribe() {
      this.state = 'loading';
      this.$router.push({
        name: 'id',
        params: { id: this.authorId },
        query: { civic_welcome: '1' },
      });
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
      this.postsubscribe();
    },
    async cancelSubscription() {
      const { authorId } = this;
      if (!this.currentQuantity) return;
      this.state = 'loading';
      await this.removeCivicSupportUser(authorId);
      await this.fetchUserSubscriptionInfo();
      this.state = 'post-cancel';
    },

    onGoBackFromSelectQuantity() {
      this.selectedQuantity = this.prevSelectedQuantiy;
      if (this.getUserIsCivicLiker) {
        this.$router.back();
      } else {
        this.state = 'new';
      }
    },

    onClickBackdrop() {
      if (this.state !== 'loading' && this.getUserIsCivicLiker) {
        this.$router.back();
      }
    },

    onClickUpdateQuantity() {
      this.state = 'select-quantity';
    },
  },
};
</script>
