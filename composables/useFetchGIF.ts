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
    const searchText = ref<string>('');

    const tokensIterator = useTokens();
    const {createAbortController} = useAbortController();

    const fetchData = async (options?: FetchOptions) => {
        const abortController = createAbortController();

        const modeUpperCase = currentMode.value.toUpperCase() as keyof typeof MODE;
        const fetchOptions = {
            baseURL: API_URL,
            query: {api_key: tokensIterator.cookieToken.value, ...options},
            signal: abortController.signal,
        };

        try {
            const {status, data, error} = await useFetch(MODE[modeUpperCase], fetchOptions);

            if (error.value) {
                throw error.value.statusCode;
            }

            switch (currentMode.value) {
                case MODE.RANDOM:
                    if (data.value) {
                        items.value = [data.value.data];
                    }

                    break;

                case MODE.SEARCH:
                case MODE.TRENDING:
                    if (data.value) {
                        items.value = data.value.data;
                    }
            }

            return {
                status,
                data,
            }
        } catch (statusCode) {
            if (statusCode === 429) {
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
        fetchData,
        clearText,
    }
}