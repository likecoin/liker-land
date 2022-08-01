<template>
  <div class="tooltip">
    <slot />
    <span class="tooltiptext">
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
  },
};
</script>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #9b9b9b;
  color: #fff;
  font-size: 8px;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;

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
