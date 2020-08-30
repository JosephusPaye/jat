<template>
  <div
    id="app"
    class="h-screen w-screen flex flex-col items-center justify-center theme:bg-base px-6"
  >
    <TimerType class="relative z-10" v-model="timer.type" />

    <Timer
      ref="timer"
      :type="timer.type"
      :length="timer.length"
      :allowOverflow="timer.allowOverflow"
      @done="onDone"
      v-slot="{ time, state, isOverflowed }"
    >
      <div
        class="max-w-full min-w-4xl -mt-10 pt-4"
        style="margin-top: -2.25rem;"
      >
        <div
          class="border theme:border rounded flex flex-col items-center p-16 pb-12 theme:bg-well"
        >
          <TimerView
            :time="time"
            :isOverflowed="isOverflowed"
            :showMilliseconds="timer.showMilliseconds"
            :zoomFactor="view.zoomFactor"
          />

          <Button
            class="mt-8"
            title="Shortcut: t"
            @click="showChangeTimeModal = true"
          >
            ✏ Change time
          </Button>
        </div>

        <div class="flex justify-between mt-4">
          <ButtonGroup>
            <Button @click="toggle" title="Shortcut: p">
              {{
                state === "stopped"
                  ? "▶ Start"
                  : state === "running"
                  ? "⏸ Pause"
                  : "▶ Resume"
              }}
            </Button>
            <Button @click="reset" title="Shortcut: r">
              🔄 Reset
            </Button>
            <Settings
              :showMilliseconds.sync="timer.showMilliseconds"
              :allowOverflow.sync="timer.allowOverflow"
              :allowSound.sync="timer.allowSound"
            />
          </ButtonGroup>

          <ButtonGroup class="flex ml-4">
            <Button @click="zoomIn" title="Shortcut: +">
              ➕ Bigger
            </Button>
            <Button @click="zoomOut" title="Shortcut: -">
              ➖ Smaller
            </Button>
            <Button
              @click="toggleColorScheme"
              :title="`Shortcut: ${view.colorScheme === 'light' ? 'd' : 'l'}`"
            >
              {{ view.colorScheme === "light" ? "🌙 Dark" : "☀ Light" }}
            </Button>
            <Button @click="toggleFullscreen" title="Shortcut: f">
              {{ view.isFullscreen ? "↙ Exit" : "↗ Fullscreen" }}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Timer>

    <ChangeTime
      :time="timer.length"
      :show.sync="showChangeTimeModal"
      @time="setTime"
    />

    <div class="mt-16 theme:text-secondary text-sm">
      Created by
      <a
        class="underline"
        href="https://twitter.com/JosephusPaye"
        target="_blank"
        rel="noopener"
        >Josephus Paye II</a
      >
      for
      <a
        class="underline"
        href="https://twitter.com/JosephusPaye/status/1214853295023411200"
        target="_blank"
        rel="noopener"
        >#CreateWeekly</a
      >. Available on
      <a
        class="underline"
        href="https://github.com/JosephusPaye/jat"
        target="_blank"
        rel="noopener"
        >GitHub</a
      >.
    </div>
  </div>
</template>

<script>
import { TimerVue as Timer } from "@josephuspaye/timer";

import Button from "./Button.vue";
import ButtonGroup from "./ButtonGroup.vue";
import ChangeTime from "./ChangeTime.vue";
import Settings from "./Settings.vue";
import TimerType from "./TimerType.vue";
import TimerView from "./TimerView.vue";
import UseFullscreen from "./UseFullscreen.js";

import { timerSound, loop } from "./sound.js";
import { restore, persist } from "./storage.js";
import * as keys from "./keys.js";

export default {
  name: "App",

  components: {
    Button,
    ButtonGroup,
    ChangeTime,
    Settings,
    Timer,
    TimerType,
    TimerView
  },

  mixins: [UseFullscreen],

  data() {
    const prefersDarkMode = window.matchMedia("prefers-color-scheme: dark")
      .matches;

    const data = {
      timer: restore("timer", {
        type: "countdown",
        length: 2 * 60 * 1000,
        showMilliseconds: true,
        allowOverflow: false,
        allowSound: false
      }),
      view: restore("view", {
        zoomFactor: 1,
        colorScheme: prefersDarkMode ? "dark" : "light",
        isFullscreen: false
      }),
      showChangeTimeModal: false
    };

    data.view.isFullscreen = this.isFullscreen();

    return data;
  },

  watch: {
    view: {
      handler(view) {
        persist("view", view);
      },
      deep: true
    },

    "view.colorScheme": {
      handler(colorScheme) {
        document.body.classList.remove(
          colorScheme === "light" ? "color-scheme-dark" : "color-scheme-light"
        );
        document.body.classList.add("color-scheme-" + colorScheme);
      },
      immediate: true
    },

    timer: {
      handler(timer) {
        persist("timer", timer);
      },
      deep: true
    },

    "timer.allowSound"(allowSound) {
      if (!allowSound && this.stopTimerSound) {
        this.stopTimerSound();
        this.stopTimerSound = undefined;
      }
    }
  },

  created() {
    this.view.isFullscreen = false;
  },

  mounted() {
    this.$on("fullscreen-change", isFullscreen => {
      this.view.isFullscreen = isFullscreen;
    });

    keys.setContext("main");
    keys.add(
      [
        "c",
        "C",
        "s",
        "S",
        "t",
        "T",
        "p",
        "P",
        "r",
        "R",
        "m",
        "M",
        "o",
        "O",
        "a",
        "A",
        "=",
        "+",
        "-",
        "_",
        "0",
        ")",
        "d",
        "D",
        "l",
        "L",
        "f",
        "F"
      ],
      "main",
      event => {
        switch (event.key) {
          case "c":
          case "C":
            this.timer.type = "countdown";
            break;
          case "s":
          case "S":
            this.timer.type = "stopwatch";
            break;
          case "t":
          case "T":
            this.showChangeTimeModal = true;
            break;
          case "p":
          case "P":
            this.toggle();
            break;
          case "r":
          case "R":
            if (confirm("Reset timer?")) {
              this.reset();
            }
            break;
          case "m":
          case "M":
            this.timer.showMilliseconds = !this.timer.showMilliseconds;
            break;
          case "o":
          case "O":
            this.timer.allowOverflow = !this.timer.allowOverflow;
            break;
          case "a":
          case "A":
            this.timer.allowSound = !this.timer.allowSound;
            break;
          case "=":
          case "+":
            this.zoomIn();
            break;
          case "-":
          case "_":
            this.zoomOut();
            break;
          case "0":
          case ")":
            this.view.zoomFactor = 1;
            break;
          case "d":
          case "D":
            this.view.colorScheme = "dark";
            break;
          case "l":
          case "L":
            this.view.colorScheme = "light";
            break;
          case "f":
          case "F":
            this.toggleFullscreen();
            break;
        }
      }
    );
  },

  beforeDestroy() {
    keys.removeContext("main");
  },

  methods: {
    setTime(time) {
      const wasRunning = this.$refs.timer.state === "running";

      this.$refs.timer.stop();
      this.timer.length = time;

      if (wasRunning) {
        this.$nextTick(() => {
          this.$refs.timer.start();
        });
      }
    },

    toggle() {
      this.$refs.timer.toggle();
    },

    reset() {
      this.$refs.timer.reset();
    },

    zoomIn() {
      if (this.view.zoomFactor === 4) {
        return;
      }

      this.view.zoomFactor += 0.25;
    },

    zoomOut() {
      if (this.view.zoomFactor === 0.75) {
        return;
      }

      this.view.zoomFactor -= 0.25;
    },

    toggleColorScheme() {
      this.view.colorScheme =
        this.view.colorScheme === "light" ? "dark" : "light";
    },

    onDone() {
      if (this.timer.allowSound) {
        this.stopTimerSound = loop(timerSound, 3);
      }
    }
  }
};
</script>

<style lang="scss">
@import "./tailwind.css";

.js-focus-visible :focus:not(.focus-visible) {
  outline: none;
}

.color-scheme-dark {
  *:focus.focus-visible,
  *:focus.focus-visible + .focus-target {
    outline: none;
    box-shadow: #4fc3f7 0px 0px 0px 3px;
  }

  .theme\: {
    // The base background color
    &bg-base {
      @apply bg-gray-900;
    }

    // Background color for overlays like modals and dropdowns
    &bg-overlay {
      @apply bg-gray-900;
    }

    &bg-well {
      background-color: rgba(0, 0, 0, 0.15);
    }

    // Highlight (hover) background
    &bg-highlights:hover {
      @apply bg-gray-800;
    }

    // Selection background
    &bg-selects.is-selected {
      @apply bg-blue-600;
    }

    // Selection foreground
    &text-selects.is-selected {
      @apply text-white;
    }

    &text-primary {
      @apply text-gray-100;
    }

    &text-secondary {
      @apply text-gray-500;
    }

    &border {
      @apply border-gray-800;
    }
  }
}

.color-scheme-light {
  *:focus.focus-visible,
  *:focus.focus-visible + .focus-target {
    outline: none;
    box-shadow: #4fc3f7 0px 0px 0px 3px;
  }

  .theme\: {
    // The base background color
    &bg-base {
      @apply bg-white;
    }

    // Background color for overlays like modals and dropdowns
    &bg-overlay {
      @apply bg-white;
    }

    &bg-well {
      background-color: rgba(0, 0, 0, 0.05);
    }

    // Highlight (hover) background
    &bg-highlights:hover {
      @apply bg-gray-200;
    }

    // Selection background
    &bg-selects.is-selected {
      @apply bg-blue-600;
    }

    // Selection foreground
    &text-selects.is-selected {
      @apply text-white;
    }

    &text-primary {
      color: rgba(0, 0, 0, 0.87);
    }

    &text-secondary {
      color: rgba(0, 0, 0, 0.54);
    }

    &border {
      @apply border-gray-300;
    }
  }
}
</style>
