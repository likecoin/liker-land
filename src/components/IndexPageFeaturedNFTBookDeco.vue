<template>
  <div>
    <div
      v-if="shape === 'star'"
      class="relative"
    >
      <svg class="blur-[10px]" width="116" height="122" viewBox="0 0 116 122" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="index-page-featured-nft-book-deco-star-gradient"
            x1="21.9018"
            y1="20.1549"
            x2="92.4041"
            y2="102.468"
            gradientUnits="userSpaceOnUse"
          >
            <template v-if="variant === 1">
              <stop offset="0.0942169" stop-color="#AAEAF9"/>
              <stop offset="0.292538" stop-color="#C9E96F"/>
              <stop offset="0.633899" stop-color="#DE5A1C"/>
              <stop offset="0.923537" stop-color="#DDA11C"/>
            </template>
            <template v-else>
              <stop offset="0.0942169" stop-color="#AAEAF9"/>
              <stop offset="0.292538" stop-color="#6FE9CB"/>
              <stop offset="0.633899" stop-color="#ECAF33"/>
              <stop offset="0.923537" stop-color="#208F2B"/>
            </template>
          </linearGradient>
        </defs>
        <path d="M41.3083 12.1091L46.9111 44.1431L32.0466 29.7671C30.4783 28.2496 28.0165 30.1708 29.1062 32.061L39.8558 50.7015L11.6755 41.4356C9.46488 40.7086 8.0829 43.7831 10.0959 44.9534L37.3205 60.789L19.318 65.6153C17.1286 66.2026 17.5323 69.4211 19.798 69.4507L38.8055 69.6992L13.7435 93.9791C12.1089 95.5615 14.2221 98.1251 16.0882 96.8235L43.262 77.8682L34.7866 100.295C33.9029 102.631 37.1595 104.232 38.4695 102.104L51.8009 80.467L56.9435 111.243C57.3147 113.464 60.5742 113.248 60.6476 110.998L61.7021 78.9834L87.5673 105.999C89.1483 107.651 91.7471 105.573 90.4851 103.667L70.2424 73.1054L91.7471 78.2564C93.9422 78.783 95.0715 75.7338 93.0641 74.702L73.0882 64.4423L105.056 51.883C107.19 51.0445 106.307 47.8444 104.045 48.2199L71.8516 53.553L83.7488 36.3566C85.0659 34.4523 82.5786 32.2374 80.8395 33.7648L67.3655 45.6013L76.3378 16.9933C77.0125 14.8434 73.9973 13.5687 72.9259 15.5506L57.5279 44.0231L45.2213 11.0461C44.356 8.72683 40.882 9.6698 41.3083 12.1091Z" fill="url(#index-page-featured-nft-book-deco-star-gradient)"/>
      </svg>
      <svg class="absolute inset-0" width="116" height="122" viewBox="0 0 116 122" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.1892 8.79756L42.7919 40.8316L27.9275 26.4556C26.3592 24.9381 23.8973 26.8593 24.9871 28.7495L35.7366 47.39L7.55634 38.1241C5.34574 37.3971 3.96376 40.4716 5.97673 41.6418L33.2013 57.4775L15.1989 62.3038C13.0094 62.891 13.4132 66.1095 15.6788 66.1392L34.6864 66.3876L9.62437 90.6676C7.98971 92.25 10.1029 94.8135 11.9691 93.512L39.1429 74.5567L30.6675 96.9832C29.7838 99.3194 33.0404 100.92 34.3504 98.7929L47.6818 77.1555L52.8243 107.932C53.1956 110.152 56.455 109.936 56.5284 107.686L57.5829 75.6719L83.4481 102.688C85.0291 104.339 87.6279 102.261 86.366 100.356L66.1233 69.7939L87.6279 74.9449C89.823 75.4714 90.9523 72.4223 88.945 71.3904L68.9691 61.1307L100.937 48.5715C103.071 47.733 102.187 44.5329 99.926 44.9083L67.7325 50.2415L79.6297 33.045C80.9467 31.1408 78.4594 28.9259 76.7203 30.4533L63.2464 42.2898L72.2186 13.6818C72.8934 11.5319 69.8782 10.2572 68.8068 12.2391L53.4087 40.7116L41.1022 7.73461C40.2369 5.41531 36.7629 6.35827 37.1892 8.79756Z" stroke="black" stroke-miterlimit="10"/>
      </svg>
    </div>
    <div
      v-else
      class="relative"
    >
      <svg class="blur-[10px]" width="69" height="70" viewBox="0 0 69 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="35.5037" cy="36.3044" rx="33.4958" ry="33.4958" fill="url(#index-page-featured-nft-book-deco-circle-gradient)"/>
        <defs>
          <linearGradient
            id="index-page-featured-nft-book-deco-circle-gradient"
            x1="10.8219"
            y1="9.59259"
            x2="56.1464"
            y2="65.7408"
            gradientUnits="userSpaceOnUse"
          >
            <template v-if="variant === 1">
              <stop offset="0.0942169" stop-color="#E28BCB"/>
              <stop offset="0.292538" stop-color="#F093BC"/>
              <stop offset="0.633899" stop-color="#FBA4B3"/>
              <stop offset="0.923537" stop-color="#F9B5B6"/>
            </template>
            <template v-else>
              <stop offset="0.0942169" stop-color="#8F7FCD"/>
              <stop offset="0.292538" stop-color="#B596CC"/>
              <stop offset="0.633899" stop-color="#E0A5A6"/>
              <stop offset="0.923537" stop-color="#FEBCA0"/>
            </template>
          </linearGradient>
        </defs>
      </svg>
      <svg class="absolute inset-0" width="69" height="70" viewBox="0 0 69 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M59.7925 30.9451C59.7925 47.3183 46.5194 60.5914 30.1463 60.5914C13.7731 60.5914 0.5 47.3183 0.5 30.9451C0.5 14.5719 13.7731 1.29883 30.1463 1.29883C46.5194 1.29883 59.7925 14.5719 59.7925 30.9451Z" stroke="black"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPageFeaturedNFTBookDeco',
  props: {
    shape: {
      type: String,
      default: 'star',
    },
    variant: {
      type: Number,
      default: 1,
    },
  },
};
</script>
