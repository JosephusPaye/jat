import { Howl } from "howler";

export const timerSound = new Howl({
  src: ["/timer.ogg", "/timer.oga"]
});

export function loop(sound, times) {
  let stopped = false;

  function play() {
    sound.once("end", () => {
      times--;

      if (!stopped && times > 0) {
        play();
      }
    });

    sound.play();
  }

  play();

  return () => {
    sound.stop();
    stopped = true;
  };
}
