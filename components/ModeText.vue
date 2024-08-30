<script setup lang="ts">
import {ref} from "vue";
import {MODE} from "~/composables/useMode";
import {RandomSvg, TrendsSvg, GlobalSearchSvg} from '#components';

const modesWithoutGlobal = [MODE.TRENDING, MODE.RANDOM];

const props = defineProps({
    currentMode: {
        type: String,
        required: true,
        default: MODE.SEARCH
    }
});

const emit = defineEmits({
    changeMode: null,
});

const isShowDropdown = ref(false);

const componentName = computed(() => getSvgByMode(props.currentMode));

const changeMode = (mode: string) => emit('changeMode', mode);
const showOrHideDropdown = () => isShowDropdown.value = !isShowDropdown.value;
const getSvgByMode = (currentMode: string) => {
    switch (currentMode) {
        case MODE.SEARCH:
            return GlobalSearchSvg;
        case MODE.TRENDING:
            return TrendsSvg;
        case MODE.RANDOM:
            return RandomSvg;
    }
}

</script>

<template>
    <div
        :class="{'current-mode-icon': true, show: isShowDropdown}"
        @click.prevent="showOrHideDropdown">
        <component :is="componentName" />

        <div class="dropdown-mode">
            <ul>
                <li
                    v-for="mode in modesWithoutGlobal"
                    :key="mode"
                    :class="{'mode-item': true, active: currentMode === mode}"
                    @click.prevent="changeMode(mode)">
                    <component :is="getSvgByMode(mode)" />
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

</style>