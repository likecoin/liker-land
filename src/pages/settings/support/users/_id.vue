<template>
  <div class="fixed pin flex justify-center items-center">
    <div
      class="absolute pin bg-gray-9b opacity-75"
      @click="onClickBackdrop"
    />
    <div class="relative max-w-phone w-full">
      <div
        v-if="state === 'loading'"
        key="loading"
        class="author-follow-settings-list author-follow-settings-list--loading"
      />

      <div
        v-else-if="state === 'new'"
        class="bg-white rounded-8 px-72 py-48 phone:px-16"
      >
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
            @click="updateSubscription"
          />
        </div>

        <hr class="my-24 border-t-1 border-gray-d8">

        <ul class="m-0 p-0 list-style-none">
          <li class="flex items-center">
            <img class="w-80" src="~/assets/images/civic-v2/support/support-group.png">
            <div class="flex-grow ml-24">
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
            @click="updateSubscription"
          />
        </div>
      </div>

      <div
        v-else-if="state === 'select-quantity'"
        key="select-quantity"
      >
        <div class="bg-white rounded-8 px-72 py-32 phone:px-16">
          <Identity
            :avatar-url="avatarUrl"
            :avatar-size="64"
            :is-avatar-outlined="isCivicLiker"
          />

          <h2
            class="mt-12 text-24 text-like-green font-500 leading-1_5"
          >{{ $t('UpdateSupportQuantity.Title', { name: displayName }) }}</h2>

          <div class="mx-24">
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
              :title="$t('UpdateSupportQuantity.Next')"
              :full="true"
              size="large"
              @click="state = 'confirm'"
            />
          </div>
        </div>

        <div class="text-center mt-16">
          <a
            class="text-12 text-gray-4a underline"
            href="#"
            @click.prevent="cancelSubscription"
          >{{ $t('UpdateSupportQuantity.Unsubscribe') }}</a>
        </div>
      </div>

      <div
        v-else-if="state === 'confirm'"
        key="confirm"
        class="bg-white rounded-8 mt-16 p-32 pb-48 phone:p-16"
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
          :avatar-url="avatarUrl"
          :display-name="displayName"
          :is-civic-liker="isCivicLiker"
          :subtitle="$t('SettingsSupportUsersPage.SloganConfirm')"
        />

        <hr class="my-16 border-t-1 border-gray-d8">

        <div class="mt-20 mx-40 phone:mx-8 text-14 text-gray-4a font-200">
          <h2 class="text-16 font-500">{{ $t('SupportSummary.Title') }}</h2>

          <div class="flex justify-between mt-16 py-12 border-t-1 border-gray-d8">
            <div>{{ $t('SupportSummary.CurrentCharge', { name: displayName }) }}</div>
            <div class="font-500 whitespace-no-wrap">{{ `${currency} ${currentQuantity * dollar}` }}</div>
          </div>

          <div
            v-if="selectedQuantity !== currentQuantity"
            class="flex justify-between py-12 border-t-1 border-gray-d8"
          >
            <div>{{ $t('SupportSummary.NewCharge', { name: displayName }) }}</div>
            <div class="font-500 whitespace-no-wrap">{{ `${currency} ${(selectedQuantity - currentQuantity) * dollar}` }}</div>
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
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import { getPriceEmoji } from '../../../../util/civic';

import Button from '~/components/Button/Button';
import CivicLikerSupportAmountView from '~/components/CivicLikerSupportView/CivicLikerSupportAmountView';
import CivicLikerSupportLikerView from '~/components/CivicLikerSupportView/CivicLikerSupportLikerView';
import Identity from '~/components/Identity/Identity';
import SelectButton from '~/components/SelectButton/SelectButton';

export default {
  components: {
    Button,
    CivicLikerSupportLikerView,
    CivicLikerSupportAmountView,
    Identity,
    SelectButton,
  },
  middleware: 'authenticated',
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
  },
  async mounted() {
    const promises = [];
    if (!this.getUserIsCivicLiker) {
      this.$router.replace({ name: 'settings-support' });
      return;
    }
    promises.push(this.fetchLikerInfo());
    if (!this.getCivicSupportingUserInfo(this.authorId)) {
      promises.push(this.fetchCivicSupportingUsers());
    }
    if (!this.getUserSubscriptionInfo) {
      promises.push(this.fetchUserSubscriptionInfo());
    }
    try {
      await Promise.all(promises);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      this.$router.replace({ name: 'settings-support' });
    }
    // Set default to  1 for new subscription
    const { quantity = 1 } =
      this.getCivicSupportingUserInfo(this.authorId) || {};
    this.selectedQuantity = quantity;
    this.state = this.currentQuantity > 0 ? 'select-quantity' : 'new';
  },
  methods: {
    ...mapActions([
      'fetchCivicSupportingUsers',
      'fetchUserInfo',
      'fetchUserSubscriptionInfo',
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

    async updateSubscription() {
      const { currentQuantity, selectedQuantity, authorId } = this;
      if (currentQuantity === selectedQuantity) return;
      this.state = 'loading';
      await this.updateCivicSupportQuantity({
        user: authorId,
        quantity: selectedQuantity,
      });
      await this.fetchUserSubscriptionInfo();
      this.$router.push({ name: 'settings-support' });
    },
    async cancelSubscription() {
      const { authorId } = this;
      if (!this.currentQuantity) return;
      this.state = 'loading';
      await this.removeCivicSupportUser(authorId);
      await this.fetchUserSubscriptionInfo();
      this.$router.push({ name: 'settings-support' });
    },

    onClickBackdrop() {
      if (this.state !== 'loading') {
        this.$router.back();
      }
    },

    onClickUpdateQuantity() {
      this.state = 'select-quantity';
    },
  },
};
</script>
