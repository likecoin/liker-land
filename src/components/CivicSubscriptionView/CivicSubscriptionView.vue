<template>
  <BaseDialog
    :content-key="state"
    :is-show="true"
    :is-show-backdrop="isShowBackdrop || state === 'loading'"
    :is-animated="true"
    :is-backdrop-opaque="isPreview"
    :is-absolute="false"
    :content-container-class="[
      'shadow-none rounded-8 phone:rounded-none',
      { 'pointer-events-none select-none': !!isPreview },
    ]"
    @click-outside="onClickBackdrop"
  >
    <template
      v-if="!isPreview"
      #header
    >
      <div class="flex justify-between items-center mb-24 phone:px-16">
        <button
          class="flex items-center text-like-green"
          @click="onClickBackButton"
        >
          <svg
            class="w-12 h-12 mr-4 flex-no-shrink"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 8.7 16"
          >
            <path
              d="M0,7.9L0,7.9c0,0.4,0.1,0.7,0.3,0.9l6.2,6.7C6.9,16,7.8,16,8.3,15.6c0.5-0.5,0.6-1.3,0.1-1.8L3,7.9l5.4-5.8c0.5-0.5,0.4-1.3-0.1-1.8S7-0.1,6.5,0.4L0.3,7.1C0.1,7.2,0,7.5,0,7.9L0,7.9z"
              fill="currentColor"
            />
          </svg>
          <span class="whitespace-no-wrap">{{ $t('goBack') }}</span>
        </button>

        <Button
          v-if="state === 'new'"
          preset="primary-outline"
          :title="$t('civicLiker.about')"
          :to="{ name: 'civic' }"
        />
      </div>
    </template>

    <div
      v-if="isPreview && state !== 'loading'"
      class="phone:relative fixed pin-t pin-l pin-r z-10"
    >
      <div class="flex items-center bg-like-cyan-pale p-16 tablet:p-24 laptop:px-72 pointer-events-auto">
        <Button
          class="mr-8"
          preset="plain"
          :title="$t('goBack')"
          title-class="whitespace-no-wrap no-underline"
          @click="onClickBackButton"
        >
          <template #prepend>
            <svg
              class="w-12 h-12"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 8.7 16"
            >
              <path
                d="M0,7.9L0,7.9c0,0.4,0.1,0.7,0.3,0.9l6.2,6.7C6.9,16,7.8,16,8.3,15.6c0.5-0.5,0.6-1.3,0.1-1.8L3,7.9l5.4-5.8c0.5-0.5,0.4-1.3-0.1-1.8S7-0.1,6.5,0.4L0.3,7.1C0.1,7.2,0,7.5,0,7.9L0,7.9z"
                fill="currentColor"
              />
            </svg>
          </template>
        </Button>
        <div class="flex flex-wrap items-center text-12 border-l-1 border-gray-4a px-16 py-8">
          <EyeIcon class="w-16 text-like-green flex-no-shrink" />
          <span class="ml-4 mr-12 text-like-green flex-no-shrink">{{ $t('SettingsSupportPage.PitchPreview.Status') }}</span>
          <span class="phone:mt-4 phone:w-full">{{ $t('SettingsSupportPage.PitchPreview.Hint') }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="state === 'new'"
      key="new"
    >
      <div
        v-if="isClassic"
        class="pt-32"
      >
        <div
          class="mx-auto px-24 overflow-hidden"
          style="max-width: 370px; box-sizing: content-box"
        >
          <CivicLikerClassicGlobe class="w-full -mb-32" />
        </div>
        <hr class="my-0 h-8 bg-gray-f7">
        <div class="p-32 phone:px-16">
          <h2 class="text-center text-16 font-500">{{ $t('civic_liker_classic_new_header') }}</h2>
          <CivicLikerSupportAmountView
            class="my-24"
            :price="selectedQuantity * dollar"
            :currency="currency"
            :period="$t('SubscriptionPeriod.Month')"
            :is-classic="isClassic"
          />
          <p
            class="mt-24 font-500"
          >{{ $t('civic_liker_classic_new_description_title') }}</p>
          <p
            class="mt-8"
          >{{ $t('civic_liker_classic_new_description_content') }}</p>
          <Button
            class="mt-48"
            :title="$t('civic_liker_classic_new_button')"
            :full="true"
            size="large"
            @click="goToConfirm"
          />
        </div>
      </div>
      <div
        v-else
        class="p-32 phone:px-16"
      >
        <div class="mx-40 phone:mx-0">
          <CivicLikerPitchingView
            :creator-display-name="displayName"
            :creator-avatar-url="avatarUrl"
            :is-creator-civic-liker="isCivicLiker"
            :creator-pitch="pitch || $t('CreatorPitch.Default')"
            :supporter-avatar-url="getUserInfo && getUserInfo.avatar"
            :is-supporter-civic-liker="getUserIsCivicLiker"
          />
          <hr class="my-24 border-t-1 border-gray-d8">
          <div class="-m-8">
            <div class="text-16 text-center text-like-green font-600">
              {{ $t('UpdateSupportQuantity.Title') }}
            </div>
            <CivicQuantitySelect
              v-model="selectedQuantity"
              :currency="currency"
              :dollar="dollar"
            />
          </div>
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
              <img
                class="w-56"
                src="~/assets/images/civic-v2/support/support-group.png"
              >
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
              <img
                class="w-56"
                src="~/assets/images/civic-v2/support/follow-me.png"
              >
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
              <img
                class="w-56"
                src="~/assets/images/civic-v2/support/contribute.png"
              >
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
    </div>

    <div
      v-else-if="state === 'select-quantity'"
      key="select-quantity"
    >
      <div
        v-if="isClassic"
        class="pt-32"
      >
        <div
          class="mx-auto px-24 overflow-hidden"
          style="max-width: 370px; box-sizing: content-box"
        >
          <CivicLikerClassicGlobe class="w-full -mb-32" />
        </div>
        <hr class="my-0 h-8 bg-gray-f7">
        <div class="p-32 phone:px-16">
          <h2 class="text-center text-16 font-500">{{ $t('civic_liker_classic_new_header') }}</h2>
          <CivicLikerSupportAmountView
            class="my-24"
            :price="selectedQuantity * dollar"
            :currency="currency"
            :period="$t('SubscriptionPeriod.Month')"
            :is-classic="isClassic"
          />
          <p
            class="mt-24 font-500"
          >{{ $t('civic_liker_classic_new_description_title') }}</p>
          <p
            class="mt-8"
          >{{ $t('civic_liker_classic_new_description_content') }}</p>
          <Button
            class="mt-48 pointer-events-none relative"
            preset="secondary-outline"
            :title="$t('civic_liker_classic_active_button')"
            :full="true"
            size="large"
          >
            <template #prepend>
              <TickIcon class="absolute pin-l ml-8 w-24 h-24 text-success fill-current" />
            </template>
          </Button>
          <div
            v-if="isUserCurrentCivic && currentQuantity > 0 && !isCancelled"
            class="text-center mt-16"
          >
            <a
              class="text-12 text-gray-4a underline"
              href="#"
              @click.prevent="state = 'cancel'"
            >{{ $t('civic_liker_classic_cancel_button') }}</a>
          </div>
        </div>
      </div>
      <div
        v-else
        class="p-32 phone:px-16"
      >
        <div class="mt-16 px-40 phone:px-0">
          <Identity
            :avatar-url="avatarUrl"
            :avatar-size="64"
            :is-avatar-outlined="isCivicLiker"
          />

          <h2
            class="mt-12 text-24 text-like-green font-500 leading-1_5"
          >{{ $t('UpdateSupportQuantity.Title') }}</h2>

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
    </div>

    <div
      v-else-if="state === 'confirm'"
      key="confirm"
      class="p-32 phone:px-24"
    >
      <CivicLikerSupportAmountView
        :price="selectedQuantity * dollar"
        :currency="currency"
        :period="$t('SubscriptionPeriod.Month')"
        :prefix="priceEmoji"
        :is-classic="isClassic"
        @click-add="goToSelectQuantity"
      />

      <hr class="my-16 border-t-1 border-gray-d8">

      <CivicLikerClassicBanner
        v-if="isClassic"
        class="block mx-auto"
        style="width: 246px"
      />

      <CivicLikerPitchingView
        v-else
        class="my-24"
        :creator-display-name="displayName"
        :creator-avatar-url="avatarUrl"
        :is-creator-civic-liker="isCivicLiker"
        :creator-pitch="pitch || $t('CreatorPitch.Default')"
        :supporter-avatar-url="getUserInfo && getUserInfo.avatar"
        :is-supporter-civic-liker="getUserIsCivicLiker"
      />

      <hr class="my-16 border-t-1 border-gray-d8">

      <div class="mt-20 mx-40 phone:mx-0 text-14 text-gray-4a font-200">
        <h2 class="mb-16 text-16 font-500">{{ $t('SupportSummary.Title') }}</h2>

        <div class="flex justify-between py-12 border-t-1 border-gray-d8">
          <div>{{ $t('SupportSummary.NewCharge', { name: displayName }) }}</div>
          <div class="font-500 whitespace-no-wrap">{{ `${currency} ${selectedQuantity * dollar}` }}</div>
        </div>

        <div
          v-if="otherQuantity"
          class="flex justify-between py-12 border-t-1 border-gray-d8"
        >
          <div>{{ $t('SupportSummary.OtherCharge') }}</div>
          <div class="font-500 whitespace-no-wrap">{{ `${currency} ${otherQuantity * dollar}` }}</div>
        </div>

        <div class="flex justify-between py-12 border-t-1 border-gray-d8 text-16 font-500">
          <div>{{ $t('SupportSummary.Total') }}</div>
          <div
            :class="['whitespace-no-wrap', isClassic ? 'text-gray-4a' : 'text-like-green']"
          >{{ `${currency} ${(otherQuantity + selectedQuantity) * dollar}` }}</div>
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
      <div class="mx-24 phone:mx-0">
        <hr class="my-16 border-t-1 border-gray-d8">
        <CivicLikerClassicBanner
          v-if="isClassic"
          class="block mx-auto"
          style="width: 246px"
        />
        <CivicLikerSupportLikerView
          v-else
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
          :path="
            isClassic
              ? 'civic_liker_classic_cancel_description'
              : 'CancelSubscription.Description'
          "
          tag="p"
          :places="{ date: nextBillingDate }"
        >
          <span
            class="font-500 text-like-green"
            place="name"
          >{{ displayName }}</span>
        </i18n>

        <Button
          class="mt-32"
          :title="$t('CancelSubscription.Cancel')"
          :full="true"
          size="large"
          :to="{ name: 'civic-dashboard' }"
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
        :to="{ name: 'civic-dashboard' }"
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
        v-else-if="!isClassic && state === 'select-quantity' && isUserCurrentCivic && currentQuantity > 0 && !isCancelled"
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
import {
  CIVIC_LIKER_UNIT_PRICE,
  CIVIC_LIKER_CLASSIC_LIKER_ID,
} from '~/constant';

import BaseDialog from '~/components/BaseDialog';
import Button from '~/components/Button/Button';
import CivicLikerSupportAmountView from '~/components/CivicLikerSupportView/CivicLikerSupportAmountView';
import CivicLikerSupportLikerView from '~/components/CivicLikerSupportView/CivicLikerSupportLikerView';
import CivicLikerPitchingView from '~/components/CivicLikerPitchingView/CivicLikerPitchingView';
import CivicLikerClassicBanner from '~/components/CivicLikerClassicAssets/CivicLikerClassicBanner';
import CivicLikerClassicGlobe from '~/components/CivicLikerClassicAssets/CivicLikerClassicGlobe';
import CivicQuantitySelect from '~/components/CivicQuantitySelect/CivicQuantitySelect';
import CL1VsCL2Link from '~/components/CL1VsCL2Link';
import EyeIcon from '~/components/Icon/Eye';
import Identity from '~/components/Identity/Identity';
import SelectButton from '~/components/SelectButton/SelectButton';
import Spinner from '~/components/Spinner/Spinner';
import TickIcon from '~/assets/icons/tick.svg';

const STATES = ['new', 'select-quantity', 'confirm'];

export default {
  components: {
    AlertCircle: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/alert-circle.svg'),
    BaseDialog,
    BrokenHeart: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/images/civic-v2/broken-heart.svg'),
    Button,
    CivicLikerClassicBanner,
    CivicLikerClassicGlobe,
    CivicLikerSupportLikerView,
    CivicLikerSupportAmountView,
    CivicLikerPitchingView,
    CivicQuantitySelect,
    CL1VsCL2Link,
    Cross: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/cross.svg'),
    EyeIcon,
    Identity,
    SelectButton,
    Spinner,
    TickIcon,
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
    likerId: {
      type: String,
      default: '',
    },
    isPreview: {
      type: Boolean,
      default: false,
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
      pitch: '',
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getUserInfo',
      'getUserSubscriptionInfo',
      'getCivicSupportingUserInfo',
      'getUserIsCivicLiker',
      'getUserIsCivicLikerV2',
      'getUserShouldRenewCivic',
      'getUserInfoById',
    ]),
    dollar() {
      return CIVIC_LIKER_UNIT_PRICE;
    },
    currency() {
      return this.$t('Currency.USD');
    },
    authorId() {
      return this.likerId || this.$route.params.id;
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
    isClassic() {
      return this.authorId === CIVIC_LIKER_CLASSIC_LIKER_ID;
    },
    isUserCurrentCivic() {
      // allow old v1 user to renew to v2 by not treating shouldRenew(grace) user as current
      return this.getUserIsCivicLiker && !this.getUserShouldRenewCivic;
    },
    isUserCurrentCivicV1() {
      return this.isUserCurrentCivic && !this.getUserIsCivicLikerV2;
    },
    isConfirmButtonDisabled() {
      return !this.isPreview && (this.isSelf || this.isUserCurrentCivicV1);
    },
    confimrButtonDisabledHintI18nPath() {
      if (this.isPreview) return '';
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
      if (newState === state) return;
      if (state !== 'loading') {
        this.stateHistory.push(state);
      }
      this.state = newState;
      this.$emit('state-change', { state: newState });
    },

    async fetchLikerInfo() {
      try {
        if (
          this.authorId &&
          !this.isSelf &&
          (!this.getUserInfoById(this.authorId) ||
            !this.getUserInfoById(this.authorId).creatorPitch)
        ) {
          await this.fetchUserInfo({ id: this.authorId, types: ['creator'] });
        }
        const creatorData = this.isSelf
          ? this.getUserInfo
          : this.getUserInfoById(this.authorId) || {};
        this.displayName = creatorData.displayName;
        this.avatarUrl = creatorData.avatar;
        this.isCivicLiker =
          creatorData.isCivicLikerTrial || creatorData.isSubscribedCivicLiker;
        this.pitch = creatorData.creatorPitch;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },

    async fetchInfo() {
      const promises = [this.fetchLikerInfo()];
      if (!this.isPreview && this.isUserCurrentCivic) {
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
        // eslint-disable-next-line no-console
        console.error(err);
        this.$router.replace({ name: 'settings-civic' });
      }

      const supportingUserInfo = this.getCivicSupportingUserInfo(this.authorId);
      // Set default to  1 for new subscription
      let { quantity = 1 } = supportingUserInfo || {};
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
        if (this.isClassic) {
          if (supportingUserInfo && this.selectedQuantity > 0) {
            state = 'select-quantity';
          } else {
            state = 'new';
          }
        } else {
          state = 'confirm';
        }
      } else {
        state = 'new';
      }
      this.setState(state);
    },

    goToSelectQuantity(e) {
      this.$emit('select-quantity', e);
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

    goToConfirm(e) {
      this.$emit('go-to-confirm', e);
      if (this.getUserId) {
        this.setState('confirm');
      } else {
        this.$router.push({
          name: 'id-civic-register',
          params: {
            id: this.authorId,
          },
          query: {
            quantity: this.selectedQuantity,
            utm_source: this.$route.query.utm_source,
            utm_medium: this.$route.query.utm_medium,
          },
        });
      }
    },

    goToWelcomePage() {
      this.state = 'loading';
      if (this.isClassic) {
        this.$router.push({ name: 'civic-dashboard' });
      } else {
        this.$router.push({
          name: 'id',
          params: { id: this.authorId },
          query: { civic_welcome: '1' },
        });
      }
    },

    goBack() {
      if (this.stateHistory && this.stateHistory.length) {
        this.state = this.stateHistory.pop();
      } else if (this.currentQuantity > 0) {
        // Go back to settings for updating subscription
        this.$router.push({ name: 'civic-dashboard' });
      } else if (this.isClassic) {
        this.$router.push({ name: 'civic' });
      } else {
        // Go back to portfolio for new subscription
        this.$router.push({ name: 'id', params: { id: this.authorId } });
      }
    },

    onClickConfirmSubscriptionButton(e) {
      if (this.isUserCurrentCivicV1) {
        this.isShowUpgradeWarning = true;
      } else {
        this.confirmSubscription(e);
      }
    },

    confirmSubscription(e) {
      this.$emit('confirm-subscription', e);
      if (this.getUserIsCivicLikerV2 && this.getUserSubscriptionInfo) {
        if (this.currentQuantity !== this.selectedQuantity) {
          this.updateSubscription();
        } else {
          this.$router.push({ name: 'civic-dashboard' });
        }
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
      this.state = 'loading';
      await this.updateCivicSupportQuantity({
        user: this.authorId,
        quantity: this.selectedQuantity,
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

    onClickBackButton(e) {
      this.$emit('click-back-button', e);
      if (this.state === 'select-quantity') {
        this.selectedQuantity = this.prevSelectedQuantiy;
      }
      if (!this.isPreview) {
        this.goBack();
      }
    },

    onClickBackdrop(e) {
      this.$emit('click-backdrop', e);
      if (
        this.isShowBackdrop &&
        !this.isPreview &&
        this.state !== 'loading' &&
        this.isUserCurrentCivic
      ) {
        this.goBack();
      }
    },
  },
};
</script>
