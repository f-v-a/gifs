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
            :class="{'gifs-container': true, random: isRandomMode}">
            <div
                ref="observableItems"
                v-for="(gif, index) in items"
                :key="index"
                :id="index"
                :data-src="gif.images.fixed_height.url"
                :class="['gif', gif.isLoaded ? 'gif-loaded' : 'gif-loading']"
                :style="{...setupImageBackground(gif.isLoaded), 'grid-column': gif.images.fixed_height.width >= 280 ? 'span 2' : 'span 1'}">
                <NuxtImg
                    :src="gif.images.fixed_height.url"
                    loading="lazy"
                />
            </div>
        </div>
        <div ref="scrollAnchor" :style="{height: '10px'}"/>
    </div>
</template>

<script setup lang="ts">
import {GIF_BACKGROUND_COLORS, VISIBLE_PAGES_COUNT} from "~/pages/config.js";
import {RATING} from "../components/rating/config.js";
import type {Mode} from "../helpers/types";

const route = useRoute();
const scrollAnchor = ref();
const observableItems = ref([]);

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

const setupImageBackground = (isLoaded: boolean) => {
    if (isLoaded) {
        return;
    }

    const index = Math.floor(Math.random() * GIF_BACKGROUND_COLORS.length);

    return {background: GIF_BACKGROUND_COLORS[index]};
}

const onImageLoad = (index: number) => items.value[index].isLoaded = true;

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

watch(() => searchText.value, (newQuery) => {
    if (!searchText.value) {
        return;
    }

    getGifsByText();
});

// watch(() => pagination.page.current, async () => {
//     setRouteQueryParams();
//
//     const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};
//
//     const data = await fetchData({
//         q: searchText.value,
//         limit: stateFetchOptions.value?.itemsPerPage,
//         offset: pagination.offset,
//         ...ratingOption,
//     });
//
//     setPagination({total: data.data.pagination.total_count});
// }, {deep: true, immediate: true});

watch([() => stateFetchOptions.value?.itemsPerPage, () => stateFetchOptions.value?.rating], resetPagination);

watch(() => currentMode.value, () => {
    items.value = [];
    pagination.offset = 0;

    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    fetchData({
        q: searchText.value,
        limit: stateFetchOptions.value?.itemsPerPage,
        offset: pagination.offset,
        ...ratingOption,
    });
});

const getData = () => {
    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    fetchData({
        q: searchText.value,
        limit: stateFetchOptions.value?.itemsPerPage,
        offset: pagination.offset,
        ...ratingOption,
    });

    const observer = new IntersectionObserver(async ([entry], observer) => {
        if (entry.isIntersecting) {
            pagination.offset += 20;
            pagination.page.current++;

            await fetchData({
                q: searchText.value,
                limit: stateFetchOptions.value?.itemsPerPage,
                offset: pagination.offset,
                ...ratingOption,
            });
        }

        // observer.unobserve(entry.target);
    }, {threshold: 0.5});

    observer.observe(scrollAnchor.value);
}

let observer = null;

watch(() => observableItems.value, (newItems) => {
    const newElements = newItems.slice(-stateFetchOptions.value?.itemsPerPage);

    newElements.forEach((item) => observer.observe(item));
}, {deep: true})

onMounted(() => {
    getData();

    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log(entry.target.dataset)
                onImageLoad(entry.target.id);
                entry.target.classList.remove('gif-hide');
            } else {
                entry.target.firstElementChild.srcset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                entry.target.classList.add('gif-hide');
                entry.target.style.background = setupImageBackground(false).background;
            }
        });
    }, {threshold: 0.75});
});

</script>

<style scoped>

</style>