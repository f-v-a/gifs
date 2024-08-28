<template>
    <input
        type="text"
        placeholder="Введите текст запроса"
        :value="modelValue"
        @change.prevent="onChange" />
</template>

<script setup lang="ts">
    const emit = defineEmits<{(e: 'update:modelValue', value: string): void}>();
    const props = defineProps({
        modelValue: {
            type: String,
            required: true,
        }
    });

    const onChange = (event: Event) => emit('update:modelValue', event.target.value);
</script>

<style scoped>

</style>