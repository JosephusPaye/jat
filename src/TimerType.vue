<template>
  <div class="flex">
    <label title="Shortcut: c">
      <input
        type="radio"
        class="timer-type__radio"
        name="timer_type"
        value="countdown"
        :checked="value === 'countdown'"
        @input="$emit('input', $event.target.value)"
      />
      <div
        class="timer-type__button font-semibold cursor-pointer inline-flex items-center focus-target border border-r-0 pl-6 pr-4 py-2 leading-none rounded-l-full theme:text-primary theme:text-selects theme:border theme:bg-base theme:bg-highlights theme:bg-selects"
        :class="[value === 'countdown' ? 'is-selected' : '']"
      >
        <HourglassIcon /> <span>Countdown</span>
      </div>
    </label>
    <label title="Shortcut: s">
      <input
        type="radio"
        class="timer-type__radio"
        name="timer_type"
        value="stopwatch"
        :checked="value === 'stopwatch'"
        @input="$emit('input', $event.target.value)"
      />
      <div
        class="timer-type__button font-semibold cursor-pointer inline-flex items-center focus-target border border-l-0 pl-4 pr-6 py-2 leading-none rounded-r-full theme:text-primary theme:text-selects theme:border theme:bg-base theme:bg-highlights theme:bg-selects"
        :class="[value === 'stopwatch' ? 'is-selected' : '']"
      >
        <TimerIcon /> Stopwatch
      </div>
    </label>
  </div>
</template>

<script>
import TimerIcon from "./icons/timer.svg";
import HourglassIcon from "./icons/hourglass.svg";

export default {
  name: "TimerType",

  components: { TimerIcon, HourglassIcon },

  props: {
    value: String
  }
};
</script>

<style lang="scss">
.timer-type__radio {
  appearance: none;
  height: 1px;
  left: 0;
  margin: 0;
  opacity: 0;
  outline: none;
  padding: 0;
  position: absolute;
  top: 0;
  width: 1px;

  &:focus.focus-visible + .focus-target {
    position: relative;
    z-index: 1;
  }
}

.timer-type__button.is-selected {
  border-color: transparent !important;
}
</style>
