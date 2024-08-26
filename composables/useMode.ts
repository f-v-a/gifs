import {ref} from "vue";
import type {Mode} from "~/helpers/types";

export const MODE = Object.freeze({
    TRENDING: 'trending',
    RANDOM: 'random',
    SEARCH: 'search',
});

export const useMode = () => {
    const currentMode = ref<Mode>(MODE.SEARCH);

    const setTrendsMode = () => currentMode.value = MODE.TRENDING;
    const setRandomMode = () => currentMode.value = MODE.RANDOM;
    const setSearchMode = () => currentMode.value = MODE.SEARCH;

    return {
        currentMode,
        setTrendsMode,
        setRandomMode,
        setSearchMode,
    }
}