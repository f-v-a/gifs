<template>
    <div :class="parentClassNames">
        <div :class="childClassNames">
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
interface IProps {items: object[], parentClassNames: string[] | string, childClassNames?: string[] | string}
interface IEmits {(e: 'loaded', value: number), (e: 'getData')}

defineProps<IProps>();
const emit = defineEmits<IEmits>();

const observableItems = ref([]);
const scrollAnchor = ref();

const onImageLoad = (index: number) => emit('loaded', index);

onMounted(() => {
    const observer = new IntersectionObserver(async ([entry]) => {
        if (entry.isIntersecting) {
            emit('getData');
        }

    }, {threshold: 0.5, rootMargin: '0px 0px 200px 0px'});

    observer.observe(scrollAnchor.value);
});
</script>

<style scoped>

</style>