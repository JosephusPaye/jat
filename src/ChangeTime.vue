<template>
  <transition name="modal" v-if="show">
    <div class="modal-mask fixed top-0 left-0 w-full h-full table">
      <div class="modal-wrapper table-cell align-middle">
        <div class="modal-container w-full max-w-xl mx-auto">
          <div class="theme:bg-overlay rounded-lg p-12 pt-16">
            <div class="relative">
              <div class="theme:text-primary text-2xl">
                Change time
              </div>
              <CloseButton
                class="absolute right-0 top-0 -mr-8 -mt-12"
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
              v-model="selectedTime"
              :invalid="selectedTimeInvalid"
            />

            <Button
              @click="setTime"
              class="mt-8 w-32"
              :disabled="selectedTimeInvalid"
            >
              Set time
            </Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Button from "./Button.vue";
import CloseButton from "./CloseButton.vue";
import TimeInput from "./TimeInput.vue";

import { parseTime, formatTime } from "./util.js";

export default {
  name: "ChangeTime",

  props: {
    time: Number,
    show: Boolean
  },

  components: { Button, CloseButton, TimeInput },

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
      // Set the selected time when the modal is opened
      if (show) {
        this.selectedTime = formatTime(this.time);
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
