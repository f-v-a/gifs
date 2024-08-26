<script setup lang="ts">
defineProps({
     pages: {
         type: Array,
         required: false,
         default: () => []
     },
     currentPage: {
         type: Number,
         required: false,
         default: 1,
     }
});

const emit = defineEmits({
    prevPage: null,
    goTo: null,
    nextPage: null,
});

const prevPage = () => emit('prevPage');
const goTo = (page: number) => emit('goTo', {page});
const nextPage = () => emit('nextPage');
</script>

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

<style scoped>

</style>