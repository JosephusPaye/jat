export default {
  beforeDestroy() {
    if (typeof this.destroyExternalClickListener === "function") {
      this.removeExternalClickListener();
    }
  },

  methods: {
    addExternalClickListener(
      elements,
      callback = null,
      options = { passive: true }
    ) {
      elements = Array.isArray(elements) ? elements : [elements];

      const onClick = e => {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].contains(e.target)) {
            return; // End early, click was internal
          }
        }

        if (typeof callback === "function") {
          callback(e);
        } else {
          this.$emit("external-click", e);
        }
      };

      document.addEventListener("click", onClick, options);

      this.destroyExternalClickListener = () => {
        document.removeEventListener("click", onClick, options);
      };
    },

    removeExternalClickListener() {
      if (this.destroyExternalClickListener) {
        this.destroyExternalClickListener();
        this.destroyExternalClickListener = null;
      }
    }
  }
};
