<template>
  <div
    v-if="isOpen"
    class="flex items-center p-[16px] pl-[24px] bg-like-gradient gap-[8px]"
  >

    <div class="flex flex-col desktop:flex-row flex-grow items-center desktop:justify-between gap-[16px]">

      <div class="text-center desktop:text-left"><slot /></div>

      <div
        v-if="primaryButtonText || secondaryButtonText"
        class="flex gap-[8px] flex-shrink-0"
      >
        <ButtonV2
          v-if="secondaryButtonText"
          preset="outline"
          :text="secondaryButtonText"
          :href="secondaryButtonHref"
          :to="secondaryButtonTo"
          @click.native="$emit('click-secondary-button', $event)"
        />
        <ButtonV2
          v-if="primaryButtonText"
          preset="secondary"
          :text="primaryButtonText"
          :href="primaryButtonHref"
          :to="primaryButtonTo"
          @click.native="$emit('click-primary-button', $event)"
        />
      </div>
    </div>

    <ButtonV2
      preset="plain"
      class="flex-shrink-0"
      size="mini"
      :circle="true"
      @click="handleClickCloseButton"
    >
      <LazyIconClose />
    </ButtonV2>

  </div>
</template>

<script>
export default {
  props: {
    primaryButtonText: {
      type: String,
      default: '',
    },
    primaryButtonHref: {
      type: String,
      default: '',
    },
    primaryButtonTo: {
      type: Object,
      default: undefined,
    },
    secondaryButtonText: {
      type: String,
      default: '',
    },
    secondaryButtonHref: {
      type: String,
      default: '',
    },
    secondaryButtonTo: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      isOpen: true,
    };
  },
  methods: {
    handleClickCloseButton(event) {
      this.isOpen = false;
      this.$emit('close', event);
    },
  },
};
</script>
