<template>
  <Portal v-if="isOpen" to="dialog">
    <div :class="rootClasses">
      <div
        :class="[
          'fixed',
          'inset-0',
          'bg-medium-gray',
          'bg-opacity-25',
          'backdrop-filter',
          'backdrop-blur-lg',
        ]"
        @click="handleBackdropClick"
      />
      <div :class="['fixed', 'top-[15vh]']">
        <ButtonV2
          v-if="hasCloseButton"
          :class="[
            'absolute',
            'z-1',
            'bottom-full',
            'mb-[8px]',
            'w-[48px]',
            'h-[48px]',
            'text-like-green',
            'bg-shade-gray',
            'shadow-lg',
          ]"
          preset="plain"
          :circle="true"
          @click="close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.8383 3.74744C15.2289 3.35691 15.862 3.35691 16.2525 3.74744C16.6431 4.13796 16.6431 4.77113 16.2525 5.16165L11.4142 10L16.2525 14.8383C16.6431 15.2289 16.6431 15.862 16.2525 16.2526C15.862 16.6431 15.2289 16.6431 14.8383 16.2526L9.99998 11.4142L5.16164 16.2526C4.77111 16.6431 4.13795 16.6431 3.74742 16.2526C3.3569 15.862 3.3569 15.2289 3.74742 14.8383L8.58577 10L3.74742 5.16165C3.3569 4.77113 3.3569 4.13796 3.74742 3.74744C4.13795 3.35691 4.77111 3.35691 5.16164 3.74744L9.99998 8.58578L14.8383 3.74744Z"
              fill="currentColor"
            />
          </svg>
        </ButtonV2>
        <div
          :class="[
            'relative',
            'max-h-[80vh]',
            'overflow-y-scroll',
            'scrollbar-custom',
            panelClass,
          ]"
        >
          <template v-if="isBasic">
            <Label
              class="font-bold text-like-green"
              tag="header"
              preset="h5"
              align="left"
              :text="headerText"
            >
              <template v-if="$slots['header-prepend']" #prepend>
                <slot name="header-prepend" />
              </template>
            </Label>
            <div class="mt-[24px]">
              <template v-if="text">{{ text }}</template>
              <slot v-else />
            </div>
          </template>
          <slot v-else />
        </div>
        <div
          v-if="$slots.footer"
          :class="[
            'absolute',
            'bottom-0',
            'w-full',
            'rounded-b-[24px]',
            'overflow-hidden',
          ]"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Portal>
</template>

<script lang="ts">
import { Vue, Component, Prop, ModelSync } from 'vue-property-decorator';

export enum DialogPreset {
  Basic = 'preset',
  Custom = 'custom',
}

@Component
export default class Dialog extends Vue {
  // Preset of the dialog.
  @Prop({ default: DialogPreset.Basic })
  readonly preset!: DialogPreset;

  // Vertically center the dialog.
  @Prop({ default: true })
  readonly isVerticallyCenter!: boolean;

  // Panel class.
  @Prop({ default: '' })
  readonly panelClass!: string;

  // Header text.
  @Prop({ default: '' })
  readonly headerText!: string;

  // Content text.
  @Prop({ default: '' })
  readonly text!: string;

  // Set to true to disable close by backdrop click
  @Prop({ default: false })
  readonly isDisabledBackdropClick!: boolean;

  // Set to false to hide the close button
  @Prop({ default: true })
  readonly hasCloseButton!: boolean;

  // Show/Hide dialog.
  @ModelSync('open', 'toggle', { type: Boolean, default: false })
  isOpen!: boolean;

  get isBasic() {
    return this.preset === DialogPreset.Basic;
  }

  get isCustom() {
    return this.preset === DialogPreset.Custom;
  }

  get rootClasses() {
    return [
      'absolute',
      'inset-x-0',
      'z-20',
      'top-0',
      'flex',
      'justify-center',
      'min-h-screen',
      'px-[8px]',
      'py-[80px]',
      this.isVerticallyCenter ? 'items-center' : 'pt-[100px]',
    ];
  }

  close() {
    this.$emit('close');
    this.isOpen = false;
  }

  handleBackdropClick() {
    if (!this.isDisabledBackdropClick) {
      this.close();
    }
  }
}
</script>
