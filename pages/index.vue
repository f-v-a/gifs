<template>
    <Menu
        :current-mode="currentMode"
        @changeMode="getMode"
    />
    <div class="main">
        <div class="container">
            <div class="search-wrapper">
                <div class="search-input">
                    <TextInput v-model="searchText" />
                </div>
            </div>
        </div>
        <div
            v-if="items.length > 0"
            :style="{'column-count': stateFetchOptions.columnsCount}"
            :class="{'gifs-container': true, random: isRandomMode}">
            <div
                v-for="(gif, index) in items"
                :key="index"
                class="gif">
                <NuxtImg :src="gif.images.original.webp" />
            </div>
        </div>
        <Pagination
            v-if="pagination.pages"
            :pages="pagination.visible"
            :current-page="pagination.page.current"
            @prevPage="goToPreviousPage"
            @goTo="setPagination"
            @nextPage="goToNextPage" />
    </div>
</template>

<script setup lang="ts">
import {VISIBLE_PAGES_COUNT} from "~/pages/config.js";
import {RATING} from "../components/rating/config.js";
import type {Mode} from "../helpers/types";

const route = useRoute();

const stateFetchOptions = useState('fetchOptions');

const {
    pagination,
    setPagination,
    nextPage,
    prevPage,
    resetPagination,
    clearPagination,
} = usePagination(VISIBLE_PAGES_COUNT, stateFetchOptions.value?.itemsPerPage);

const {
    currentMode,
    setRandomMode,
    setSearchMode,
    setTrendsMode,
} = useMode();

const {
    searchText,
    items,
    fetchData,
    clearText,
} = useFetchGIF(currentMode);

const isRandomMode = computed(() => currentMode.value === MODE.RANDOM);

const updateRouteQueryParams = async (params = {}) => {
    await navigateTo({
        path: route.path,
        query: params,
    });
}

const setRouteQueryParams = () => {
    const textParam = currentMode.value === MODE.SEARCH ? {text: searchText.value} : {};
    const routeQueryParams = {...route.query, ...textParam, page: pagination.page.current};

    updateRouteQueryParams(routeQueryParams);
}

const getMode = (mode: Mode) => {
    switch (mode) {
        case MODE.RANDOM:
            getRandomGif();
            break;
        case MODE.TRENDING:
            if (currentMode.value === mode) {
                break;
            }

            getTrendGifs();
            break;
        case MODE.SEARCH:
            setSearchMode();
            break;
    }
}

const getGifsByText = () => {
    setSearchMode();
    resetPagination();
}

const getRandomGif = () => {
    setRandomMode();
    updateRouteQueryParams();
    clearText();
    clearPagination();
    fetchData();
}

const getTrendGifs = () => {
    // TODO: сбросить параметр text
    setTrendsMode();
    resetPagination();
    clearText();
}

const goToNextPage = () => {
    nextPage();
    setRouteQueryParams();
}

const goToPreviousPage = () => {
    prevPage();
    setRouteQueryParams();
}

const searchByRouteQuery = () => {
    if (route.query.text) {
        searchText.value = route.query.text.toString();
    }

    if (route.query.page) {
        if (!route.query.text) {
            setTrendsMode();
        }

        pagination.page.current = Number(route.query.page);
        pagination.offset = (pagination.page.current - 1) * stateFetchOptions.value?.itemsPerPage;
    }
}

searchByRouteQuery();

watch(() => searchText.value, (newQuery) => {
    if (!searchText.value) {
        return;
    }

    getGifsByText();
});

watch(() => pagination.page.current, async () => {
    setRouteQueryParams();

    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    const data = await fetchData({
        q: searchText.value,
        limit: stateFetchOptions.value?.itemsPerPage,
        offset: pagination.offset,
        ...ratingOption,
    });

    setPagination({total: data.data.pagination.total_count});
}, {deep: true, immediate: true});

watch([() => stateFetchOptions.value?.itemsPerPage, () => stateFetchOptions.value?.rating], resetPagination);

</script>

<style scoped>

</style>