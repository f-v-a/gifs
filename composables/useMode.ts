

export const MODE = Object.freeze({
    TRENDING: 'trending',
    RANDOM: 'random',
    SEARCH: 'search',
});

export const MODES_TEXT = Object.freeze({
    [MODE.TRENDING]: 'Тренды',
    [MODE.RANDOM]: 'Случайная подборка',
    [MODE.SEARCH]: 'Глобальный поиск',
});

export const useMode = () => {
    const route = useRoute();

    const getMode = () => route.path === '/' ? MODE.TRENDING : route.name;
    const setTrendsMode = () => navigateTo('/');
    const setSearchMode = (text: string) => navigateTo({path: `/${MODE.SEARCH}`, query: {text}});

    return {
        getMode,
        setTrendsMode,
        setSearchMode,
    }
}