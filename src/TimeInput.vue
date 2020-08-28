<template>
    <div class="time-input">
        <input
            class="border text-2xl px-4 py-2 leading-none rounded w-full"
            type="text"
            :value="value"
            @input="$emit('input', $event.target.value)"
            :class="{
                'is-invalid': invalid,
            }"
        />
        <div
            class="text-sm mt-1"
            :class="[
                invalid ? 'text-red-500' : 'theme:text-secondary',
            ]"
        >
            <span v-if="invalid">Time invalid. </span>
            Enter time in
            <span class="font-semibold">hour:minute:second</span>
            format.
        </div>
    </div>
</template>

<script>
export default {
    name: 'TimeInput',

    props: {
        value: String,
        invalid: Boolean
    },
};
</script>

<style lang="scss">
.color-scheme-dark .time-input {
    input {
        background-color: rgba(0, 0, 0, 0.15);
        @apply text-white border-gray-800;

        &:hover {
            @apply border-gray-700;
        }

        &:focus {
            box-shadow: #4fc3f7 0px 0px 0px 3px;
        }

        &:focus.is-invalid {
            box-shadow: #f06292 0px 0px 0px 3px !important;
        }

        &.is-invalid {
            @apply border-red-500;
        }
    }
}

.color-scheme-light .time-input {
    input {
        background-color: rgba(0, 0, 0, 0.05);
        color:rgba(0, 0, 0, 0.87);
        @apply border-gray-300;

        &:hover {
            @apply border-gray-400;
        }

        &:focus {
            box-shadow: #4fc3f7 0px 0px 0px 3px;
        }

        &:focus.is-invalid {
            box-shadow: #f06292 0px 0px 0px 3px !important;
        }

        &.is-invalid {
            @apply border-red-500;
        }
    }
}
</style>
