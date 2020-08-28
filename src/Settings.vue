<template>
  <div class="relative">
    <Button @click="toggleMenu">
      ⚙ Settings
    </Button>
    <div class="absolute" v-show="menuOpen">
      <label class="flex items-center"
        ><input
          class="w-3 h-3 mr-2"
          type="checkbox"
          :checked="showMilliseconds"
          @input="$emit('update:showMilliseconds', $event.target.checked)"
        />
        Show milliseconds</label
      >
      <label class="flex items-center"
        ><input
          class="w-3 h-3 mr-2"
          type="checkbox"
          :checked="allowOverflow"
          @input="$emit('update:allowOverflow', $event.target.checked)"
        />
        Allow overflow</label
      >
      <label class="flex items-center"
        ><input
          class="w-3 h-3 mr-2"
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
import Button from './Button.vue';

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
