<template>
  <button
    class="close-button w-10 h-10 rounded-full inline-flex items-center justify-center"
    @click="$emit('click', $event)"
  >
    <CloseIcon class="m-0 theme:text-secondary" />
  </button>
</template>

<script>
import CloseIcon from "./icons/close.svg";

export default {
  name: "CloseButton",

  components: { CloseIcon }
};
</script>

<style lang="scss">
.color-scheme-dark .close-button {
  &:hover,
  &:focus {
    @apply bg-gray-800;

    svg {
      @apply text-white;
    }
  }
}

.color-scheme-light .close-button {
  &:hover,
  &:focus {
    @apply bg-gray-300;

    svg {
      @apply text-black;
    }
  }
}
</style>
