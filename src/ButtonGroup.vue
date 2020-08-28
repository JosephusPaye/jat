<template>
    <div class="button-group flex">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'ButtonGroup',
};
</script>

<style lang="scss">
.color-scheme-dark .button-group {
    .button {
        @apply rounded-none border-r border-gray-700;
    }

    .button:first-child {
        @apply rounded-l;
    }

    .button:last-child,
    *:last-child .button {
        @apply rounded-l-none rounded-r border-r-0;
    }
}
</style>
