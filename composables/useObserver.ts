const createObserver = (callback: (data: IntersectionObserverEntry) => void, options = {}) => {
    return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback(entry);
            }
        })
    }, options);
}

export {
    createObserver,
}