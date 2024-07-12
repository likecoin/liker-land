<template>
  <form
    class="flex flex-col sm:flex-row rounded-[14px] border-[2px] border-like-cyan-light overflow-hidden"
    @submit="handleSubmit"
  >
    <input
      type="email"
      :class="inputClasses"
      :placeholder="$t('substack_input_placeholder')"
    />
    <button
      type="submit"
      class="px-[16px] py-[12px] !bg-like-cyan-light text-like-green text-[16px] font-600 whitespace-nowrap hover:text-dark-gray duration-75"
      :disabled="isSubmitting"
    >
      {{ buttonText }}
    </button>
  </form>
</template>

<script>
import { postSubstackSubscribe } from '~/util/api';

const SUBSTACK_TYPES = {
  LikerLand: { name: 'LikerLand', domain: 'likerland.substack.com' },
  LikeCoin: { name: 'LikeCoin', domain: 'likecoin.substack.com' },
};

const PRESET = {
  DEFAULT: 'default',
  DARK: 'dark',
};
export default {
  props: {
    domainType: {
      type: String,
      default: SUBSTACK_TYPES.LIKERLAND.name,
    },
    // Input text color preset
    preset: {
      type: String,
      default: PRESET.DEFAULT,
    },
  },
  data() {
    return {
      isSubmitting: false,
      isSubmitted: false,
    };
  },
  computed: {
    buttonText() {
      if (this.isSubmitted) {
        return this.$t('substack_button_submitted');
      }
      return this.isSubmitting
        ? this.$t('substack_button_loading')
        : this.$t('substack_button_submit');
    },
    inputClasses() {
      return [
        'w-full',
        'min-w-[220px]',
        'px-[16px]',
        'py-[12px]',
        'bg-transparent',
        'text-[16px]',
        'outline-none',
        this.preset === 'dark' ? 'text-like-green' : 'text-like-cyan-light',
      ];
    },
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      this.isSubmitting = true;
      this.isSubmitted = false;
      const email = e.target[0].value;
      const { domain } = SUBSTACK_TYPES[this.domainType];
      try {
        await this.$api.post(postSubstackSubscribe(), {
          email,
          domain,
        });
        this.isSubmitted = true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
