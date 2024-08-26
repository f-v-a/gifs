<template>
    <FilterButtons @buttonClick="getMode" />
    <div class="container">
        <div class="search-input">
            <TextInput v-model.lazy="searchText" />
        </div>
    </div>
    <div class="gifs-container">
        <div
            v-if="items.length > 0"
            class="gif">
            <NuxtImg
                v-for="(gif, index) in items"
                :key="index"
                :src="gif.images.fixed_height.webp"
            />
        </div>
    </div>
    <Pagination
        v-if="pagination.pages"
        :pages="pagination.visible"
        :current-page="pagination.page.current"
        @prevPage="goToPreviousPage"
        @goTo="setPagination"
        @nextPage="goToNextPage" />
</template>

<script setup lang="ts">
import {ITEMS_PER_PAGE, VISIBLE_PAGES_COUNT} from "~/pages/config";

const route = useRoute();
const router = useRouter();

const {
    pagination,
    setPagination,
    nextPage,
    prevPage,
    resetPagination,
    clearPagination,
} = usePagination(VISIBLE_PAGES_COUNT, ITEMS_PER_PAGE);

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
} = useGifsFetch(currentMode);

const updateRouteQueryParams = (params = {}) => {
    router.replace({
        path: route.path,
        query: params,
    });
}

const setRouteQueryParams = () => {
    const textParam = currentMode.value === MODE.SEARCH ? {text: searchText.value} : {};
    const routeQueryParams = {...route.query, ...textParam, page: pagination.page.current};

    updateRouteQueryParams(routeQueryParams);
}

const getMode = (mode: string) => {
    switch (mode) {
        case MODE.RANDOM:
            getRandomGif();
            break;
        case MODE.TRENDING:
            if (currentMode.value === MODE.TRENDING) {
                break;
            }

            getTrendGifs();
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
        pagination.offset = (pagination.page.current - 1) * ITEMS_PER_PAGE;
    }
}

searchByRouteQuery();

watch(() => searchText.value, (newQuery) => {
    if (!searchText.value) {
        return;
    }

    getGifsByText({q: newQuery, limit: ITEMS_PER_PAGE, offset: 0});
});

watch(() => pagination.page.current, async () => {
    setRouteQueryParams();

    const {data} = await fetchData({q: searchText.value, limit: ITEMS_PER_PAGE, offset: pagination.offset});

    setPagination({total: data.value.pagination.total_count});
}, {deep: true, immediate: true});

</script>

<style scoped>

</style>