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
import {GIF_BACKGROUND_COLORS} from "~/pages/config.js";
import {RATING} from "../components/rating/config.js";
import type {Mode} from "../helpers/types";
import {ITEMS_PER_PAGE} from "./config";

const route = useRoute();
const scrollAnchor = ref();
const observableItems = ref([]);

const stateFetchOptions = useState('fetchOptions');

const {pagination, reset} = usePagination();

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
    reset();
}

const getRandomGif = () => {
    setRandomMode();
    clearText();
    reset();
    fetchData();
}

const getTrendGifs = () => {
    // TODO: сбросить параметр text
    setTrendsMode();
    reset();
    clearText();
}

watch(() => searchText.value, (newQuery) => {
    if (!searchText.value) {
        return;
    }

    getGifsByText();
});

watch(() => stateFetchOptions.value?.rating, reset);

watch(() => currentMode.value, () => {
    items.value = [];
    pagination.offset = 0;

    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    fetchData({
        q: searchText.value,
        limit: ITEMS_PER_PAGE,
        offset: pagination.offset,
        ...ratingOption,
    });
});

const getData = () => {
    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    fetchData({
        q: searchText.value,
        limit: ITEMS_PER_PAGE,
        offset: pagination.offset,
        ...ratingOption,
    });

    const observer = new IntersectionObserver(async ([entry], observer) => {
        if (entry.isIntersecting) {
            pagination.offset += 20;

            await fetchData({
                q: searchText.value,
                limit: ITEMS_PER_PAGE,
                offset: pagination.offset,
                ...ratingOption,
            });
        }

    }, {threshold: 0.5, rootMargin: '0px 0px 200px 0px'});

    observer.observe(scrollAnchor.value);
}

let observer = null;

watch(() => observableItems.value, (newItems) => {
    const newElements = newItems.slice(-ITEMS_PER_PAGE);

    newElements.forEach((item) => observer.observe(item));
}, {deep: true})

onMounted(() => {
    getData();

    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log(entry.target.id)
                onImageLoad(entry.target.id);
                entry.target.classList.remove('gif-hide');
            } else {
                // entry.target.firstElementChild.srcset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                entry.target.classList.add('gif-hide');
                entry.target.style.background = setupImageBackground(false).background;
            }
        });
    }, {threshold: 0.75});
});

</script>

<style scoped>

</style>