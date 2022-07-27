<template>
  <svg
    :width="measurement.width"
    :height="measurement.height"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath :id="clipPathID">
        <rect
          :width="measurement.width"
          :height="measurement.height"
          :rx="rx"
        />
      </clipPath>
    </defs>
    <rect v-bind="progressContainer" />
    <g :clip-path="`url(#${clipPathID})`">
      <rect v-bind="progressProps">
        <template v-if="isIntermediate">
          <animate v-bind="animatedProps[0].animate" />
          <animateTransform v-bind="animatedProps[0].transform" />
        </template>
      </rect>
      <rect
        v-if="isIntermediate"
        v-bind="progressProps"
      >
        <animate v-bind="animatedProps[1].animate" />
        <animateTransform v-bind="animatedProps[1].transform" />
      </rect>
    </g>
  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { v4 as uuidv4 } from 'uuid';

export enum ProgressIndicatorType {
  Determine = 'determine',
  Intermediate = 'intermediate',
}

export enum ProgressIndicatorPreset {
  Default = 'default',
  Thin = 'thin',
}

@Component
export default class ProgressIndicator extends Vue {
  /**
   * Use for different operations
   */
  @Prop({ default: ProgressIndicatorType.Intermediate })
  readonly type!: ProgressIndicatorType;

  /**
   * Define the progress in determine type. Range is 0 - 100.
   */
  @Prop({ default: 0 })
  readonly value!: number;

  /**
   * The preset of progress, options: thin and default.
   */
  @Prop({ default: ProgressIndicatorPreset.Default })
  readonly preset!: ProgressIndicatorPreset;

  uid = uuidv4();

  // eslint-disable-next-line class-methods-use-this
  get measurement() {
    return {
      width: 154,
      height: this.preset === ProgressIndicatorPreset.Thin ? 4 : 16,
      progress: {
        maxWidth: 100,
        minWidth: 40,
        offset: 40,
      },
    };
  }

  get viewBox() {
    return `0 0 ${this.measurement.width} ${this.measurement.height}`;
  }

  get rx() {
    return this.measurement.height / 2;
  }

  get animatedProps() {
    const { width, height, progress } = this.measurement;
    return [
      {
        animate: {
          attributeName: 'width',
          values: `${progress.maxWidth};${progress.minWidth}`,
          dur: '2s',
          repeatCount: 'indefinite',
        },
        transform: {
          attributeName: 'transform',
          attributeType: 'XML',
          type: 'translate',
          values: `-${progress.maxWidth} 0;${width + height} 0`,
          dur: '1s',
          repeatCount: 'indefinite',
        },
      },
      {
        animate: {
          attributeName: 'width',
          values: `${progress.maxWidth + progress.offset};${progress.minWidth +
            progress.offset}`,
          dur: '4s',
          repeatCount: 'indefinite',
        },
        transform: {
          attributeName: 'transform',
          attributeType: 'XML',
          type: 'translate',
          values: `-${progress.maxWidth + progress.offset} 0;${width * 2} 0`,
          dur: '2s',
          repeatCount: 'indefinite',
        },
      },
    ];
  }

  get clipPathID() {
    return `progress-indicator-${this.uid}`;
  }

  get isIntermediate() {
    return this.type === ProgressIndicatorType.Intermediate;
  }

  get normalizedProgress() {
    return Math.max(0, Math.min(100, this.value)) / 100;
  }

  get progressWidth() {
    return (
      this.normalizedProgress * this.measurement.width + this.measurement.height
    );
  }

  get progressProps() {
    return {
      class: ['text-like-cyan', 'fill-like-cyan'],
      x: -this.measurement.height,
      width: this.progressWidth,
      height: this.measurement.height,
      rx: this.rx,
    };
  }

  get progressContainer() {
    return {
      class: [
        'text-like-cyan-light',
        { 'text-shade-gray': this.preset === ProgressIndicatorPreset.Thin },
        'fill-like-cyan-light',
      ],
      width: this.measurement.width,
      height: this.measurement.height,
      rx: this.rx,
    };
  }
}
</script>
