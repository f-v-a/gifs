import {API_URL} from "~/helpers/constants";
import type {FetchOptions} from "~/helpers/types";
import {GIF_BACKGROUND_COLORS} from "../pages/config";
import {getTokenRefreshTime} from "../helpers/index";
import {useTokens, useTokensState} from "./useTokens";

// const useTokens = () => {
//     const apiToken = useState('apiToken');
//     const apiTokens = useState('apiTokens');
//     const cookieToken = useCookie('api_token');
//
//     return {
//         apiToken,
//         cookieToken,
//         values: apiTokens.value.values(),
//     };
// }

export const useFetchGIF = () => {
    const items = ref<object[]>([]);
    const visibleItems = ref<object[]>([]);

    const {currentToken} = useTokens();
    const {getMode} = useMode();
    const {createAbortController} = useAbortController();

    const iterator = useTokensState().value.values();

    const fetchData = async (options?: FetchOptions) => {
        if (!currentToken.value.token) {
            return;
        }

        const currentMode = getMode();

        const abortController = createAbortController();
        const modeUpperCase = currentMode.toUpperCase() as keyof typeof MODE;

        const fetchOptions = {
            method: 'GET',
            baseURL: API_URL,
            query: {api_key: currentToken.value.token, ...options},
            signal: abortController.signal,
        };

        try {
            const data = await $fetch(MODE[modeUpperCase], fetchOptions);

            switch (currentMode) {
                case MODE.RANDOM:
                    if (data.data) {
                        items.value = [data.data];
                    }

                    break;

                case MODE.SEARCH:
                case MODE.TRENDING:
                    if (data.data) {
                        const gifs = data.data.map((item) => ({
                            ...item,
                            isLoaded: false,
                            background: GIF_BACKGROUND_COLORS[Math.floor(Math.random() * GIF_BACKGROUND_COLORS.length)]
                        }));

                        Array.prototype.push.apply(items.value, gifs);

                        return gifs;
                    }
            }

            return {
                data,
            }
        } catch (e) {
            if (e.response?.status === 429) {
                setValidToken(options)
            }

            if (e.response?.status === 414) {
                console.log('Слишком длинный запрос');
            }
        }
    }

    const setValidToken = (options?: FetchOptions) => {
        let key = iterator.next();

        if (key.done) {
            console.log('Ключи для получения гиф на данный момент закончились');

            return;
        }

        if (!key.value.time) {
            currentToken.value = {token: key.value.token, time: getTokenRefreshTime().getTime()};
            key.value.time = getTokenRefreshTime().getTime();

            return fetchData(options);
        }

        const isTokenValid = key.value.time < new Date().getTime();

        if (isTokenValid) {
            currentToken.value = {token: key.value.token, time: null};
            key.value.time = getTokenRefreshTime().getTime();

            return fetchData(options);
        }

        setValidToken(options);
    }

    return {
        items,
        visibleItems,
        fetchData,
    }
}