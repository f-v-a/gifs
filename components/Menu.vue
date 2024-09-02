<template>
    <div class="modes-menu">
        <ul>
            <li>
                Рандом
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
// import {MODE} from "~/composables/useMode";
// import {RandomSvg, TrendsSvg, GlobalSearchSvg} from '#components';
// import {showOrHide} from "../helpers/index";
// import type {Mode} from "../helpers/types";
//
// interface IProps {currentMode: Mode}
// interface IEmits {(e: 'changeMode', value: string): void}
//
// const props = defineProps<IProps>();
// const emit = defineEmits<IEmits>();
//
// const {isOpen, openOrClose} = showOrHide();
//
// const componentByMode = Object.freeze({
//     [MODE.SEARCH]: GlobalSearchSvg,
//     [MODE.TRENDING]: TrendsSvg,
//     [MODE.RANDOM]: RandomSvg,
// });
//
// const componentName = computed(() => getSvgByMode(props.currentMode));
//
// const changeMode = (mode: Mode) => emit('changeMode', mode);
// const getSvgByMode = (currentMode: Mode) => componentByMode[currentMode];
</script>

<style scoped>

</style>