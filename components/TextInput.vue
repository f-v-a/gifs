<template>
    <input
        type="text"
        :placeholder="placeholder"
        :value="modelValue"
        @change.prevent="onChange" />
</template>

<script setup lang="ts">
interface IProps {modelValue: string, placeholder: string}
interface IEmits {(e: 'update:modelValue', value: string)}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const onChange = (event: Event) => {
    event.target.value = event.target.value.trim();

    emit('update:modelValue', event.target.value)
};
</script>

<style scoped>

</style>