<template>
  <div class="leading-1_5 text-gray-4a">
    <section>
      <div class="overflow-hidden bg-white rounded-8">
        <header
          v-if="isSignedIn"
          :class="[
            'flex',
            'items-center',
            'p-40',
            isActivating || isActive
              ? 'bg-like-gradient'
              : 'bg-like-cyan-pale',
          ]"
        >
          <LcAvatar
            class="mr-24"
            :src="avatarSrc"
            size="88"
            :halo="isActivating || isActive ? 'civic-liker' : 'none'"
          />
          <div>
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
                rel="noreferrer noopener"
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
            <i18n
              v-if="isActivating || isActive"
              class="mt-10 text-10"
              path="civic_dashboard_v3_summary_since"
            >
              <span place="date">{{ formattedSince }}</span>
            </i18n>
          </div>
        </header>

        <div class="py-32 px-52">
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
                (stakingAmount / stakingAmountTarget) * 100
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

          <footer class="flex flex-col items-center mt-32">
            <Button
              :title="buttonTitle"
              :href="buttonHref"
              :preset="isActivating || isActive ? 'secondary-outline' : 'primary'"
              content-class="px-12"
              size="large"
              target="_blank"
              rel="noreferrer noopener"
            >
              <template #prepend>
                <LoginIcon v-if="!isSignedIn" class="w-20 h-20" />
                <PlusIcon v-else-if="!(isActivating || isActive)" class="w-20 h-20" />
              </template>
            </Button>
          </footer>
        </div>
      </div>

      <i18n
        class="my-32 text-center text-14 font-200 leading-1_25"
        path="civic_dashboard_v3_summary_warning"
        tag="p"
      />
    </section>

    <section class="mt-32">
      <i18n
        class="text-24 text-like-green"
        path="civic_dashboard_v3_intro_title"
        tag="h1"
      />
      <div class="p-32 mt-32 overflow-hidden bg-white rounded-8">
        <i18n
          class="mt-12 px"
          path="civic_dashboard_v3_intro_description"
          tag="p"
        />
      </div>
    </section>
  </div>
</template>

<script>
import dateFormat from 'date-fns/format';

import Button from '../Button/Button';

export default {
  name: 'PureCivicDashboardV3',
  components: {
    Button,
    LoginIcon: () =>
      import(/* webpackChunkName: "svg-app" */ '../../assets/icons/login.svg'),
    PlusIcon: () =>
      import(/* webpackChunkName: "svg-app" */ '../../assets/icons/plus.svg'),
    TickIcon: () =>
      import(/* webpackChunkName: "svg-app" */ '../../assets/icons/tick.svg'),
  },
  props: {
    status: {
      type: String,
      default: 'inactive',
    },
    signInUrl: {
      type: String,
      default: '',
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
    formattedRequiredStakingAmount() {
      return this.stakingAmountTarget.toLocaleString();
    },
    formattedStakingAmount() {
      return this.stakingAmount.toLocaleString();
    },
    formattedRemainingStakingAmount() {
      return (this.stakingStatus === 'fufilled'
        ? this.stakingAmountTarget
        : this.stakingAmountTarget - this.stakingAmount
      ).toLocaleString();
    },
    stakingDenom() {
      return '$LIKE';
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
          return 'civic_dashboard_v3_summary_action_button_sign_in';
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
          return this.$t('civic_dashboard_v3_summary_action_button_sign_in');
      }
    },
    buttonHref() {
      if (this.isSignedIn) {
        return this.stakingManagementUrl;
      }
      return this.signInUrl;
    },
  },
};
</script>
