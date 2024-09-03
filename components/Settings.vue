<template>
    <div class="inputs-group">
        <label for="input-per_page">
            Гифок на странице
            <input
                id="input-per_page"
                type="number"
                :value="fetchOptions.itemsPerPage"
                @change.prevent="changeItemsCount">
        </label>
        <Rating
            :active-rating-index="fetchOptions.rating"
            @setRating="setRating"
        />
        <div class="settings-columns">
            <label for="columns-count">
                Количество столбцов
                <input
                    id="columns-count"
                    type="number"
                    :value="fetchOptions.columnsCount"
                    @input.prevent="changeColumnsCount">
            </label>
        </div>
<!--            <div class="settings-divider" />-->
    </div>
</template>

<script setup lang="ts">
import {useCookieManagement} from "../composables/useCookieManagement";

const {fetchOptions, setOption} = useCookieManagement();

const changeItemsCount = (event: Event) => {
    if (event.target.value > 50) {
        event.target.value = 50;
    }

    setOption({key: 'itemsPerPage', value: event.target.value});
};

const changeColumnsCount = (event: Event) => {
    if (event.target.value > 6) {
        event.target.value = 6;
    }

    setOption({key: 'columnsCount', value: event.target.value});
};

const setRating = (rating: string) => {
    setOption({key: 'rating', value: fetchOptions.value.rating === rating ? null : rating});
};
</script>

<style scoped>

</style>