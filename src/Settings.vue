<template>
  <div class="relative">
    <Button @click="toggleMenu">
      ⚙ Settings
    </Button>
    <div
      class="absolute left-0 w-48 py-2 border theme:bg-overlay theme:border rounded rounded-bl-none"
      v-show="menuOpen"
      style="bottom: 100%"
    >
      <label
        class="flex items-center px-4 py-2 leading-none cursor-pointer select-none theme:text-primary theme:bg-highlights"
        ><input
          class="w-3 h-3 mr-3"
          type="checkbox"
          :checked="showMilliseconds"
          @input="$emit('update:showMilliseconds', $event.target.checked)"
        />
        Show milliseconds</label
      >
      <label
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
        class="flex items-center px-4 py-2 leading-none cursor-pointer select-none theme:text-primary theme:bg-highlights"
        ><input
          class="w-3 h-3 mr-3"
          type="checkbox"
          :checked="allowSound"
          @input="$emit('update:allowSound', $event.target.checked)"
        />
        Alarm when done</label
      >
    </div>
  </div>
</template>

<script>
import Button from "./Button.vue";

export default {
  name: "Settings",

  components: { Button },

  props: {
    showMilliseconds: Boolean,
    allowOverflow: Boolean,
    allowSound: Boolean
  },

  data() {
    return {
      menuOpen: false
    };
  },

  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
  }
};
</script>
