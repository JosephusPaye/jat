<template>
    <div
        id="app"
        class="h-screen w-screen flex flex-col items-center justify-center bg-base"
        :class="['color-scheme-' + view.colorScheme]"
    >
        <div class="flex">
            <ToggleButton
                id="countdown"
                :value.sync="timer.type"
                class="mr-2 text-primary"
                >⏳ Countdown</ToggleButton
            >
            <ToggleButton
                id="stopwatch"
                :value.sync="timer.type"
                class="text-primary"
                >⌚ Stopwatch</ToggleButton
            >
        </div>
        <Timer
            ref="timer"
            :type="timer.type"
            :length="timer.length"
            :allowOverflow="timer.allowOverflow"
            @done="onDone"
            v-slot="{ time, state, isOverflowed, isDone }"
        >
            <div class="border rounded w-full max-w-lg">
                <button
                    class="text-primary"
                    @click="showChangeTimeModal = true"
                >
                    ✏ Change time
                </button>

                <div
                    class="text-4xl text-primary"
                    :class="[
                        isOverflowed ? 'text-red-500' : '',
                        isDone ? 'strikethrough' : '',
                    ]"
                >
                    {{ time.h }}:{{ time.m }}:{{ time.s
                    }}<span v-if="timer.showMilliseconds">:{{ time.ms }}</span>
                </div>

                <div class="mt-4 text-primary">
                    <button class="text-primary mr-2" @click="toggle">
                        {{
                            state === 'stopped'
                                ? '▶ Start'
                                : state === 'running'
                                ? '⏸ Pause'
                                : '▶ Resume'
                        }}
                    </button>
                    <button class="text-primary" @click="reset">
                        🔄 Reset
                    </button>
                    <Settings
                        :showMilliseconds.sync="timer.showMilliseconds"
                        :allowOverflow.sync="timer.allowOverflow"
                        :allowSound.sync="timer.allowSound"
                    />
                </div>

                <div class="flex">
            <button class="text-primary" @click="zoomIn">➕ Bigger</button>
            <button class="text-primary" @click="zoomOut">➖ Smaller</button>
            <button class="text-primary" @click="toggleColorScheme">
                {{ view.colorScheme === 'light' ? '🌙 Dark' : '☀ Light' }}
            </button>
            <button class="text-primary" @click="toggleFullscreen">
                {{ view.isFullscreen ? '↙ Exit' : '↗ Fullscreen' }}
            </button>
        </div>
            </div>
        </Timer>

        <ChangeTime :show.sync="showChangeTimeModal" @time="setTime" />
    </div>
</template>

<script>
import { TimerVue as Timer } from '@josephuspaye/timer';
import ToggleButton from './ToggleButton.vue';
import ChangeTime from './ChangeTime.vue';
import Settings from './Settings.vue';
import { Howl } from 'howler';

export function restore(key, fallback) {
    const data = localStorage.getItem(`jat:${key}`);
    return data ? JSON.parse(data) : fallback;
}

export function persist(key, data) {
    localStorage.setItem(`jat:${key}`, JSON.stringify(data));
}

const timerSound = new Howl({
    src: ['/timer.ogg', '/timer.oga'],
});

function loop(sound, times) {
    let stopped = false;

    function play() {
        sound.once('end', () => {
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

export default {
    name: 'App',

    components: { ChangeTime, Timer, ToggleButton, Settings },

    data() {
        const prefersDarkMode = window.matchMedia('prefers-color-scheme: dark')
            .matches;

        const data = {
            timer: restore('timer', {
                type: 'countdown',
                length: 2 * 60 * 1000,
                showMilliseconds: true,
                allowOverflow: false,
                allowSound: false,
            }),
            view: restore('view', {
                zoomFactor: 1,
                colorScheme: prefersDarkMode ? 'dark' : 'light',
                isFullscreen: false,
            }),
            showChangeTimeModal: false,
        };

        data.view.isFullscreen = this.isFullscreen();

        return data;
    },

    watch: {
        view: {
            handler(view) {
                persist('view', view);
            },
            deep: true,
        },
        'view.zoomFactor': {
            handler(zoomFactor) {
                document.documentElement.style.fontSize = `${zoomFactor *
                    16}px`;
            },
            immediate: true,
        },
        timer: {
            handler(timer) {
                persist('timer', timer);
            },
            deep: true,
        },
        'timer.allowSound'(allowSound) {
            if (!allowSound && this.stopTimerSound) {
                this.stopTimerSound();
                this.stopTimerSound = undefined;
            }
        },
    },

    created() {
        this.view.isFullscreen = false;
    },

    mounted() {
        document.addEventListener(
            'fullscreenchange',
            this.onFullScreenChange,
            false
        );
        document.addEventListener(
            'webkitfullscreenchange',
            this.onFullScreenChange,
            false
        );
        document.addEventListener(
            'mozfullscreenchange',
            this.onFullScreenChange,
            false
        );
    },

    beforeDestroy() {
        document.removeEventListener(
            'fullscreenchange',
            this.onFullScreenChange,
            false
        );
        document.removeEventListener(
            'webkitfullscreenchange',
            this.onFullScreenChange,
            false
        );
        document.removeEventListener(
            'mozfullscreenchange',
            this.onFullScreenChange,
            false
        );
    },

    methods: {
        setTime(time) {
            const wasRunning = this.$refs.timer.state === 'running';

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
                this.view.colorScheme === 'light' ? 'dark' : 'light';
        },

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
            this.view.isFullscreen = this.isFullscreen();
        },

        onDone() {
            if (this.timer.allowSound) {
                this.stopTimerSound = loop(timerSound, 3);
            }
        },
    },
};
</script>

<style lang="scss">
@import './tailwind.css';

.bg-base,
.bg-overlay,
.text-primary,
.text-secondary {
    transition-property: color, background-color;
    transition-duration: 0.4s;
    transition-timing-function: ease-in-out;
}

.color-scheme-light {
    &.bg-base,
    .bg-base {
        @apply bg-white;
    }

    .bg-overlay {
        @apply bg-white;
    }

    .text-primary {
        color: rgba(0, 0, 0, 0.87);
    }

    .text-secondary {
        color: rgba(0, 0, 0, 0.54);
    }
}

.color-scheme-dark {
    &.bg-base,
    .bg-base {
        @apply bg-gray-900;
    }

    .bg-overlay {
        @apply bg-gray-800;
    }

    .text-primary {
        @apply text-gray-100;
    }

    .text-secondary {
        @apply text-gray-500;
    }
}
</style>
