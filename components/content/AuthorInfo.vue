<template>
    <div class="author">
        <div class="author-image">
            <NuxtImg
                :src="item.avatar_url"
                loading="lazy"
            />
        </div>
        <span class="author-name">{{ item.username }}</span>
        <VerifySvg v-if="item.is_verified" />
    </div>
</template>

<script setup lang="ts">
type Author = {
    avatar_url: string,
    username: string,
    is_verified: boolean,
}

interface IProps {item: Author}

defineProps<IProps>();
</script>

<style scoped>

</style>