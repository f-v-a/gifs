<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
import {useCookieManagement} from "./composables/useCookieManagement";
import {ITEMS_PER_PAGE} from "./pages/config";

const {fetchOptions, setOption} = useCookieManagement();

const selectToken = () => {
    const config = useRuntimeConfig();
    const cookieToken = useCookie('api_token');

    const apiTokens = useState('apiTokens', () => config.public.API_KEYS.split(','));

    if (!cookieToken.value) {
        cookieToken.value = apiTokens.value[0];
    }
}

const setDefaultSettings = () => {
    if (!fetchOptions.value?.itemsPerPage) {
        setOption({key: 'itemsPerPage', value: ITEMS_PER_PAGE});
    }

    if (!fetchOptions.value?.rating) {
        setOption({key: 'rating', value: null});
    }

    if (!fetchOptions.value?.columnsCount) {
        setOption({key: 'columnsCount', value: 4});
    }
}

selectToken();
setDefaultSettings();
</script>
