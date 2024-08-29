<script setup lang="ts">
import {ref} from "vue";
import {MODE, MODES_TEXT} from "~/composables/useMode";
import {RandomSvg, TrendsSvg, GlobalSearchSvg} from '#components';

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

const componentName = computed(() => {
    switch (props.currentMode) {
        case MODE.SEARCH:
            return GlobalSearchSvg;
        case MODE.TRENDING:
            return TrendsSvg;
        case MODE.RANDOM:
            return RandomSvg;
    }
});

const changeMode = (mode: string) => emit('changeMode', mode);
const showOrHideDropdown = () => isShowDropdown.value = !isShowDropdown.value;

</script>

<template>
    <div class="current-mode">
        <component :is="componentName" />
        <h4
            class="current-mode-text"
            @click.prevent="showOrHideDropdown">
            {{ MODES_TEXT[currentMode] }}
        </h4>

        <div :class="{'dropdown-mode': true, show: isShowDropdown}">
            <ul>
                <li
                    v-for="mode in MODE"
                    :key="mode"
                    :class="{'mode-item': true, active: currentMode === mode}"
                    :style="{display: currentMode === mode ? 'none' : 'block'}"
                    @click.prevent="changeMode(mode)">
                    {{ mode }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

</style>