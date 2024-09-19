import {API_URL} from "~/helpers/constants";
import type {FetchOptions, Mode} from "~/helpers/types";
import {ref, type Ref} from "vue";

const useTokens = () => {
    const apiTokens = useState('apiTokens');
    const cookieToken = useCookie('api_token');

    return {
        cookieToken,
        values: apiTokens.value.values(),
    };
}

export const useFetchGIF = () => {
    const items = ref<object[]>([]);
    const visibleItems = ref<object[]>([]);
    const searchText = ref<string>('');

    const tokensIterator = useTokens();
    const {getMode} = useMode();
    const {createAbortController} = useAbortController();

    const fetchData = async (options?: FetchOptions) => {
        const currentMode = getMode();

        const abortController = createAbortController();
        const modeUpperCase = currentMode.toUpperCase() as keyof typeof MODE;

        const fetchOptions = {
            method: 'GET',
            baseURL: API_URL,
            query: {api_key: tokensIterator.cookieToken.value, ...options},
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
                        items.value.push(...data.data.map((item) => ({...item, isLoaded: false})));
                    }
            }

            return {
                data,
            }
        } catch (e) {
            if (e.response?.status === 429) {
                let key = tokensIterator.values.next();

                if (key.done) {
                    return;
                }

                tokensIterator.cookieToken.value = key.value;

                await fetchData(options);
            }
        }
    }

    const clearText = () => searchText.value = '';

    return {
        searchText,
        items,
        visibleItems,
        fetchData,
        clearText,
    }
}