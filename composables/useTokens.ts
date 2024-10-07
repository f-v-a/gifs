export const useTokensState = () => useState('apiTokens');
export const useTokenState = () => useState('apiToken');

export const tokenCookie = useCookie('api_token');
export const tokensCookie = useCookie('api_tokens');

const useTokens = () => {
    const currentToken = computed({
        get() {
            return useTokenState().value;
        },
        set(value) {
            console.log(value)
            tokenCookie.value = value;
            useTokenState().value = value;
        }
    });

    return {
        currentToken,
    }
}

export {
    useTokens
}