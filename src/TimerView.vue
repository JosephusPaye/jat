<template>
    <div
        class="timer-view theme:text-primary"
        :class="{ 'is-overflowed': isOverflowed }"
        :style="{ fontSize: `${zoomFactor * 32}px` }"
    >
        <div style="font-size: 4em">
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
.is-overflowed {
    color: #e91e63 !important;
}
</style>
