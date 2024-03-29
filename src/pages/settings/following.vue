<template>
  <AuthRequiredView
    class="flex flex-col"
    :login-label="$t('settings_following_login_label')"
    :login-button-label="$t('settings_following_login_in_button')"
  >
    <Label class="text-like-green" preset="h5" align="center">{{
      $t('settings_follow_title')
    }}</Label>

    <CardV2 class="my-[12px] text-center">
      <div v-if="walletIsFetchingFollowees">
        {{ $t('settings_follow_loading') }}
      </div>
      <div v-else-if="!walletFollowees.length">
        {{ $t('settings_follow_no_followee') }}
      </div>
      <div
        v-else-if="walletFollowees.length"
        class="flex flex-col gap-[4px] px-[16px] my-[6px]"
      >
        <div
          v-for="follower in populatedFollowees"
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
            :to="
              localeLocation({ name: 'id', params: { id: follower.wallet } })
            "
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
  </AuthRequiredView>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import alertMixin from '~/mixins/alert';
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  mixins: [alertMixin],
  data() {
    return {
      unfollowList: [],
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfoByAddress',
      'walletFollowees',
      'walletIsFetchingFollowees',
    ]),
    populatedFollowees() {
      return this.walletFollowees.map(follower => ({
        displayName:
          this.getUserInfoByAddress(follower)?.displayName || follower,
        wallet: follower,
        avatar: this.getUserInfoByAddress(follower)?.avatar,
      }));
    },
  },
  watch: {
    walletHasLoggedIn: {
      immediate: true,
      async handler(hasLoggedIn) {
        // Only fetch followees in client side
        if (process.client && hasLoggedIn) {
          try {
            await this.walletFetchFollowees();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this.alertPromptError(error.toString());
          }
        }
      },
    },
  },
  methods: {
    ...mapActions([
      'lazyGetUserInfoByAddresses',
      'walletFollowCreator',
      'walletUnfollowCreator',
    ]),
    async handleClickUnfollow(creator) {
      try {
        if (this.unfollowList.includes(creator)) {
          await this.walletFollowCreator(creator);
          const index = this.unfollowList.indexOf(creator);
          if (index !== -1) {
            this.unfollowList.splice(index, 1);
          }
        } else {
          await this.walletUnfollowCreator(creator);
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
