export default {
  mounted() {
    document.addEventListener(
      "fullscreenchange",
      this.onFullScreenChange,
      false
    );
    document.addEventListener(
      "webkitfullscreenchange",
      this.onFullScreenChange,
      false
    );
    document.addEventListener(
      "mozfullscreenchange",
      this.onFullScreenChange,
      false
    );
  },

  beforeDestroy() {
    document.removeEventListener(
      "fullscreenchange",
      this.onFullScreenChange,
      false
    );
    document.removeEventListener(
      "webkitfullscreenchange",
      this.onFullScreenChange,
      false
    );
    document.removeEventListener(
      "mozfullscreenchange",
      this.onFullScreenChange,
      false
    );
  },

  methods: {
    isFullscreen() {
      return Boolean(
        document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement
      );
    },

    toggleFullscreen() {
      if (this.isFullscreen()) {
        document.exitFullscreen && document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    },

    onFullScreenChange() {
      this.$emit("fullscreen-change", this.isFullscreen());
    }
  }
};
