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
                :styles="{
                    'grid-row-end': item.images.original.height > item.images.original.width ? 'span 17' : 'span 13',
                    'grid-column-end': item.images.fixed_height.width >= 275 ? 'span 2' : 'span 1'
                }"
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
import {ITEMS_PER_PAGE} from "./config";
import {RATING} from "../components/rating/config";

let observer = null;

const observableItems = ref([]);
const scrollAnchor = ref();

const route = useRoute();
const stateFetchOptions = useState('fetchOptions');
const {pagination} = usePagination();

const {
    items,
    fetchData,
} = useFetchGIF();

const onImageLoad = (index: number) => items.value[index].isLoaded = true;

watch(() => route.query.text, (text: string) => {
    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    fetchData({
        q: text,
        limit: ITEMS_PER_PAGE,
        offset: pagination.offset,
        ...ratingOption,
    });
}, {immediate: true});

watch(() => observableItems.value, (newItems) => {
    const newElements = newItems.slice(-ITEMS_PER_PAGE);

    newElements.forEach((item) => observer.observe(item));
}, {deep: true})

onMounted(() => {
    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    const observer2 = new IntersectionObserver(async ([entry]) => {
        if (entry.isIntersecting) {
            await fetchData({
                q: route.query?.text,
                limit: ITEMS_PER_PAGE,
                offset: pagination.offset,
                ...ratingOption,
            });

            pagination.offset += ITEMS_PER_PAGE;
        }

    }, {threshold: 0.5, rootMargin: '0px 0px 200px 0px'});

    observer2.observe(scrollAnchor.value);

    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // onImageLoad(entry.target.id);
                // entry.target.classList.remove('gif-hide');
            } else {
                // entry.target.firstElementChild.srcset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                // entry.target.classList.add('gif-hide');
                // entry.target.style.background = setupImageBackground(false).background;
            }
        });
    }, {threshold: 0.75});
});
</script>

<style scoped>

</style>