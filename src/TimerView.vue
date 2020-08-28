<template>
    <div
        class="timer-view theme:text-primary"
        :class="{ 'is-overflowed': isOverflowed }"
        :style="{ fontSize: `${zoomFactor * 32}px` }"
    >
        <div class="leading-none" style="font-size: 4em">
            <span>{{ time.h }}</span>
            <span>:</span>
            <span>{{ time.m }}</span>
            <span>:</span>
            <span>{{ time.s }}</span>
            <template v-if="showMilliseconds">
                <span>:</span>
                <span>{{ time.ms }}</span>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TimerView',

    props: {
        time: Object,
        isOverflowed: Boolean,
        showMilliseconds: Boolean,
        zoomFactor: Number,
    },
};
</script>

<style>
.color-scheme-dark .is-overflowed {
    color: #e91e63 !important;
}

.color-scheme-light .is-overflowed {
    color: #F44336 !important;
}
</style>
