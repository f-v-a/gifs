<template>
    <div class="main">
        <div
                v-if="items.length > 0"
                class="gifs-container">
            <div
                    ref="observableItems"
                    v-for="(gif, index) in items"
                    :key="index"
                    :id="index"
                    :data-src="gif.images.fixed_height.url"
                    :class="['gif', gif.isLoaded ? 'gif-loaded' : 'gif-loading']"
                    :style="{...setupImageBackground(gif.isLoaded), 'grid-column': gif.images.fixed_height.width >= 280 ? 'span 2' : 'span 1'}">
                <NuxtImg
                        :src="gif.images.original.webp"
                        loading="lazy"
                />
                <div
                        v-if="gif.user"
                        class="author">
                    <div class="author-image">
                        <NuxtImg
                                :src="gif.user.avatar_url"
                                loading="lazy"
                        />
                    </div>
                    <span class="author-name">{{ gif.user.username }}</span>
                    <VerifySvg v-if="gif.user?.is_verified" />
                </div>
            </div>
        </div>
        <div ref="scrollAnchor" :style="{height: '10px'}"/>
    </div>
</template>

<script setup lang="ts">
import {GIF_BACKGROUND_COLORS, ITEMS_PER_PAGE} from "./config";
import {RATING} from "../components/rating/config";

let observer = null;
const observableItems = ref([]);
const scrollAnchor = ref();

const route = useRoute();
const stateFetchOptions = useState('fetchOptions');
const {pagination, reset} = usePagination();

const {
    searchText,
    items,
    fetchData,
    clearText,
} = useFetchGIF();

const setupImageBackground = (isLoaded: boolean) => {
    if (isLoaded) {
        return;
    }

    const index = Math.floor(Math.random() * GIF_BACKGROUND_COLORS.length);

    return {background: GIF_BACKGROUND_COLORS[index]};
}

const onImageLoad = (index: number) => items.value[index].isLoaded = true;

watch(() => route.query.text, (text: string) => {
    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    fetchData({
        q: text,
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

    if (scrollAnchor.value) {
        observer.observe(scrollAnchor.value);
    }
}, {immediate: true});

watch(() => observableItems.value, (newItems) => {
    const newElements = newItems.slice(-ITEMS_PER_PAGE);

    newElements.forEach((item) => observer.observe(item));
}, {deep: true})

onMounted(() => {
    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
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