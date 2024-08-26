<script setup lang="ts">
const emit = defineEmits({buttonClick: null});

const buttonClickHandler = (mode: string) => emit('buttonClick', mode);
</script>

<template>
    <div class="tags">
        <button
            class="btn"
            @click.prevent="buttonClickHandler(MODE.RANDOM)">
            Random
        </button>
        <button
            class="btn"
            @click.prevent="buttonClickHandler(MODE.TRENDING)">
            Trends
        </button>
    </div>
</template>

<style scoped>

</style>