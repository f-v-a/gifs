<template>
    <div class="wrapper">
        <div class="header">
            <NuxtLink to="/">
                <div class="logo-container">
                    <h1 class="logo">
                        GIPHY
                        <span class="current-mode">{{ MODES_TEXT[getMode()] }}</span>
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
const {getMode} = useMode();
</script>

<style scoped>

</style>