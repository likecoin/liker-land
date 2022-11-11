<template>
  <div class="leading-1_5 text-gray-4a">
    <CivicLikerV3Header
      v-if="isSignedIn"
      :status="status"
      :avatar-src="avatarSrc"
      :active-since="formattedSince"
    />
    <section
      :class="[
        'mt-32 transition-opacity',
        { 'opacity-25': isFetching },
      ]"
    >
      <div class="overflow-hidden bg-white rounded-8">
        <header v-if="!isSignedIn">
          <img
            class="object-cover object-center w-full"
            src="~/assets/images/civic-v3/banner.png"
            :alt="$t('civic_dashboard_v3_intro_title')"
            style="height: 168px"
          >
        </header>
        <header
          v-else
          :class="[
            'flex',
            'flex-col',
            'items-center',
            'p-40',
            isActivating || isActive
              ? 'bg-like-gradient'
              : 'bg-like-cyan-pale',
          ]"
        >
          <i18n
            class="flex items-center text-like-green text-20 font-600 leading-2"
            :path="statusI18nKey"
          >
            <TickIcon place="tick" class="w-20 h-20 ml-8 fill-current" />
          </i18n>
          <i18n
            v-if="statusHintI18nKey"
            class="mt-4"
            :path="statusHintI18nKey"
            tag="p"
          >
            <a
              place="validator"
              class="underline text-like-green font-600"
              :href="stakingManagementUrl"
              target="_blank"
              rel="noopener"
            >{{
              stakingValidatorName
            }}</a>
            <i18n
              place="civicLiker"
              class="text-like-green font-600"
              tag="span"
              path="civicLiker"
            />
          </i18n>
        </header>

        <div class="py-32 px-52">

          <CivicLikerV3StepSection class="mt-[24px]" :step="1">
            <i18n path="civic_dashboard_v3_summary_liker_id_description">
              <i18n
                place="civicLiker"
                class="text-like-green font-600"
                tag="span"
                path="civicLiker"
              />
            </i18n>
            <div class="border border-shade-gray rounded-[8px] mx-auto mt-[24px] p-[12px] flex justify-center items-center">
              <i18n
                :class="[isUnregistered ? 'text-medium-gray' : 'text-like-green' ,'font-600']"
                tag="span"
                :path="isUnregistered
                  ? 'civic_dashboard_v3_summary_liker_id_unregistered'
                  : 'civic_dashboard_v3_summary_liker_id_registered'
                "
              />
              <TickIcon
                v-if="!isUnregistered"
                class="w-16 h-16 ml-8 fill-current text-success"
              />
            </div>
          </CivicLikerV3StepSection>

          <CivicLikerV3StepSection class="mt-[64px]" :step="2">
            <i18n :path="stakingHintI18nKey">
              <span
                class="text-like-green font-600"
                place="amount"
              >{{ formattedRemainingStakingAmount }} {{ stakingDenom }}</span>
              <i18n
                place="civicLiker"
                class="text-like-green font-600"
                tag="span"
                path="civicLiker"
              />
            </i18n>
            <div
              class="relative h-8 mt-16 overflow-hidden rounded-full bg-gray-c"
            >
              <div
                class="h-full bg-like-cyan"
                :style="`width: ${
                  Math.min(100, (stakingAmount / stakingAmountTarget) * 100)
                }%`"
              />
            </div>
            <div class="flex items-center mt-16 text-14 text-gray-9b">
              <TickIcon
                v-if="isActivating || isActive"
                class="w-16 h-16 mr-8 fill-current text-success"
              />
              <span>
                <span class="text-like-green">{{ formattedStakingAmount }}</span>
                / {{ formattedRequiredStakingAmount }} {{ stakingDenom }}
              </span>
            </div>
          </CivicLikerV3StepSection>

          <footer class="flex flex-col items-center mt-32">
            <ButtonV2
              v-if="!isSignedIn"
              :text="buttonTitle"
              preset="secondary"
              @click="$emit('sign-in')"
            >
              <template #prepend>
                <LoginIcon class="w-20 h-20" />
              </template>
            </ButtonV2>
            <ButtonV2
              v-else-if="isUnregistered"
              :text="$t('civic_dashboard_v3_summary_action_button_register')"
              preset="secondary"
              @click="$emit('register')"
            >
              <template #prepend>
                <LoginIcon class="w-20 h-20" />
              </template>
            </ButtonV2>
            <ButtonV2
              v-else
              :text="buttonTitle"
              :href="stakingManagementUrl"
              preset="outline"
              target="_blank"
              rel="noopener"
            >
              <template #prepend>
                <PlusIcon class="w-20 h-20" />
              </template>
            </ButtonV2>
          </footer>
        </div>
      </div>

      <i18n
        class="my-32 text-center text-14 font-200 leading-1_25"
        path="civic_dashboard_v3_summary_warning"
        tag="p"
      />
    </section>

    <section class="mt-[64px]">
      <i18n
        class="text-24 text-like-green"
        path="civic_dashboard_v3_intro_title"
        tag="h1"
      />
      <div class="p-32 mt-32 overflow-hidden bg-white rounded-8">
        <img
          loading="lazy"
          class="rounded-[8px]"
          src="/images/og/writing-nft.jpg"
          :alt="$t('civic_dashboard_v3_intro_title')"
        >
        <i18n
          class="mt-32"
          path="civic_dashboard_v3_intro_description"
          tag="p"
        />

        <div class="flex justify-center mt-[32px]">
          <ButtonV2
            :text="$t('about_nft_page_title')"
            preset="secondary"
            :to="{ name: 'campaign-writing-nft' }"
            @click.native="handleClickCTAButton"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import dateFormat from 'date-fns/format';

import { logTrackerEvent } from '~/util/EventLogger';

import LoginIcon from '~/assets/icons/login.svg?inline';
import PlusIcon from '~/assets/icons/plus.svg?inline';
import TickIcon from '~/assets/icons/tick.svg?inline';

import CivicLikerV3Header from './Header';

export default {
  name: 'PureCivicDashboardV3',
  components: {
    CivicLikerV3Header,
    LoginIcon,
    PlusIcon,
    TickIcon,
  },
  props: {
    status: {
      type: String,
      default: 'fetching',
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    avatarSrc: {
      type: String,
      default: '',
    },
    stakingValidatorName: {
      type: String,
      default: '',
    },
    stakingManagementUrl: {
      type: String,
      default: '',
    },
    stakingAmountTarget: {
      type: Number,
      default: 1,
    },
    stakingAmount: {
      type: Number,
      default: 0,
    },
    activeSince: {
      type: Date,
      default: () => new Date(),
    },
  },
  computed: {
    roundedRequiredStakingAmount() {
      return Math.ceil(this.stakingAmountTarget);
    },
    formattedRequiredStakingAmount() {
      return this.roundedRequiredStakingAmount.toLocaleString();
    },
    roundedStakingAmount() {
      return Math.floor(this.stakingAmount);
    },
    formattedStakingAmount() {
      return Math.floor(this.stakingAmount).toLocaleString();
    },
    formattedRemainingStakingAmount() {
      return (this.stakingStatus === 'fufilled'
        ? this.roundedStakingAmount
        : this.roundedRequiredStakingAmount - this.roundedStakingAmount
      ).toLocaleString();
    },
    stakingDenom() {
      return 'LIKE';
    },
    isFetching() {
      return this.status === 'fetching';
    },
    isUnregistered() {
      return this.status === 'unregistered';
    },
    isActivating() {
      return this.status === 'activating';
    },
    isActive() {
      return this.status === 'active';
    },
    statusI18nKey() {
      switch (this.status) {
        case 'active':
          return 'civic_dashboard_v3_summary_status_active';

        case 'activating':
          return 'civic_dashboard_v3_summary_status_activating';

        case 'unregistered':
          return 'civic_dashboard_v3_summary_status_unregistered';

        case 'inactive':
        default:
          return 'civic_dashboard_v3_summary_status_inactive';
      }
    },
    statusHintI18nKey() {
      switch (this.status) {
        case 'active':
          return '';

        case 'activating':
          return 'civic_dashboard_v3_summary_status_activating_hint';

        case 'unregistered':
          return 'civic_dashboard_v3_summary_status_unregistered_hint';

        case 'inactive':
        default:
          return 'civic_dashboard_v3_summary_status_inactive_hint';
      }
    },
    stakingStatus() {
      if (this.isSignedIn) {
        if (this.stakingAmount >= this.stakingAmountTarget) {
          return 'fufilled';
        }
        return 'unfufilled';
      }
      return 'none';
    },
    stakingHintI18nKey() {
      switch (this.stakingStatus) {
        case 'fufilled':
          return 'civic_dashboard_v3_summary_stake_hint_fufilled';
        case 'unfufilled':
          return 'civic_dashboard_v3_summary_stake_hint_unfufilled';
        case 'logout':
        default:
          return 'civic_dashboard_v3_summary_stake_hint_logout';
      }
    },
    actionButtonI18nKey() {
      switch (this.stakingStatus) {
        case 'fufilled':
          return 'civic_dashboard_v3_summary_action_button_connect_wallet';
        case 'unfufilled':
          return 'civic_dashboard_v3_summary_action_button_delegate';
        case 'logout':
        default:
          return 'civic_dashboard_v3_summary_action_button_manage';
      }
    },
    stakingStatusI18nKey() {
      switch (this.stakingStatus) {
        case 'fufilled':
          return 'civic_dashboard_v3_summary_stake_hint_fufilled';
        case 'unfufilled':
          return 'civic_dashboard_v3_summary_stake_hint_unfufilled';
        case 'logout':
        default:
          return 'civic_dashboard_v3_summary_stake_hint_logout';
      }
    },
    formattedSince() {
      return this.activeSince ? dateFormat(this.activeSince, 'YYYY/MM/DD') : '';
    },
    buttonTitle() {
      switch (this.stakingStatus) {
        case 'fufilled':
          return this.$t('civic_dashboard_v3_summary_action_button_manage');
        case 'unfufilled':
          return this.$t('civic_dashboard_v3_summary_action_button_delegate');
        case 'logout':
        default:
          return this.$t(
            'civic_dashboard_v3_summary_action_button_connect_wallet'
          );
      }
    },
  },
  methods: {
    handleClickCTAButton() {
      logTrackerEvent(this, 'NFT', 'NFTGoToCampaign', 'NFTGoToCampaign', 1);
    },
  },
};
</script>
