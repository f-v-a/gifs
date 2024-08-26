import {API_URL} from "~/helpers/constants";
import {MODE} from "~/composables/useMode";
import type {FetchOptions, Mode} from "~/helpers/types";
import {ref, type Ref} from "vue";
import {currentApiKey, handleApiKeyChange} from "./useApi";

export const useGifsFetch = (currentMode: Ref<Mode>) => {
    const items = ref<object[]>([]);
    const searchText = ref<string>('');

    const tryAnotherKey = handleApiKeyChange();
    const {createAbortController} = useAbortController();

    const fetchData = async (options?: FetchOptions) => {
        const abortController = createAbortController();

        const modeUpperCase = currentMode.value.toUpperCase() as keyof typeof MODE;
        const fetchOptions = {
            baseURL: API_URL,
            query: {api_key: currentApiKey.value, ...options},
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
                await tryAnotherKey(() => fetchData(options));
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