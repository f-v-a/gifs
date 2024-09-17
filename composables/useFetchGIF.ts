import {API_URL} from "~/helpers/constants";
import {MODE} from "~/composables/useMode";
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

export const useFetchGIF = (currentMode: Ref<Mode>) => {
    const items = ref<object[]>([]);
    const visibleItems = ref<object[]>([]);
    const searchText = ref<string>('');

    const tokensIterator = useTokens();
    const {createAbortController} = useAbortController();

    const fetchData = async (options?: FetchOptions) => {
        const abortController = createAbortController();

        const modeUpperCase = currentMode.value.toUpperCase() as keyof typeof MODE;
        const fetchOptions = {
            method: 'GET',
            baseURL: API_URL,
            query: {api_key: tokensIterator.cookieToken.value, ...options},
            signal: abortController.signal,
        };

        try {
            const data = await $fetch(MODE[modeUpperCase], fetchOptions);

            switch (currentMode.value) {
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