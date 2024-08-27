<template>
    <div class="rating-container">
        <label>Контент</label>
        <ul class="rating-list">
            <li
                v-for="(rating, index) in RATING"
                :class="{'rating-item': true, active: index === activeRatingIndex}"
                :data-tooltip="rating.tooltip"
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

const setRating = (index: string) => emit('setRating', index);
</script>

<style scoped>

</style>