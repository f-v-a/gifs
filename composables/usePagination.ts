import {reactive} from 'vue';
import {PAGINATION_CENTER} from "~/pages/config";

export const usePagination = (visiblePagesCount: number, itemsPerPage: number) => {
    const pagination = reactive({
        page: {current: 1},
        pages: 0,
        total: 0,
        offset: 0,
        visible: [],
    });

    const nextPage = () => {
        if (pagination.page.current >= pagination.pages) {
            return;
        }

        pagination.offset += itemsPerPage;
        pagination.page.current++;
    };

    const prevPage = () => {
        if (pagination.page.current <= 1) {
            return;
        }

        pagination.offset -= itemsPerPage;
        pagination.page.current--;
    }

    const setPagination = ({total, page = 0}: {total?: number, page?: number}) => {
        if (total) {
            pagination.total = total;
            pagination.pages = Math.ceil(total / itemsPerPage);
        }

        if (page) {
            pagination.page.current = page;
            pagination.offset = (page * itemsPerPage) - itemsPerPage;
        }

        const pagesCount = pagination.pages > visiblePagesCount ? visiblePagesCount : pagination.pages;

        const maxStartPage = pagination.pages - PAGINATION_CENTER + 1;
        const currentOrMaxPage = pagination.page.current > maxStartPage ? maxStartPage : pagination.page.current;
        const finalPagePosition  = pagination.page.current <= PAGINATION_CENTER ? PAGINATION_CENTER : currentOrMaxPage;

        pagination.visible = Array.from({length: pagesCount}, (_, el) => finalPagePosition - (PAGINATION_CENTER - 1) + el);
    }

    const resetPagination = () => {
        pagination.page = {current: 1};
        pagination.offset = 0
    }

    const clearPagination = () => {
        pagination.pages = 0;
        pagination.visible = [];
    }

    return {
        pagination,
        nextPage,
        prevPage,
        setPagination,
        resetPagination,
        clearPagination,
    }
}