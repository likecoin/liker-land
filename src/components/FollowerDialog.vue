<template>
  <Dialog
    :open="isOpenFollowersDialog"
    panel-container-class="phone:max-w-[520px] laptop:w-[520px]"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg"
    @close="$emit('close')"
  >
    <Label preset="h5" class="mt-[-24px] mb-[12px] text-like-green" :text="$t('portfolio_follower_title')" />
    <div v-if="!populatedFollowers.length" class="flex justify-center my-[48px]">
      <ProgressIndicator v-if="walletIsFetchingFollowers" />
      <Label
        v-else
        align="center"
        class="text-medium-gray"
        :text="$t('portfolio_follower_no_follower')"
      />
    </div>
    <div v-else class="flex flex-col mt-0">
      <div
        v-for="follower in populatedFollowers"
        :key="follower.wallet"
        :class="[
          'flex',
          'justify-between',
          'py-[6px]',
          'px-[8px]',
          'rounded-[8px]',

          'transition',
          'duration-75',
          'ease-in',
          'hover:bg-light-gray',
        ]"
      >
        <NuxtLink
          class="flex items-center text-like-green"
          :to="{ name: 'id', params: { id: follower.wallet } }"
          target="_blank"
        >
          <Identity
            :avatar-url="follower.avatar"
            :avatar-size="32"
            :is-lazy-loaded="true"
            :is-avatar-outlined="follower.isCivicLiker"
          />
          <span class="ml-[8px] group-hover:underline">{{
            follower.displayName | ellipsis
          }}</span>
        </NuxtLink>
      </div>
      <div class="flex flex-col items-center">
        <div class="h-[2px] w-[24px] bg-shade-gray my-[12px]" />
        <ButtonV2 size="mini" preset="tertiary" @click="$emit('on-export-followers')">
          <template #prepend>
            <IconShare />
          </template>
          {{ $t('portfolio_follower_export') }}
        </ButtonV2>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  props: {
    isOpenFollowersDialog: {
      type: Boolean,
      default: false,
    },
    walletIsFetchingFollowers: {
      type: Boolean,
      default: false,
    },
    populatedFollowers: {
      type: Array,
      default: undefined,
    },
  },
};
</script>
