export const useAbortController = () => {
    let abortController: AbortController | null = null;

    const createAbortController = () => {
        if (abortController) {
            abortController.abort();
        }

        abortController = new AbortController();

        return abortController;
    };

    const abort = () => {
        if (abortController) {
            abortController.abort();
        }
    };

    return {
        createAbortController,
        signal: abortController?.signal,
        abort,
    };
}