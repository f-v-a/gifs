import {DirectiveBinding} from "vue";

export default defineNuxtPlugin((app) => {
    app.vueApp.directive('clickOutside', {
        mounted (el: HTMLElement, binding: DirectiveBinding) {
            el.clickOutsideEvent = (event: Event) => {
                if (!(el == event.target || el.contains(event.target as Node))) {
                    binding.value(event, el);
                }
            }

            document.addEventListener('click', el.clickOutsideEvent)
        },
        unmounted (el: HTMLElement) {
            document.removeEventListener('click', el.clickOutsideEvent)
        },
    });
})