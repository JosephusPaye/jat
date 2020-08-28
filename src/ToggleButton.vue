<template>
  <button
    :class="[value === id ? 'font-bold' : '']"
    @click="$emit('update:value', id)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    id: null,
    value: null
  }
};
</script>
