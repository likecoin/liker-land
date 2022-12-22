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
    <ul class="flex flex-row-reverse justify-end items-center mt-[18px] px-[4px]">
      <li
        v-for="user in users"
        :key="user.id"
        :class="[
          'bg-white rounded-full p-[2px] mx-[-8px] relative transition-all duration-300 ease-in-out group',
          user.index === 0 ? 'hover:mr-[10px]' : 'hover:mx-[10px]'
        ]"
      >
        <ToolTips
          :tool-tip-text="user.displayName"
          @mouseenter.native.once="onHover(user.index)"
        >
          <LinkV2
            :to="{
              name: 'id',
              params: { id: user.id }
            }"
            @click.native.once="onClick(user.index)"
          >
            <IdentityAvatar
              class="group-hover:scale-[1.2] transition-transform duration-300 ease-in-out"
              :url="user.avatar"
              :display-name="user.displayName"
              :size="36"
              :is-outlined="user.isCivicLiker"
              :is-outline-extruded="false"
              :is-lazy-loaded="true"
            />
          </LinkV2>
        </ToolTips>
      </li>
    </ul>
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
  data() {
    return {
      isHoverTriggered: false,
      isClickTriggered: false,
    };
  },
  computed: {
    users() {
      return this.userList.map((u, i) => ({ ...u, index: i })).reverse();
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
