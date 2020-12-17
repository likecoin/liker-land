<template lang="pug">
  mixin StepNum(num)
    span.flex.justify-center.items-center.flex-no-shrink.w-40.h-40.mx-auto.bg-like-cyan-pale.rounded-full.leading-1(
      class="laptop:mr-16"
    )
      = num

  mixin StepBlock(num)
    li.items-start(class="laptop:flex")&attributes(attributes)
      +StepNum(num)
      .flex-grow.text-center(class="laptop:text-left")
        block

  mixin StepTitle
    h2.text-18.font-400
      block

  mixin StepDescription
    p.text-14.text-gray-9b
      block

  mixin FakeText
    .bg-gray-e6.rounded-full.h-16&attributes(attributes)

  mixin Avatar
    img.w-40.h-40.flex-no-shrink.rounded-full.border-gray-e6.border-1&attributes(attributes)

  section.py-32.px-16
    h1.text-30.text-center.text-like-green.font-500
      | {{ $t(`CreatorsPageV2.Setup.${likerId ? 'Registered' : 'Anonymous'}.Title`) }}
    .mt-40(class="laptop:flex")
      ol.flex-1.list-reset(class="laptop:mr-40")
        +StepBlock(1)(
          v-if="likerId"
          class="mt-40"
        )
          +StepTitle {{ $t('CreatorsPageV2.Setup.Registered.Steps[0].Title') }}
          +StepDescription {{ $t('CreatorsPageV2.Setup.Registered.Steps[0].Description') }}
          .mt-8.px-16.py-12.bg-gray-e6.text-18.text-gray-9b.rounded-12
            | {{ sponsorLink }}
          Button.block.mt-40.mx-auto.max-w-phone-min(
            v-clipboard:copy="sponsorLink"
            :title="$t('CreatorsPageV2.Setup.Registered.Steps[0].CTAButton')"
            size="large"
            :full="true"
          )

        template(v-else)
          +StepBlock(1)
            +StepTitle {{ $t('CreatorsPageV2.Setup.Anonymous.Steps[0].Title') }}
            +StepDescription {{ $t('CreatorsPageV2.Setup.Anonymous.Steps[0].Description') }}
            .mt-8.px-16.py-12.bg-gray-e6.text-18.text-gray-9b.rounded-12
              input.bg-transparent.outline-none.w-full(
                v-model="input"
                size="20"
                maxlength="20"
                autocomplete="false"
                :placeholder="$t('CreatorsPageV2.Setup.Anonymous.Steps[0].Placeholder')"
              )

          +StepBlock(2)(class="mt-40")
            +StepTitle {{ $t('CreatorsPageV2.Setup.Anonymous.Steps[1].Title') }}
            +StepDescription {{ $t('CreatorsPageV2.Setup.Anonymous.Steps[1].Description') }}
            .mt-8.px-16.py-12.bg-gray-e6.text-18.text-gray-9b.rounded-12.select-none
              | {{ sponsorLink }}
            Button.block.mt-40.mx-auto.max-w-phone-min(
            :title="$t('CreatorsPageV2.Setup.Anonymous.Steps[1].CTAButton')"
            :href="registerURL"
            size="large"
            :full="true"
          )

      .flex-1
        .bg-white.rounded-12.shadow-4.mt-40.px-40.pb-24.overflow-hidden(
          :class="{ 'laptop:mr-40 laptop:mt-0': true, 'select-none': !likerId }"
        )
          +FakeText(class="w-4/5 -mt-8")
          +FakeText(class="w-3/5 mt-20")
          +FakeText(class="mt-20")
          +FakeText(class="w-1/2 mt-20")
          p.mt-20.select-none {{ $t('CreatorsPageV2.Setup.Preview.LinkCFA') }}
          p.mt-4.underline(style="color:#0091ff") {{ sponsorLink }}
          .flex.items-center.mt-32.select-none
            +Avatar()(v-if="avatarUrl" :src="avatarUrl")
            +Avatar()(v-else src="./assets/avatar.png")
            span.ml-16.text-18 {{ normalizedName }}

        .mt-12.text-gray-9b.text-14.text-center
          | {{ $t('CreatorsPageV2.Setup.Preview.BottomHint') }}
</template>

<script>
import { getOAuthRegisterAPI } from '~/util/api';
import { getSponsorLink } from '~/util/civic';

import Button from '~/components/Button/Button';

export default {
  components: {
    Button,
  },
  props: {
    likerId: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      input: '',
    };
  },
  computed: {
    sponsorLink() {
      return getSponsorLink(this.likerId || this.input || '...');
    },
    normalizedName() {
      return (
        this.displayName ||
        this.input ||
        this.$t('CreatorsPageV2.Setup.Preview.DisplayNamePlaceholder')
      );
    },
    registerURL() {
      const { from, referrer } = this.$route.query;
      return getOAuthRegisterAPI(from, referrer);
    },
  },
};
</script>
