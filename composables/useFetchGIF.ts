import {API_URL} from "~/helpers/constants";
import type {FetchOptions} from "~/helpers/types";
import {getTokenRefreshTime} from "~/helpers";
import {useTokens} from "./useTokens";

export const useFetchGIF = () => {
    const items = ref<object[]>([]);

    const {apiTokens, apiToken} = useTokens();
    const {getMode} = useMode();
    const {createAbortController} = useAbortController();

    const tokensIterator = apiTokens.value.values();

    const fetchData = async (options?: FetchOptions) => {
        if (!apiToken.value?.token) {
            return;
        }

        const currentMode = getMode();
        const abortController = createAbortController();

        const fetchOptions = {
            method: 'GET',
            baseURL: API_URL,
            query: {api_key: apiToken.value.token, ...options},
            signal: abortController.signal,
        };

        try {
            const data = await $fetch(MODE[currentMode], fetchOptions);

            switch (currentMode) {
                case MODE.random:
                    if (data.data) {
                        items.value = [data.data];
                    }

                    break;

                case MODE.search:
                case MODE.trending:
                    if (data.data) {
                        const gifs = data.data.map((item) => ({...item, isLoaded: false}));

                        items.value.push(...gifs);

                        return gifs;
                    }
            }

            return {
                data,
            }
        } catch (e) {
            if (e.response?.status === 429) {
                setValidToken(options);
            }

            if (e.response?.status === 414) {
                console.log('Слишком длинный запрос');
            }
        }
    }

    const setValidToken = (options?: FetchOptions) => {
        let key = tokensIterator.next();

        if (key.done) {
            console.log('Ключи для получения гиф на данный момент закончились');

            return;
        }

        if (!key.value.time) {
            apiToken.value = {token: key.value.token, time: getTokenRefreshTime().getTime()};
            key.value.time = getTokenRefreshTime().getTime();

            return fetchData(options);
        }

        const isTokenValid = key.value.time < new Date().getTime();

        if (isTokenValid) {
            apiToken.value = {token: key.value.token, time: null};
            key.value.time = getTokenRefreshTime().getTime();

            return fetchData(options);
        }

        setValidToken(options);
    }

    return {
        items,
        fetchData,
    }
}