<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
import {useCookieManagement} from "./composables/useCookieManagement";

const {fetchOptions, setOption} = useCookieManagement();

const setDefaultSettings = () => {
    if (!fetchOptions.value?.rating) {
        setOption({key: 'rating', value: null});
    }
}

setDefaultSettings();
</script>
