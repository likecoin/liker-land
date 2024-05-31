<template>
  <Portal v-if="isOpen" to="dialog">
    <div class="fixed inset-0 z-[50] overflow-x-hidden overflow-y-auto">
      <div key="scrollableContent" :class="scrollableClasses">
        <div
          key="backdrop"
          :class="['fixed', 'inset-0']"
          @click="handleBackdropClick"
        />

        <div
          :class="[
            'relative',
            'w-full',
            'max-w-[1920px]',
            'mx-auto',
            'p-[12px]',
            panelContainerClass,
          ]"
        >
          <ButtonV2
            v-if="hasCloseButton"
            :class="[
              'absolute',
              'z-1',
              'bottom-full',
              'mb-[8px]',
              'ml-[16px] sm:ml-0',
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
          <slot name="prepend" />
          <component
            :is="panelComponent"
            :class="[
              'relative',
              'w-full',
              'mx-auto',
              'overflow-y-auto',
              'scrollbar-custom',
              panelClass,
            ]"
            :style="panelStyle"
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
          </component>
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
    </div>
  </Portal>
</template>

<script lang="ts">
import { Vue, Component, Prop, ModelSync } from 'vue-property-decorator';

// eslint-disable-next-line import/prefer-default-export
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

  // Panel container class.
  @Prop({ default: '' })
  readonly panelContainerClass!: string;

  // Panel class.
  @Prop({ default: '' })
  readonly panelClass!: string;

  // Panel style.
  @Prop({ default: '' })
  readonly panelStyle!: string;

  // Header text.
  @Prop({ default: '' })
  readonly headerText!: string;

  // Content text.
  @Prop({ default: '' })
  readonly text!: string;

  // Panel tag.
  @Prop({ default: 'div' })
  readonly panelComponent!: string;

  // Set to true to disable close by backdrop click
  @Prop({ default: false })
  readonly isDisabledBackdropClick!: boolean;

  // Set to false to hide the close button
  @Prop({ default: true })
  readonly hasCloseButton!: boolean;

  @Prop({ default: () => [] })
  readonly scrollableWrapperClasses!: any;

  // Show/Hide dialog.
  @ModelSync('open', 'toggle', { type: Boolean, default: false })
  isOpen!: boolean;

  get isBasic() {
    return this.preset === DialogPreset.Basic;
  }

  get isCustom() {
    return this.preset === DialogPreset.Custom;
  }

  get scrollableClasses() {
    return [
      'flex',
      'justify-center',
      'px-[8px]',
      'py-[80px]',
      'bg-medium-gray',
      'bg-opacity-25',
      'backdrop-filter',
      'backdrop-blur-lg',
      'min-h-screen',
      this.isVerticallyCenter ? 'items-center' : 'pt-[100px]',
      ...this.scrollableWrapperClasses,
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
