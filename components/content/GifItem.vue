<template>
    <div
        :id="id"
        :class="classNames"
        :style="styles">
        <NuxtImg
            :src="item.images.original.webp"
            loading="lazy"
            @load="onImageLoad(id)"
        />
        <slot />
    </div>
</template>

<script setup lang="ts">
interface IProps {id: number | string, item: object, classNames?: string[] | string, styles?: object}
interface IEmits {(e: 'loaded', value: number)}

defineProps<IProps>();

const emit = defineEmits<IEmits>();
const onImageLoad = (index: number) => emit('loaded', index);
</script>

<style scoped>

</style>