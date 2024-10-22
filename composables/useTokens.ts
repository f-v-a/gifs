import {getTokenRefreshTime} from "~/helpers";

const useTokens = () => {
    const apiTokens = useState('apiTokens', () => {
        const config = useRuntimeConfig();

        const tokensCookie = useCookie('api_tokens', {
            default: () => {
                const tokens = config.public.API_KEYS.split(',');

                return tokens.reduce((acc, curr) => curr ? [...acc, {token: curr, time: null}] : acc, []);
            }
        });

        return tokensCookie.value;
    });

    const apiToken = useState('apiToken', () => {
        const tokenCookie = useCookie('api_token', {
            default: () => {
                return apiTokens.value.find((token) => !token.time || token.time < new Date().getTime()) ?? null;
            }
        });

        return tokenCookie.value;
    })

    const setValidToken = () => {
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
    // const currentToken = computed({
    //     get() {
    //         return useTokenState().value;
    //    3 },
    //     set(value) {
    //         console.log(value)
    //         tokenCookie.value = value;
    //         useTokenState().value = value;
    //     }
    // });

    return {
        apiTokens,
        apiToken,
        // currentToken,
    }
}

export {
    useTokens
}