<template>
  <div class="flex flex-col">
    <div class="flex justify-center">
      <Label class="w-min text-like-green" preset="h5">{{
        $t('settings_follow_title')
      }}</Label>
    </div>

    <CardV2 class="my-[12px] text-center">
      <div v-if="followers === null">{{ $t('settings_follow_loading') }}</div>
      <div v-else-if="followers === 0">
        {{ $t('settings_follow_noFollower') }}
      </div>
      <div
        v-else-if="followers.length"
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
import nftMixin from '~/mixins/nft';
import alertMixin from '~/mixins/alert';
import { EXTERNAL_HOST } from '~/constant';
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  mixins: [nftMixin, alertMixin],
  data() {
    return {
      followers: null,
      unfollowList: [],
    };
  },
  computed: {
    ...mapGetters(['getAddress', 'walletHasLoggedIn']),
    populatedFollowings() {
      let lis;
      if (this.followers) {
        lis = this.followers.map(follower => ({
          displayName:
            this.getUserInfoByAddress(follower)?.displayName || follower,
          wallet: follower,
          avatar: this.getUserInfoByAddress(follower)?.avatar,
        }));
      }
      return lis;
    },
  },
  watch: {
    async getAddress(address) {
      if (address) {
        await this.getFollowers(address);
      }
    },
  },
  async mounted() {
    if (this.getAddress) {
      await this.getFollowers(this.getAddress);
    }
  },
  methods: {
    ...mapActions(['signLogin', 'fetchUserInfoByAddress']),
    handleClickIdentity(wallet) {
      window.open(`${EXTERNAL_HOST}/${wallet}`);
    },
    async getFollowers(wallet) {
      if (!this.walletHasLoggedIn) {
        await this.signLogin();
      }
      const { followers } = await this.$axios.$get(
        `/api/v2/users/${wallet}/followers`
      );
      this.followers = followers;
      if (followers.length) {
        this.updateDisplayNameList(followers);
      } else {
        this.followers = 0;
      }
    },

    async handleClickUnfollow(creator) {
      try {
        if (this.unfollowList.includes(creator)) {
          await this.$axios.$post(
            `/api/v2/users/${this.getAddress}/followers?creator=${creator}`
          );
          const index = this.unfollowList.indexOf(creator);
          if (index !== -1) {
            this.unfollowList.splice(index, 1);
          }
        } else {
          await this.$axios.$delete(
            `/api/v2/users/${this.getAddress}/followers?creator=${creator}`
          );
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
