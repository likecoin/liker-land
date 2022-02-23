<template>
  <section class="relative">
    <svg
      class="block overflow-hidden border-2 rounded-14"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 528 180"
      :style="`border-color: ${isInactive || isFetching ? '#ebebeb' : '#e3ccaf'}`"
    >
      <defs>
        <linearGradient
          id="civic-liker-v3-header-gradient"
          x1="301.32"
          y1="91.36"
          x2="229.84"
          y2="92.59"
          gradientTransform="matrix(1, 0, 0, -1, 0, 182)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#f0e6b4" />
          <stop offset="1" stop-color="#d2f0f0" />
        </linearGradient>
        <clipPath id="civic-liker-v3-header-bg-clip">
          <rect
            x="1"
            y="1"
            width="526"
            height="178"
            rx="15"
          />
        </clipPath>
        <clipPath id="civic-liker-v3-header-avatar-clip">
          <circle
            cx="264"
            cy="90"
            r="42"
          />
        </clipPath>
      </defs>
      <rect
        x="1"
        y="1"
        width="526"
        height="178"
        fill="#fff"
      />
      <transition name="fade">
        <image
          v-if="isFetching"
          key="fetching"
          v-bind="bgImageProps"
          xlink:href="~assets/images/civic-v3/fetching.png"
        />
        <image
          v-else-if="isInactive"
          key="inactive"
          v-bind="bgImageProps"
          xlink:href="~assets/images/civic-v3/inactive.png"
        />
        <image
          v-else-if="isActivating"
          key="activating"
          v-bind="bgImageProps"
          xlink:href="~assets/images/civic-v3/activating.png"
        />
        <image
          v-else-if="isActive"
          key="fetching"
          v-bind="bgImageProps"
          xlink:href="~assets/images/civic-v3/active.png"
        />
      </transition>
      <!-- <path
        d="M264,40h0a50,50,0,0,1,50,50h0a50,50,0,0,1-50,50h0a50,50,0,0,1-50-50h0A50,50,0,0,1,264,40Z"
        fill="#fff"
      /> -->
      <circle
        v-if="isActive"
        cx="264"
        cy="90"
        r="50"
        fill="#fff"
      />
      <circle
        v-else
        cx="264"
        cy="90"
        r="42"
        fill="#fff"
      />
      <image
        v-if="!isFetching"
        x="222"
        y="48"
        width="84"
        height="84"
        rx="42"
        clip-path="url(#civic-liker-v3-header-avatar-clip)"
        :xlink:href="avatarSrc"
      />
      <template v-if="isActive">
        <circle
          cx="264"
          cy="90"
          r="50"
          fill="none"
          stroke="#50e3c2"
          stroke-width="3"
        />
        <circle
          cx="264"
          cy="90"
          r="42"
          fill="none"
          stroke-width="4"
          stroke="url(#civic-liker-v3-header-gradient)"
        />
      </template>
      <circle
        v-else
        cx="264"
        cy="90"
        r="42"
        fill="none"
        stroke-width="4"
        stroke="#ebebeb"
      />
    </svg>
    <i18n
      v-if="activeSince"
      class="mt-8 text-center text-10 text-gray-9b"
      path="civic_dashboard_v3_summary_since"
      tag="div"
    >
      <span place="date">{{ formattedSince }}</span>
    </i18n>
    <div v-if="isFetching" class="absolute flex items-center justify-center pin">
      <Spinner />
    </div>
  </section>
</template>

<script>
import Spinner from '../Spinner/Spinner.vue';

export default {
  name: 'CivicLikerV3Header',
  components: {
    Spinner,
  },
  props: {
    status: {
      type: String,
      required: true,
    },
    avatarSrc: {
      type: String,
      default: '',
    },
    activeSince: {
      type: String,
      default: '',
    },
  },
  computed: {
    isFetching() {
      return this.status === 'fetching';
    },
    isInactive() {
      return this.status === 'inactive';
    },
    isActivating() {
      return this.status === 'activating';
    },
    isActive() {
      return this.status === 'active';
    },
    bgImageProps() {
      return {
        width: '528',
        height: '180',
        preserveAspectRatio: 'xMidYMid slice',
      };
    },
  },
};
</script>
