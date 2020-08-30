<template>
  <component class="focus-container" :is="tag">
    <span
      class="focus-container__focus-redirector"
      tabindex="0"
      @focus="redirectFocus($event, { isTabbingForward: false })"
      v-if="renderRedirector"
    ></span>

    <slot></slot>

    <span
      class="focus-container__focus-redirector"
      tabindex="0"
      @focus="redirectFocus($event, { isTabbingForward: true })"
      v-if="renderRedirector"
    ></span>
  </component>
</template>

<script>
export default {
  name: "focus-container",

  props: {
    tag: {
      type: String,
      default: "div"
    },
    containFocus: {
      type: Boolean,
      default: true
    },
    focusRedirector: {
      type: Function,
      required: true
    },
    lazy: {
      type: Boolean,
      default: false // When true, the focus redirectors are not rendered until containFocus is true
    }
  },

  computed: {
    renderRedirector() {
      return this.lazy ? this.containFocus : true;
    }
  },

  methods: {
    focus() {
      this.$refs.content.focus();
    },

    redirectFocus(e, options) {
      if (!this.containFocus) {
        this.$emit("focus-overflow", e, options);
        return;
      }

      e.stopPropagation();

      this.focusRedirector(e, options);
    }
  }
};
</script>

<style lang="scss">
.focus-container__focus-redirector {
  opacity: 0;
  position: absolute;
}
</style>
