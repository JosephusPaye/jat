<template>
  <div
    class="timer-view theme:text-primary"
    :class="{ 'is-overflowed': isOverflowed, flash: isDone }"
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
  name: "TimerView",

  props: {
    time: Object,
    isOverflowed: Boolean,
    isDone: Boolean,
    showMilliseconds: Boolean,
    zoomFactor: Number
  }
};
</script>

<style>
.timer-view.is-overflowed {
  color: #f44336 !important;
}

.flash {
  animation-name: flash;
  animation-duration: 1.75s;
  animation-iteration-count: 3;
}

@keyframes flash {
  from,
  50%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0;
  }
}
</style>
