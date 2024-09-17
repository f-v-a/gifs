<template>
    <div class="inputs-group">
        <Rating
            :active-rating-index="fetchOptions.rating"
            @setRating="setRating"
        />
<!--            <div class="settings-divider" />-->
    </div>
</template>

<script setup lang="ts">
import {useCookieManagement} from "../composables/useCookieManagement";

const {fetchOptions, setOption} = useCookieManagement();

const setRating = (rating: string) => {
    setOption({key: 'rating', value: fetchOptions.value.rating === rating ? null : rating});
};
</script>

<style scoped>

</style>