<template>
  <div class="relative">
    <Button @click="toggleMenu">
      ⚙ Settings
    </Button>
    <FocusContainer
      class="absolute left-0 w-56 py-2 border theme:bg-overlay theme:border rounded rounded-bl-none"
      style="bottom: 100%"
      :focusRedirector="redirectFocus"
      :containFocus="menuOpen"
      v-show="menuOpen"
      @keydown.native.stop.esc="onEsc"
    >
      <label
        title="Shortcut: m"
        class="flex items-center px-4 py-2 leading-none cursor-pointer select-none theme:text-primary theme:bg-highlights"
        ><input
          class="w-3 h-3 mr-3"
          type="checkbox"
          ref="focusHead"
          :checked="showMilliseconds"
          @input="$emit('update:showMilliseconds', $event.target.checked)"
        />
        Show milliseconds</label
      >
      <label
        title="Shortcut: o"
        class="flex items-center px-4 py-2 leading-none cursor-pointer select-none theme:text-primary theme:bg-highlights"
        ><input
          class="w-3 h-3 mr-3"
          type="checkbox"
          :checked="allowOverflow"
          @input="$emit('update:allowOverflow', $event.target.checked)"
        />
        Allow overflow</label
      >
      <label
        title="Shortcut: a"
        class="flex items-center px-4 py-2 leading-none cursor-pointer select-none theme:text-primary theme:bg-highlights"
        ><input
          class="w-3 h-3 mr-3"
          type="checkbox"
          :checked="allowSound"
          @input="$emit('update:allowSound', $event.target.checked)"
        />
        Alarm when done</label
      >
      <label
        title="Shortcut: h"
        class="flex items-center px-4 py-2 leading-none cursor-pointer select-none theme:text-primary theme:bg-highlights"
        ><input
          class="w-3 h-3 mr-3"
          type="checkbox"
          ref="focusTail"
          :checked="autoHideChrome"
          @input="$emit('update:autoHideChrome', $event.target.checked)"
        />
        Hide UI when running</label
      >
    </FocusContainer>
  </div>
</template>

<script>
import Button from "./Button.vue";
import FocusContainer from "./FocusContainer.vue";
import UseExternalClick from "./UseExternalClick.js";

export default {
  name: "Settings",

  components: { Button, FocusContainer },

  mixins: [UseExternalClick],

  props: {
    showMilliseconds: Boolean,
    allowOverflow: Boolean,
    allowSound: Boolean,
    autoHideChrome: Boolean
  },

  data() {
    return {
      menuOpen: false
    };
  },

  watch: {
    menuOpen(open) {
      if (open) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }
  },

  mounted() {
    this.addExternalClickListener(this.$el, () => {
      this.menuOpen = false;
    });
  },

  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },

    redirectFocus(event, options) {
      if (options.isTabbingForward) {
        this.$refs.focusHead.focus();
      } else {
        this.$refs.focusTail.focus();
      }
    },

    onOpen() {
      this.previousActiveElement = document.activeElement;

      this.$nextTick(() => {
        this.$refs.focusHead.focus();
      });
    },

    onClose() {
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }
    },

    onEsc() {
      this.menuOpen = false;
    }
  }
};
</script>
