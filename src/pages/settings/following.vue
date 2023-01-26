<template>
  <div class="flex flex-col">
    <Label class="text-like-green" preset="h5" align="center">{{
      $t('settings_follow_title')
    }}</Label>

    <CardV2 class="my-[12px] text-center">
      <div v-if="isLoading">
        {{ $t('settings_follow_loading') }}
      </div>
      <div v-else-if="!getFollowers.length">
        {{ $t('settings_follow_no_follower') }}
      </div>
      <div
        v-else-if="getFollowers.length"
        class="flex flex-col gap-[4px] px-[16px] my-[6px]"
      >
        <div
          v-for="follower in populatedFollowings"
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

            'group',
          ]"
        >
          <NuxtLink
            class="flex items-center text-like-green"
            :to="`/${follower.wallet}`"
            target="_blank"
          >
            <Identity
              :avatar-url="follower.avatar"
              :avatar-size="32"
              :is-lazy-loaded="true"
            />
            <span class="ml-[8px] group-hover:underline">{{
              follower.displayName | ellipsis
            }}</span>
          </NuxtLink>
          <ButtonV2
            :preset="
              unfollowList.includes(follower.wallet) ? 'primary' : 'tertiary'
            "
            @click="() => handleClickUnfollow(follower.wallet)"
          >
            {{
              unfollowList.includes(follower.wallet)
                ? $t('settings_follow_follow')
                : $t('settings_follow_unfollow')
            }}
          </ButtonV2>
        </div>
      </div>
    </CardV2>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  mixins: [walletMixin, alertMixin],
  data() {
    return {
      isLoading: false,
      unfollowList: [],
    };
  },
  computed: {
    ...mapGetters(['getUserInfoByAddress']),
    populatedFollowings() {
      return this.getFollowers.map(follower => ({
        displayName:
          this.getUserInfoByAddress(follower)?.displayName || follower,
        wallet: follower,
        avatar: this.getUserInfoByAddress(follower)?.avatar,
      }));
    },
  },
  watch: {
    async getAddress() {
      if (this.getAddress) {
        await this.fetchFollowerList();
      } else {
        this.$router.push({ name: 'index' });
      }
    },
  },
  async mounted() {
    if (this.getAddress) {
      await this.fetchFollowerList();
    }
  },
  methods: {
    ...mapActions(['lazyGetUserInfoByAddresses']),
    async fetchFollowerList() {
      if (!this.walletHasLoggedIn) {
        await this.signLogin();
      }
      this.isLoading = true;
      await this.fetchFollowers(this.getAddress);
      this.isLoading = false;
    },
    async handleClickUnfollow(creator) {
      try {
        if (this.unfollowList.includes(creator)) {
          await this.followCreator({ wallet: this.getAddress, creator });
          const index = this.unfollowList.indexOf(creator);
          if (index !== -1) {
            this.unfollowList.splice(index, 1);
          }
        } else {
          await this.unfollowCreator({ wallet: this.getAddress, creator });
          this.unfollowList.push(creator);
        }
      } catch (error) {
        console.error(error);
        this.alertPromptError(error.toString());
      }
    },
  },
};
</script>
