<template>
    <div class="pagination">
        <ul class="pagination-list">
            <li
                class="pagination-list__item"
                @click.prevent="prevPage">PREV</li>
            <li
                v-for="page in pages"
                :key="page"
                @click.prevent="goTo(page)"
                :class="{'pagination-list__item': true, active: page === currentPage}">
                {{ page }}
            </li>
            <li
                class="pagination-list__item"
                @click.prevent="nextPage">NEXT</li>
        </ul>
    </div>
</template>

<script setup lang="ts">

interface IProps {
    pages: number[],
    currentPage: number,
}

interface IEmits {
    (e: 'prevPage'): void,
    (e: 'nextPage'): void,
    (e: 'goTo', value: {page: number})
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const prevPage = () => emit('prevPage');
const nextPage = () => emit('nextPage');
const goTo = (page: number) => emit('goTo', {page});
</script>

<style scoped>

</style>