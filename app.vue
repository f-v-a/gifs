<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
import {useCookieManagement} from "./composables/useCookieManagement";
import {tokenCookie, tokensCookie} from "./composables/useTokens";

const {fetchOptions, setOption} = useCookieManagement();

const selectToken = () => {
    const config = useRuntimeConfig();

    const apiTokens = useState('apiTokens', () => {
        const tokensFromCookie = tokensCookie.value;

        if (tokensFromCookie)
            return tokensFromCookie;

        const tokens = config.public.API_KEYS.split(',');

        tokensCookie.value = tokens.reduce((acc, curr) => curr ? [...acc, {token: curr, time: null}] : acc, []);

        return tokensCookie.value;
    });

    useState('apiToken', () => {
        const availableToken = apiTokens.value.find((token) => !token.time || token.time < new Date().getTime()) ?? null;

        tokenCookie.value = availableToken;

        return availableToken;
    });
}

const setDefaultSettings = () => {
    if (!fetchOptions.value?.rating) {
        setOption({key: 'rating', value: null});
    }
}

selectToken();
setDefaultSettings();
</script>
