<template>
  <component
    :is="isCard ? 'CardV2' : 'div'"
    class="w-full"
    :has-content-padding="true"
    :is-narrow="true"
  >
    <slot name="prepend" />
    <ul class="flex flex-row-reverse justify-center items-center mt-[18px] px-[4px]">
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
            :to="localeLocation({
              name: 'id',
              params: { id: user.id },
              query: { tab: type === 'creator' ? 'created' : 'collected' },
            })"
            @click.native="onClick(user.index)"
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
    <slot name="append" />
  </component>
</template>

<script>
import { ellipsis } from '~/util/ui';

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
    isCard: {
      type: Boolean,
      default: true,
    },
    userList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    users() {
      return this.userList.map((u, i) => ({ ...u, index: i })).reverse();
    },
  },
  methods: {
    onHover(i) {
      this.$emit('hover', i);
    },
    onClick(i) {
      this.$emit('click', i);
    },
  },
};
</script>
