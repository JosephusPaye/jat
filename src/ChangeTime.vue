<template>
  <transition name="modal" v-if="show">
    <div class="modal-mask fixed top-0 left-0 w-full h-full table">
      <div class="modal-wrapper table-cell align-middle">
        <div class="modal-container max-w-full mx-auto ">
          <div class="bg-overlay rounded p-6">
            <div class="flex justify-end">
              <button class="text-primary" @click="close">x</button>
            </div>

            <div class="text-primary">
              Change time
            </div>

            <div class="grid grid-cols-3 gap-x-2 gap-y-2 mt-4">
              <button
                class="text-primary"
                :class="[time === selectedTime ? 'font-bold' : '']"
                :key="time"
                @click="selectedTime = time"
                v-for="time in commonTimes"
              >
                {{ time }}
              </button>
            </div>

            <div class="mt-4">
              <input
                class="text-primary text-2xl bg-overlay"
                type="text"
                v-model="selectedTime"
                :class="[selectedTimeInvalid ? 'border border-red-500' : '']"
              />
              <div class="text-sm text-secondary">
                Enter time in
                <span class="italic">hour:minute:second</span> format
              </div>
            </div>

            <button
              @click="setTime"
              class="mt-4 text-primary"
              :disabled="selectedTimeInvalid"
            >
              Set time
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { parseTime } from "./util.js";

export default {
  name: "ChangeTime",

  props: {
    show: Boolean
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

<style>
.modal-mask {
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 28rem;
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
  transform: scale(1.1);
}
</style>
