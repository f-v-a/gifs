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

export {
    showOrHide,
}