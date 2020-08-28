<template>
    <button
        class="button rounded px-3 leading-none py-3"
        @click="$emit('click', $event)"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
};
</script>

<style lang="scss">
.color-scheme-dark .button {
  @apply text-white bg-gray-800;

  &:hover {
    @apply bg-gray-700;
  }

  &:active {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>
