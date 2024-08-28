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
                :width="gif.images.fixed_height.width"
                :height="gif.images.fixed_height.height"
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
import {VISIBLE_PAGES_COUNT} from "~/pages/config";
import {RATING} from "../components/rating/config";

const route = useRoute();
const router = useRouter();

const stateFetchOptions = useState('fetchOptions');

const {
    pagination,
    setPagination,
    nextPage,
    prevPage,
    resetPagination,
    clearPagination,
} = usePagination(VISIBLE_PAGES_COUNT, stateFetchOptions.value.itemsPerPage);

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
            if (currentMode.value === mode) {
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
        pagination.offset = (pagination.page.current - 1) * stateFetchOptions.value.itemsPerPage;
    }
}

searchByRouteQuery();

watch(() => searchText.value, (newQuery) => {
    if (!searchText.value) {
        return;
    }

    getGifsByText({q: newQuery, limit: stateFetchOptions.value.itemsPerPage, offset: 0});
});

watch(() => pagination.page.current, async () => {
    setRouteQueryParams();

    const ratingOption = stateFetchOptions.value.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    const data = await fetchData({
        q: searchText.value,
        limit: stateFetchOptions.value.itemsPerPage,
        offset: pagination.offset,
        ...ratingOption,
    });

    setPagination({total: data.data.pagination.total_count});
}, {deep: true, immediate: true});

watch([() => stateFetchOptions.value.itemsPerPage, () => stateFetchOptions.value.rating], resetPagination);

</script>

<style scoped>

</style>