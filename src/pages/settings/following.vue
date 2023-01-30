<template>
  <div v-if="walletHasLoggedIn" class="flex flex-col">
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
  <div v-else class="flex flex-col justify-center flex-grow">
    <Label class="text-medium-gray" align="center" :text="$t('settings_following_login_in_label')" />
    <div class="flex justify-center mt-[24px]">
      <ProgressIndicator v-if="walletIsLoggingIn" />
      <ButtonV2
        v-else
        :text="$t('settings_following_login_in_button')"
        preset="secondary"
        @click="connectWallet"
      />
    </div>
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
    populatedFollowers() {
      return this.getFollowers.map(follower => ({
        displayName:
          this.getUserInfoByAddress(follower)?.displayName || follower,
        wallet: follower,
        avatar: this.getUserInfoByAddress(follower)?.avatar,
      }));
    },
  },
  watch: {
    walletHasLoggedIn() {
      if (this.walletHasLoggedIn) {
        this.fetchFollowerList();
      }
    },
  },
  async mounted() {
    if (this.walletHasLoggedIn) {
      await this.fetchFollowerList();
    }
  },
  methods: {
    ...mapActions([
      'lazyGetUserInfoByAddresses',
      'walletCreatorFollow',
      'walletCreatorUnfollow',
    ]),
    async fetchFollowerList() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      await this.fetchFollowers(this.loginAddress);
      this.isLoading = false;
    },
    async handleClickUnfollow(creator) {
      try {
        if (this.unfollowList.includes(creator)) {
          await this.walletCreatorFollow(creator);
          const index = this.unfollowList.indexOf(creator);
          if (index !== -1) {
            this.unfollowList.splice(index, 1);
          }
        } else {
          await this.walletCreatorUnfollow(creator);
          this.unfollowList.push(creator);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.alertPromptError(error.toString());
      }
    },
  },
};
</script>
