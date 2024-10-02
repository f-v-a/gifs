<template>
    <div class="main align-center">
        <div class="gifs-container">
            <GifItem
                ref="observableItems"
                v-for="(item, index) in items"
                :key="index"
                :id="index"
                :item="item"
                :class-names="['gif', item.isLoaded ? 'gif-loaded' : 'gif-loading']"
                :styles="{'grid-column': item.images.fixed_height.width >= 280 ? 'span 2' : 'span 1'}"
                @loaded="onImageLoad">
                <AuthorInfo
                    v-if="item.user"
                    :item="item.user" />
            </GifItem>
        </div>
        <div ref="scrollAnchor" :style="{height: '10px'}"/>
    </div>
</template>

<script setup lang="ts">
import {RATING} from "../components/rating/config.js";
import {ITEMS_PER_PAGE} from "./config";
import {createObserver} from "../composables/useObserver";

const scrollAnchor = ref();
const observableItems = ref([]);
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

onMounted(() => {
    // const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};
    //
    // await fetchData({
    //     limit: ITEMS_PER_PAGE,
    //     offset: pagination.offset,
    //     ...ratingOption,
    // });

    // pagination.offset += ITEMS_PER_PAGE;

    const observer = createObserver(getData, {threshold: 0.5, rootMargin: '0px 0px 200px 0px'});
    observer.observe(scrollAnchor.value);

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