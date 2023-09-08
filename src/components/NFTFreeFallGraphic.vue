<template>
  <div class="relative">
    <svg
      v-if="isGradientPreset"
      class="absolute inset-0 blur-sm"
      viewBox="0 0 148 122"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <clipPath id="free-fall-portal-gradient">
          <ellipse cx="73.97" cy="108.88" rx="73.68" ry="11.76" fill="none" stroke-width="0"/>
        </clipPath>
      </defs>
      <g clip-path="url(#free-fall-portal-gradient)">
        <image width="500" height="333" transform="translate(-98.97 126.62) rotate(-90) scale(.11 .77)" xlink:href="~assets/images/index/gradient-1.jpg"/>
      </g>
    </svg>
    <svg
      class="relative w-full"
      viewBox="0 0 148 122"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <pattern
          id="free-fall-nft-image"
          patternContentUnits="objectBoundingBox"
          x="0"
          y="0"
          width="32"
          height="32"
          patternTransform="scale(0.042) rotate(-29.56) translate(-1350,500)"
        >
          <image :href="href" x="0" y="0" width="32" height="32" />
        </pattern>
        <mask id="free-fall-portal-mask" x="0" y="0" width="147.65" height="145" maskUnits="userSpaceOnUse">
          <path d="m147.64,104.24c0,6.49-32.99,11.76-73.68,11.76S.29,110.74.29,104.24-8.72,0,73.96,0c75.64,0,73.68,97.75,73.68,104.24Z" fill="#fff" />
        </mask>
        <linearGradient id="free-fall-stroke-linear-gradient-1" x1="122.75" y1="-993.45" x2="122.75" y2="-936.75" gradientTransform="translate(0 -904.04) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#e0b3af" stop-opacity=".1"/>
          <stop offset=".38" stop-color="#f266a0" stop-opacity=".5"/>
          <stop offset=".73" stop-color="#d65fec" stop-opacity=".8"/>
          <stop offset=".97" stop-color="#ad66ec"/>
        </linearGradient>
        <linearGradient id="free-fall-stroke-linear-gradient-2" x1="37.69" y1="-976.14" x2="37.69" y2="-928.42" xlink:href="#free-fall-stroke-linear-gradient-1" />
        <linearGradient id="free-fall-stroke-linear-gradient-3" x1="42.35" y1="-944.59" x2="42.35" y2="-913.37" xlink:href="#free-fall-stroke-linear-gradient-1" />
        <linearGradient id="free-fall-stroke-linear-gradient-4" x1="9.84" y1="-1048.14" x2="9.84" y2="-988.34" xlink:href="#free-fall-stroke-linear-gradient-1" />
        <linearGradient id="free-fall-stroke-linear-gradient-5" x1="128.46" y1="-1013.86" x2="128.46" y2="-962.06" xlink:href="#free-fall-stroke-linear-gradient-1" />
      </defs>
      <template v-if="isGradientPreset">
        <path d="m73.97,94.49c19.63,0,38.07,1.22,51.94,3.43,15.31,2.44,20.74,5.47,20.74,7.33s-5.43,4.88-20.74,7.33c-13.87,2.21-32.31,3.43-51.94,3.43s-38.07-1.22-51.94-3.43c-15.31-2.44-20.74-5.47-20.74-7.33s5.43-4.88,20.74-7.33c13.86-2.21,32.31-3.43,51.94-3.43m0-1C33.28,93.49.3,98.75.3,105.24s32.99,11.76,73.68,11.76,73.68-5.26,73.68-11.76-32.99-11.76-73.68-11.76h0Z" stroke-width="0" />
        <line fill="none" stroke="url(#free-fall-stroke-linear-gradient-1)" stroke-linecap="round" stroke-width="2" x1="122.75" y1="88.41" x2="122.75" y2="33.71" />
        <line fill="none" stroke="url(#free-fall-stroke-linear-gradient-2)" stroke-linecap="round" stroke-width="2" x1="37.69" y1="71.1" x2="37.69" y2="25.38" />
        <line fill="none" stroke="url(#free-fall-stroke-linear-gradient-3)" stroke-linecap="round" stroke-width="2" x1="42.35" y1="39.55" x2="42.35" y2="10.33" />
      </template>
      <path v-if="isPlainPreset" d="m73.97,116c40.69,0,73.68-5.26,73.68-11.76s-32.99-11.76-73.68-11.76S.3,97.75.3,104.24s32.99,11.76,73.68,11.76Z" fill="#ecfaaa" stroke-width="0" />
      <g mask="url(#free-fall-portal-mask)">
        <template v-if="isPlainPreset">
          <path fill="none" stroke="#aaf1e7" stroke-linecap="round" stroke-width="2" d="m42.35,10.28v29.32" />
          <path d="m73.97,120.64c40.69,0,73.68-5.26,73.68-11.76s-32.99-11.76-73.68-11.76S.3,102.39.3,108.88s32.99,11.76,73.68,11.76Z" fill="#50e3c2" stroke-width="0" />
        </template>
        <path d="m74.4,17.3l-53.13,30.13c-7.69,4.36-10.38,14.12-6.03,21.81l30.13,53.13c4.36,7.69,14.12,10.38,21.81,6.02l53.13-30.13c7.69-4.36,10.38-14.12,6.03-21.81l-30.13-53.13c-4.36-7.69-14.12-10.38-21.81-6.03Z" fill="#ececec" stroke-width="0" />
        <path d="M74.3982 17.2977L21.2706 47.4237C13.5839 51.7824 10.886 61.5473 15.2448 69.234L45.3708 122.362C49.7295 130.048 59.4943 132.746 67.1811 128.387L120.309 98.2614C127.995 93.9026 130.693 84.1378 126.335 76.4511L96.2085 23.3235C91.8498 15.6368 82.085 12.9389 74.3982 17.2977Z" fill="url(#free-fall-nft-image)" />
        <template v-if="isPlainPreset">
          <path d="m68.04,15.29L14.91,45.41c-7.45,4.22-10.06,13.68-5.84,21.13l30.13,53.13c4.22,7.45,13.68,10.06,21.13,5.84l53.13-30.13c7.45-4.22,10.06-13.68,5.84-21.13l-30.13-53.13c-4.22-7.45-13.68-10.06-21.13-5.84Z" fill="none" stroke="#ecfaaa" />
          <path fill="none" stroke="#aaf1e7" stroke-linecap="round" stroke-width="2" d="m9.87,85.68v58.32" />
          <path fill="none" stroke="#aaf1e7" stroke-linecap="round" stroke-width="2" d="m124.71,57.84v30.48" />
          <path fill="none" stroke="#aaf1e7" stroke-linecap="round" stroke-width="2" d="m130.51,78.72v30.48" />
          <path fill="none" stroke="#aaf1e7" stroke-linecap="round" stroke-width="2" d="m37.71,25.36v21.2" />
        </template>
        <path fill="none" stroke="#aaf1e7" stroke-linecap="round" stroke-width="2" d="m70.19,110.04v29.32" />
        <path fill="none" stroke="#aaf1e7" stroke-linecap="round" stroke-width="2" d="m74.83,101.92v29.32" />
        <line v-if="isGradientPreset" fill="none" stroke="url(#free-fall-stroke-linear-gradient-4)" stroke-linecap="round" stroke-width="2" x1="9.84" y1="143.1" x2="9.84" y2="85.3" />
      </g>
      <line v-if="isGradientPreset" fill="none" stroke="url(#free-fall-stroke-linear-gradient-5)" stroke-linecap="round" stroke-width="2" x1="128.46" y1="108.81" x2="128.46" y2="59.02" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      required: true,
    },
    preset: {
      type: String,
      default: 'plain',
    },
  },
  computed: {
    isPlainPreset() {
      return this.preset === 'plain';
    },
    isGradientPreset() {
      return this.preset === 'gradient';
    },
  },
};
</script>
