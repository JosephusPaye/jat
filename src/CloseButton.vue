<template>
    <button
        class="close-button w-10 h-10 rounded-full inline-flex items-center justify-center"
        @click="$emit('click', $event)"
    >✖</button>
</template>

<script>
export default {
    name: 'CloseButton'
};
</script>

<style lang="scss">
.color-scheme-dark .close-button {
    &:hover,
    &:focus {
        @apply bg-gray-800;
    }
}
</style>
