

export const MODE = Object.freeze({
    trending: 'trending',
    random: 'random',
    search: 'search',
});

export const MODES_TEXT = Object.freeze({
    [MODE.trending]: 'Тренды',
    [MODE.random]: 'Случайная подборка',
    [MODE.search]: 'Глобальный поиск',
});

export const useMode = () => {
    const route = useRoute();

    const getMode = () => route.path === '/' ? MODE.trending : route.name;
    const setTrendsMode = () => navigateTo('/');
    const setSearchMode = (text: string) => navigateTo({path: `/${MODE.search}`, query: {text}});

    return {
        getMode,
        setTrendsMode,
        setSearchMode,
    }
}