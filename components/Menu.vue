<template>
    <div class="modes-menu">
        <ul class="menu-list">
            <li
                v-for="mode in MODE"
                :key="mode"
                class="menu-item"
                @click.prevent="changeMode(mode)">
                <span :class="[currentMode === mode ? 'link--active' : 'link link--eirene']">
                    {{ MODES_TEXT[mode] }}
                </span>
            </li>
        </ul>
        <div class="settings-item">
            <span
                class="link link--eirene"
                @click.prevent="openOrClose">Настройки</span>
            <Settings v-if="isOpen" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {MODE} from "~/composables/useMode";
import {MODES_TEXT} from "../composables/useMode";

import {showOrHide} from "../helpers/index";
import type {Mode} from "../helpers/types";

interface IProps {currentMode: Mode}
interface IEmits {(e: 'changeMode', value: string): void}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const {isOpen, openOrClose} = showOrHide();
const changeMode = (mode: Mode) => emit('changeMode', mode);
</script>

<style scoped>

</style>