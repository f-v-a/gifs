<template>
    <div class="main align-center">
        <div
            v-if="items.length > 0"
            class="gifs-container">
            <div
                ref="observableItems"
                v-for="(gif, index) in items"
                :key="index"
                :id="index"
                :class="['gif', gif.isLoaded ? 'gif-loaded' : 'gif-loading']"
                :style="{background: gif.background, 'grid-column': gif.images.fixed_height.width >= 280 ? 'span 2' : 'span 1'}">
                <NuxtImg
                    :src="gif.images.original.webp"
                    loading="lazy"
                    @load="onImageLoad(index)"
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
            <div ref="scrollAnchor" :style="{height: '10px'}"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {RATING} from "../components/rating/config.js";
import {ITEMS_PER_PAGE} from "./config";

const route = useRoute();
const scrollAnchor = ref();
const observableItems = ref([]);

const stateFetchOptions = useState('fetchOptions');

const {pagination, reset} = usePagination();
const {items, fetchData} = useFetchGIF();

const onImageLoad = (index: number) => items.value[index].isLoaded = true;

watch(() => stateFetchOptions.value?.rating, reset);

const getData = () => {
    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            fetchData({
                limit: ITEMS_PER_PAGE,
                offset: pagination.offset,
                ...ratingOption,
            });

            pagination.offset += ITEMS_PER_PAGE;
        }
    }, {threshold: 0.5, rootMargin: '0px 0px 200px 0px'});

    observer.observe(scrollAnchor.value);
}

let observer = null;

watch(() => observableItems.value, async (newValues) => {
    await nextTick();

    const newElements = newValues.slice(-ITEMS_PER_PAGE);

    newElements.forEach((item) => observer.observe(item));
}, {deep: true})

onMounted(async () => {
    const ratingOption = stateFetchOptions.value?.rating ? {rating: RATING[stateFetchOptions.value.rating].param} : {};

    await fetchData({
        limit: ITEMS_PER_PAGE,
        offset: pagination.offset,
        ...ratingOption,
    });

    pagination.offset += ITEMS_PER_PAGE;

    getData();

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