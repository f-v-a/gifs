<script setup lang="ts">
import {MODES_TEXT} from "~/composables/useMode";
import {RandomSvg, TrendsSvg, GlobalSearchSvg} from '#components';

const props = defineProps({
    currentMode: {
        type: String,
        required: true,
        default: MODE.SEARCH
    }
});

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

</script>

<template>
    <div class="current-mode">
        <component :is="componentName" />
        <h4 class="current-mode-text">{{ MODES_TEXT[currentMode] }}</h4>
    </div>
</template>

<style scoped>

</style>