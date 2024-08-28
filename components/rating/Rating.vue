<template>
    <div class="rating-container">
        <div class="rating-title">
            <label>Контент</label>
            <span
                class="more"
                @click.prevent="linkClickHandler">
                Подробнее
            </span>
        </div>
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

const router = useRouter();

defineProps({
    activeRatingIndex: {
        type: [String, null],
        required: false,
        default: null,
    }
});

const emit = defineEmits({setRating: null, closeSettings: null});

const setRating = (index: string) => emit('setRating', index);

const linkClickHandler = () => {
    emit('closeSettings');
    router.push('/content-rating');
};
</script>

<style scoped>

</style>