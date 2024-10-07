const showOrHide = () => {
    const isOpen = ref(false);

    const open = () => isOpen.value = true;
    const close = () => isOpen.value = false;
    const openOrClose = () => isOpen.value = !isOpen.value;

    return {
        isOpen,
        open,
        close,
        openOrClose,
    }
}

const getTokenRefreshTime = () => {
    const date = new Date();

    date.setHours(date.getHours() + 1);
    date.setMinutes(0, 0, 0);

    return date;
}

export {
    showOrHide,
    getTokenRefreshTime,
}