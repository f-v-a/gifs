<script setup lang="ts">
const selectToken = () => {
    const config = useRuntimeConfig();

    const cookieToken = useCookie('api_token');
    const apiTokens = useState('apiTokens', () => config.public.API_KEYS.split(','));

    if (!cookieToken.value) {
        cookieToken.value = apiTokens.value[0];
    }
}

selectToken();
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
