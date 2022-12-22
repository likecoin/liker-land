<template>
  <CardV2
    class="w-full"
    :has-content-padding="true"
    :is-narrow="true"
  >
    <Label
      class="w-min font-600"
      :text="label"
      preset="h5"
      valign="middle"
      content-class="whitespace-nowrap text-like-green "
      prepend-class="text-like-green"
    />
    <div class="flex items-center mt-[12px]">
      <span v-for="user, i in userList" :key="user.id">
        <ToolTips @mouseenter.native.once="onHover(i)" :tool-tip-text="user.displayName">
          <LinkV2
            class="flex items-center gap-[8px]"
            @click.native.once="onClick(i)"
            :to="{
              name: 'id',
              params: { id: user.id }
            }"
          >
            <IdentityAvatar
              :url="user.avatar"
              :display-name="user.displayName"
              :size="36"
              :is-outlined="user.isCivicLiker"
              :is-lazy-loaded="true"
            />
          </LinkV2>
        </ToolTips>
      </span>
    </div>
  </CardV2>
</template>

<script>
import { ellipsis } from '~/util/ui';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'NFTPortfolioTopUsersList',
  filters: {
    ellipsis,
  },
  data() {
    return {
      isHoverTriggered: false,
      isClickTriggered: false,
    };
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    userList: {
      type: Array,
      required: true,
    },
  },
  watch: {
    type() {
      this.isHoverTriggered = false;
      this.isClickTriggered = false;
    },
  },
  methods: {
    onHover(i) {
      if (this.isHoverTriggered) return;
      this.isHoverTriggered = true;
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_top_${this.type}_hover`,
        i,
        1
      );
    },
    onClick(i) {
      if (this.isClickTriggered) return;
      this.isClickTriggered = true;
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_top_${this.type}_click`,
        i,
        1
      );
    },
  },
};
</script>
