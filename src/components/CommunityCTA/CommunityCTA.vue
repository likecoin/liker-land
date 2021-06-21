<template>
  <div>
    <div class="text-center">{{ $t('community_cta_title') }}</div>
    <div class="flex justify-between mt-12">
      <CommunityLink href="https://discord.gg/W4DQ6peZZZ">
        <DiscordIcon />
      </CommunityLink>
      <CommunityLink href="https://github.com/likecoin">
        <GitHubIcon />
      </CommunityLink>
      <CommunityLink href="https://medium.com/likecoin">
        <MediumIcon />
      </CommunityLink>
      <CommunityLink href="https://twitter.com/@likecoin">
        <TwitterIcon />
      </CommunityLink>
    </div>
  </div>
</template>

<script>
import CommunityLink from './CommunityLink';

import DiscordIcon from './icons/discord.svg';
import GitHubIcon from './icons/github.svg';
import MediumIcon from './icons/medium.svg';
import TwitterIcon from './icons/twitter.svg';

export default {
  components: {
    CommunityLink,
    DiscordIcon,
    GitHubIcon,
    MediumIcon,
    TwitterIcon,
  },
  props: {
    linkClass: {
      type: String,
      default: '',
    },
  },
};
</script>
