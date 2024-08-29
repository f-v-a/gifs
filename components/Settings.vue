<template>
    <div
        v-click-outside="closeSettings"
        class="settings-container">
        <div
            class="settings-icon"
            @click.prevent="showOrHideSettings">
            <SettingsSvg />
        </div>
        <div
            v-if="isShowSettings"
            class="inputs-group">
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
                @closeSettings="closeSettings"
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
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {ITEMS_PER_PAGE} from "../pages/config";

const isShowSettings = ref(false);

const cookieStateOptions = useCookie('fetchOptions');
const stateFetchOptions = useState('fetchOptions', () => cookieStateOptions.value);

const fetchOptions = computed({
    get: () => stateFetchOptions.value,
    set: ({key, value}) => {
        cookieStateOptions.value = {...cookieStateOptions.value, [key]: value};
        stateFetchOptions.value = {...stateFetchOptions.value, [key]: value};
    }
});

const showOrHideSettings = () => isShowSettings.value = !isShowSettings.value;
const closeSettings = () => isShowSettings.value = false;

const changeItemsCount = (event: Event) => {
    if (event.target.value > 50) {
        event.target.value = 50;
    }

    fetchOptions.value = {key: 'itemsPerPage', value: event.target.value};
};

const changeColumnsCount = (event: Event) => {
    if (event.target.value > 6) {
        event.target.value = 6;
    }

    fetchOptions.value = {key: 'columnsCount', value: event.target.value};
};

const setRating = (index) => {
    fetchOptions.value = {key: 'rating', value: fetchOptions.value.rating === index ? null : index};
};

if (!fetchOptions.value?.itemsPerPage) {
    fetchOptions.value = {key: 'itemsPerPage', value: ITEMS_PER_PAGE};
}

if (!fetchOptions.value?.rating) {
    fetchOptions.value = {key: 'rating', value: null};
}

if (!fetchOptions.value?.columnsCount) {
    fetchOptions.value = {key: 'columnsCount', value: 4};
}
</script>

<style scoped>

</style>