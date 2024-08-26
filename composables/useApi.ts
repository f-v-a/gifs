const getCurrentApiKey = () => useCookie('api_key');

export const currentApiKey = getCurrentApiKey();

export const getApiKeys = () => useState('giphyApiKeys').value;

export const initializeApiKeys = () => {
    const config = useRuntimeConfig();
    const apiKeys = useState('giphyApiKeys', () => config.public.API_KEYS.split(','));

    if (!currentApiKey.value) {
        currentApiKey.value = apiKeys.value[0];
    }
}

const changeApiKey = (key: string) => currentApiKey.value = key;

export const handleApiKeyChange = () => {
    let keysIterator = getApiKeys().values();

    return async (callback: () => Promise<any>) => {
        let key = keysIterator.next();

        if (key.done) {
            return;
        }

        changeApiKey(key.value);
        await callback();
    }
}
