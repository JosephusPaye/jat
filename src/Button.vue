<template>
    <button
        class="button rounded font-semibold px-3 leading-none py-3 select-none"
        :class="{ 'is-selected': selected }"
        @click="$emit('click', $event)"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
      selected: Boolean
    }
};
</script>

<style lang="scss">
.color-scheme-dark .button {
  @apply text-white bg-gray-800;

  &:hover:not(:disabled) {
    @apply bg-gray-700;
  }

  &:active:not(:disabled) {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }

  &.is-selected:not(:disabled),
  &.is-selected:disabled {
    @apply bg-blue-600 text-white;
  }

  &:disabled {
    opacity: 0.6;
  }
}

.color-scheme-light .button {
  color: rgba(0,0,0,0.87);
  @apply bg-gray-300;

  &:hover:not(:disabled) {
    @apply bg-gray-400;
  }

  &:active:not(:disabled) {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.15);
  }

  &.is-selected:not(:disabled),
  &.is-selected:disabled {
    @apply bg-blue-600 text-white;
  }

  &:disabled {
    opacity: 0.6;
  }
}
</style>
