<template lang="pug">
  mixin Separator
    hr.w-48.h-px.my-40.bg-gray-d8

  mixin QuantitySelect
    div&attributes(attributes)
      .bg-white.rounded-8.max-w-480.w-full.mx-auto.px-32.py-24.text-gray-4a.leading-1_5(class="phone:px-16 phone:rounded-none tablet:rounded-none")
        CivicQuantitySelect(v-model="quantity")
      Button.block.mt-16.mx-auto.p-0.max-w-phone-min(
        :title="$t('CLP.button.subscribe')"
        size="large"
        :full="true"
        @click="subscribe"
      )

  main.max-w-desktop.w-full.mx-auto.pb-72
    header.text-center
      .flex.justify-center.bg-contain.bg-center.bg-no-repeat.pb-24(:style="headerStyle")
        Identity(
          :avatar-url="creatorAvatarUrl"
          :avatar-size="100"
          :is-avatar-outlined="isCreatorCivicLiker"
        )
      .text-18 {{ $t('CLP.header.displayname') }}
      .mt-16.text-32.text-like-green.font-bold {{ creatorDisplayName }}

    +Separator

    section.mb-16
      +QuantitySelect

    +Separator

    section
      .max-w-phone.mx-auto.mt-16.px-24.text-center
        h1.text-30.text-like-green.font-500
          | {{ $t('CLP.contents.title') }}
        p.mt-24.leading-1_5 {{ $t('CLP.contents.description', { name: creatorDisplayName }) }}
      .mt-40.mx-40(class="phone:mx-16")
        SuperLikeContentGrid(
          :contents="contents"
          preset="work"
        )

      .text-center
        NuxtLink.text-gray-9b.underline(:to="{ name: 'id', params: { id: creatorId } }")
          | {{ $t('CLP.contents.more') }}

    +Separator

    EffectiveSection.mt-16
      template(#center)
        Identity.m-20(
          :avatar-url="creatorAvatarUrl"
          :avatar-size="100"
          :is-avatar-outlined="isCreatorCivicLiker"
        )

    +Separator

    BetterWorldSection(:creators="creators")

    +Separator

    footer(class="laptop:flex laptop:px-40")
      .flex-1.text-center
        .flex.justify-center.bg-contain.bg-center.bg-no-repeat.pb-24
          Identity(
            :avatar-url="creatorAvatarUrl"
            :avatar-size="100"
            :is-avatar-outlined="isCreatorCivicLiker"
          )
        .text-18 {{ $t('CLP.header.displayname') }}
        .mt-16.text-32.text-like-green.font-bold {{ creatorDisplayName }}
      +QuantitySelect()(class="flex-1 mt-24 laptop:mt-0")

</template>

<script>
import { getFetchUserSuperLikeAPI } from '~/util/api';

import Button from '../LegacyButton/Button';
import CivicQuantitySelect from '../CivicQuantitySelect/CivicQuantitySelect';
import Identity from '../Identity/Identity';

import BetterWorldSection from './sections/BetterWorldSection';
import EffectiveSection from './sections/EffectiveSection';
import SuperLikeContentGrid from '../SuperLikeContentGrid';

import headerBg from './assets/header-bg.png';

export default {
  name: 'CivicLikerPageWithCreator',
  components: {
    BetterWorldSection,
    Button,
    CivicQuantitySelect,
    EffectiveSection,
    Identity,
    SuperLikeContentGrid,
  },
  props: {
    creators: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      quantity: 1,
      contents: [],
    };
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${headerBg})`,
      };
    },
    creator() {
      return this.creators[0] || {};
    },
    creatorId() {
      return this.creator.user;
    },
    creatorDisplayName() {
      return this.creator.displayName;
    },
    creatorAvatarUrl() {
      return this.creator.avatar;
    },
    isCreatorCivicLiker() {
      return (
        this.creator.isSubscribedCivicLiker || this.creator.isCivicLikerTrial
      );
    },
  },
  mounted() {
    this.fetchContents();
  },
  methods: {
    async fetchContents() {
      const { list } = await this.$api.$get(
        getFetchUserSuperLikeAPI(this.creatorId),
        { params: { limit: 3, filter: 'self' } }
      );
      this.contents = list;
    },
    subscribe() {
      this.$emit('subscribe', { quantity: this.quantity });
    },
  },
};
</script>
