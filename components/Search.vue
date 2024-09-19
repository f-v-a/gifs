<template>
    <div class="search-container">
        <div class="search-input">
            <TextInput
                placeholder="Введите текст запроса"
                :modelValue="route.query?.text ?? ''"
                @update:modelValue="searchByText" />
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

const {setSearchMode, setTrendsMode} = useMode();

const searchByText = (text: string) => {
    if (!text)
        return setTrendsMode();

    return setSearchMode(text);
}
</script>

<style scoped>

</style>