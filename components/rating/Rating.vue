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

interface IProps {activeRatingIndex: string | null}
interface IEmits {(e: 'setRating', value: string): void}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const setRating = (rating: string) => emit('setRating', rating);
const linkClickHandler = async () => await navigateTo('/content-rating');
</script>

<style scoped>

</style>