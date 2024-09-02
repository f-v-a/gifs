<template>
    <input
        type="text"
        placeholder="Введите текст запроса"
        :value="modelValue"
        @change.prevent="onChange" />
</template>

<script setup lang="ts">
interface IProps {modelValue: string}
interface IEmits {(e: 'update:modelValue', value: string)}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const onChange = (event: Event) => emit('update:modelValue', event.target.value);
</script>

<style scoped>

</style>