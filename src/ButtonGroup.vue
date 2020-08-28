<template>
  <div class="button-group flex">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ButtonGroup"
};
</script>

<style lang="scss">
.button-group {
  .button {
    @apply relative rounded-none border-r;
  }

  .button:focus {
    z-index: 1;
  }

  .button:first-child {
    @apply rounded-l;
  }

  .button:last-child,
  *:last-child .button {
    @apply rounded-l-none rounded-r border-r-0;
  }
}

.color-scheme-dark .button-group {
  .button {
    @apply border-gray-700;
  }
}

.color-scheme-light .button-group {
  .button {
    @apply border-gray-400;
  }
}
</style>
