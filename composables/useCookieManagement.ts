import {computed} from "vue";

type Option = {
    key: string,
    value: string,
}

export const useCookieManagement = () => {
    const cookieStateOptions = useCookie('fetchOptions');
    const stateFetchOptions = useState('fetchOptions', () => cookieStateOptions.value);

    const fetchOptions = computed({
        get: () => stateFetchOptions.value,
        set: ({key, value}: Option) => {
            cookieStateOptions.value = {...cookieStateOptions.value, [key]: value};
            stateFetchOptions.value = {...stateFetchOptions.value, [key]: value};
        }
    });

    const setOption = (data: Option) => {
        fetchOptions.value = {key: data.key, value: data.value}
    }

    return {
        fetchOptions,
        setOption
    }
}