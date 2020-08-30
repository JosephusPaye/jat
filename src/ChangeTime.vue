<template>
  <transition name="modal" v-if="show">
    <div class="modal-mask fixed top-0 left-0 w-full h-full table">
      <div class="modal-wrapper table-cell align-middle">
        <div class="modal-container w-full max-w-xl mx-auto">
          <FocusContainer
            class="theme:bg-overlay rounded-lg p-12 pt-16"
            :focusRedirector="redirectFocus"
            @keydown.native.stop.esc="onEsc"
          >
            <div class="relative">
              <div class="theme:text-primary text-2xl">
                Change time
              </div>
              <CloseButton
                class="absolute right-0 top-0 -mr-8 -mt-12"
                ref="focusHead"
                @click="close"
              />
            </div>

            <div class="grid grid-cols-3 gap-x-2 gap-y-2 mt-6">
              <Button
                :selected="time === selectedTime"
                :key="time"
                @click="selectedTime = time"
                v-for="time in commonTimes"
              >
                {{ time }}
              </Button>
            </div>

            <TimeInput
              class="mt-8"
              ref="focusInitial"
              v-model="selectedTime"
              :invalid="selectedTimeInvalid"
            />

            <Button
              @click="setTime"
              class="mt-8 w-32"
              ref="focusTail"
              :disabled="selectedTimeInvalid"
            >
              Set time
            </Button>
          </FocusContainer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Button from "./Button.vue";
import CloseButton from "./CloseButton.vue";
import FocusContainer from "./FocusContainer.vue";
import TimeInput from "./TimeInput.vue";

import { parseTime, formatTime } from "./util.js";

export default {
  name: "ChangeTime",

  props: {
    time: Number,
    show: Boolean
  },

  components: {
    Button,
    CloseButton,
    FocusContainer,
    TimeInput
  },

  data() {
    return {
      selectedTime: "00:05:00",
      commonTimes: [
        "00:01:00",
        "00:05:00",
        "00:10:00",
        "00:15:00",
        "00:30:00",
        "01:00:00",
        "01:30:00",
        "02:00:00",
        "03:00:00"
      ]
    };
  },

  computed: {
    selectedTimeInvalid() {
      return Number.isNaN(parseTime(this.selectedTime));
    }
  },

  watch: {
    show(show) {
      if (show) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }
  },

  methods: {
    setTime() {
      this.$emit("time", parseTime(this.selectedTime));
      this.close();
    },

    close() {
      this.$emit("update:show", false);
    },

    redirectFocus(event, options) {
      if (options.isTabbingForward) {
        this.$refs.focusHead.$el.focus();
      } else {
        this.$refs.focusTail.$el.focus();
      }
    },

    onOpen() {
      this.selectedTime = formatTime(this.time);

      this.previousActiveElement = document.activeElement;

      this.$nextTick(() => {
        this.$refs.focusInitial.focus();
      });
    },

    onClose() {
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }
    },

    onEsc() {
      this.close();
    }
  }
};
</script>

<style lang="scss">
.modal-mask {
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-container {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: scale(0.9);
}
</style>
