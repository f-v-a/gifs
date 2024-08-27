<template>
    <div class="rating-container">
        <ul class="rating-list">
            <li
                v-for="(rating, index) in RATING"
                :class="{'rating-item': true, active: index === activeRatingIndex}"
                @click.prevent="setRating(index)">
                {{ rating.name }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {RATING} from "./config";

defineProps({
    activeRatingIndex: {
        type: [String, null],
        required: false,
        default: null,
    }
});

const emit = defineEmits({setRating: null});

const setRating = (index: number) => emit('setRating', index);
</script>

<style scoped>

</style>