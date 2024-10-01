<template>
    <Content
        parent-class-names="main align-center"
        child-class-names="gifs-container"
        :items="items"
        @loaded="onImageLoad"
        @getData="getData"/>
</template>

<script setup lang="ts">
import {RATING} from "../components/rating/config.js";
import {ITEMS_PER_PAGE} from "./config";

const stateFetchOptions = useState('fetchOptions');

const {pagination, reset} = usePagination();
const {items, fetchData} = useFetchGIF();

watch(() => stateFetchOptions.value?.rating, reset);

const getData = () => {
    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    fetchData({
        limit: ITEMS_PER_PAGE,
        offset: pagination.offset,
        ...ratingOption,
    });

    pagination.offset += ITEMS_PER_PAGE;
}

const onImageLoad = (index: number) => items.value[index].isLoaded = true;

let observer = null;

// watch(() => observableItems.value, async (newValues) => {
//     await nextTick();
//
//     const newElements = newValues.slice(-ITEMS_PER_PAGE);
//
//     newElements.forEach((item) => observer.observe(item));
// }, {deep: true})

onMounted(async () => {
    // const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};
    //
    // await fetchData({
    //     limit: ITEMS_PER_PAGE,
    //     offset: pagination.offset,
    //     ...ratingOption,
    // });

    // pagination.offset += ITEMS_PER_PAGE;

    // getData();

    // observer = new IntersectionObserver((entries, observer) => {
    //     entries.forEach((entry) => {
    //         if (entry.isIntersecting) {
    //             // onImageLoad(entry.target.id);
    //             // entry.target.classList.remove('gif-hide');
    //         } else {
    //             // entry.target.firstElementChild.srcset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    //             // entry.target.classList.add('gif-hide');
    //             // entry.target.style.background = setupImageBackground(false).background;
    //         }
    //     });
    // }, {threshold: 0.75});
});
</script>

<style scoped>

</style>