export const usePagination = () => {
    const pagination = reactive({
        total: 0,
        offset: 0,
        visible: [],
    });

    const reset = () => {
        pagination.offset = 0;
    }

    return {
        pagination,
        reset,
    }
}