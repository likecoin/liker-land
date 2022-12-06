<template>
  <div :class="{'tooltip':showToolTip}">
    <slot />
    <span v-if="showToolTip" class="tooltiptext">
      {{ toolTipText }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'ToolTips',
  props: {
    toolTipText: {
      type: String,
      default: undefined,
    },
    showToolTip: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
  z-index: 0;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  min-width: 120px;
  background-color: #9b9b9b;
  color: #fff;
  font-size: 8px;
  text-align: center;
  padding: 5px 6px;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

/* Tooltip arrow */
.tooltip .tooltiptext::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #9b9b9b transparent transparent transparent;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
