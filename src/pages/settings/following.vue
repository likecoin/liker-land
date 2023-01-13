<template>
  <div class="flex flex-col">
    <div class="flex justify-center">
      <Label class="w-min text-like-green" preset="h5">{{
        $t('settings_follow_title')
      }}</Label>
    </div>

    <CardV2 class="my-[12px] text-center">
      <div v-if="getFollowers === null">
        {{ $t('settings_follow_noFollower') }}
      </div>
      <div
        v-else-if="getFollowers && getFollowers.length"
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
import wallet from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';
import { EXTERNAL_HOST } from '~/constant';
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  mixins: [wallet, alertMixin],
  data() {
    return {
      unfollowList: [],
    };
  },
  computed: {
    ...mapGetters(['getAddress', 'walletHasLoggedIn', 'getUserInfoByAddress']),
    populatedFollowings() {
      let lis;
      if (this.getFollowers) {
        lis = this.getFollowers.map(follower => ({
          displayName:
            this.getUserInfoByAddress(follower)?.displayName || follower,
          wallet: follower,
          avatar: this.getUserInfoByAddress(follower)?.avatar,
        }));
      }
      return lis;
    },
  },
  async mounted() {
    if (this.getAddress) {
      await this.fetchFollowers(this.getAddress);
    }
  },
  methods: {
    ...mapActions(['signLogin', 'updateDisplayNameList']),
    handleClickIdentity(wallet) {
      window.open(`${EXTERNAL_HOST}/${wallet}`);
    },
    async handleClickUnfollow(creator) {
      try {
        if (this.unfollowList.includes(creator)) {
          if (!this.walletHasLoggedIn) {
            await this.signLogin();
          }
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
