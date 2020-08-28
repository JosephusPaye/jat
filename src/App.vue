<template>
    <div
        id="app"
        class="h-screen w-screen flex flex-col items-center justify-center theme:bg-base"
    >
        <TimerType class="relative z-10" v-model="timer.type" />

        <Timer
            ref="timer"
            :type="timer.type"
            :length="timer.length"
            :allowOverflow="timer.allowOverflow"
            @done="onDone"
            v-slot="{ time, state, isOverflowed, isDone }"
        >
            <div class="w-full max-w-4xl -mt-10 pt-4" style="margin-top: -2.25rem;">
                <div class="border theme:border rounded flex flex-col items-center p-16 pb-12 theme:bg-well shadow-inner">
                    <div
                        class="text-6xl theme:text-primary"
                        :class="[
                            isOverflowed ? 'text-red-500' : '',
                            isDone ? 'strikethrough' : '',
                        ]"
                    >
                        <span>{{ time.h }}</span>
                        <span>:</span>
                        <span>{{ time.m }}</span>
                        <span>:</span>
                        <span>{{ time.s }}</span>
                        <template v-if="timer.showMilliseconds">
                            <span>:</span>
                            <span>{{ time.ms }}</span>
                        </template>
                    </div>

                    <Button class="mt-4" @click="showChangeTimeModal = true">
                        ✏ Change time
                    </Button>
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
                    <button class="text-primary" @click="zoomIn">
                        ➕ Bigger
                    </button>
                    <button class="text-primary" @click="zoomOut">
                        ➖ Smaller
                    </button>
                    <button class="text-primary" @click="toggleColorScheme">
                        {{
                            view.colorScheme === 'light' ? '🌙 Dark' : '☀ Light'
                        }}
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
import Button from './Button.vue';
import TimerType from './TimerType.vue';
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

    components: { Button, ChangeTime, Timer, TimerType, Settings },

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
        'view.colorScheme': {
            handler(colorScheme) {
                document.body.classList.remove(
                    colorScheme === 'light'
                        ? 'color-scheme-dark'
                        : 'color-scheme-light'
                );
                document.body.classList.add('color-scheme-' + colorScheme);
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

.js-focus-visible :focus:not(.focus-visible) {
    outline: none;
}

*:focus.focus-visible,
*:focus.focus-visible + .focus-target {
    outline: none;
    box-shadow: rgba(66, 153, 225, 0.6) 0px 0px 0px 3px;
}

.bg-base,
.bg-overlay,
.text-primary,
.text-secondary {
    transition-property: color, background-color;
    transition-duration: 0.4s;
    transition-timing-function: ease-in-out;
}

.color-scheme-dark .theme\: {
    // The base background color
    &bg-base {
        @apply bg-gray-900;
    }

    // Background color for overlays like modals and dropdowns
    &bg-overlay {
        @apply bg-gray-800;
    }

    &bg-well {
        background-color: rgba(0,0,0,0.15);
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
        @apply border-gray-700;
    }
}
</style>
