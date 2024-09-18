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

const searchByText = (text: string) => {
    if (!text)
        return navigateTo('/');

    return navigateTo({
        path: `/${MODE.SEARCH}`,
        query: {text}
    });
}

</script>

<style scoped>

</style>