<template>
    <div class="wrapper">
        <div class="header">
            <NuxtLink to="/">
                <div class="logo-container">
                    <h1 class="logo">
                        GIPHY
                        <span class="current-mode">
                        {{ MODES_TEXT[mode] }}
                    </span>
                    </h1>
                </div>
            </NuxtLink>
            <Search />
        </div>
        <div class="sides-container">
            <slot />
        </div>
    </div>
</template>

<script setup>
const route = useRoute();

const mode = ref('');

watch(() => route.params.mode, (newValue) => {
    mode.value = newValue ?? MODE.TRENDING;
}, {immediate: true});
</script>

<style scoped>

</style>