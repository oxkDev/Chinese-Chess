<script setup lang="ts">
import { Settings } from '@/store';
import { ColourTheme } from '@/store/themes';
import { useStore } from 'vuex';

const settings: Settings = useStore().getters.settings;

defineProps<{
	theme: ColourTheme;
	selected?: boolean;
}>();

const emits = defineEmits<{
	(e: "click"): void,
}>();
</script>

<template>
	<button class="colour-theme-icon" :selected="selected"
		:onclick="() => { emits('click'); settings.vibrate([10, 200, 2]); }">
		<div class="sub"></div>
	</button>
</template>

<style scoped>
.colour-theme-icon {
	height: 35px;
	padding: 3px;
	aspect-ratio: 1;
	border-radius: 100%;
	background: v-bind("theme.primary");
	box-shadow: var(--default-shadow);
	outline: v-bind("theme.backgroundSecondary") solid 5px;
	outline-offset: -5px;
}

.colour-theme-icon::before {
	width: 50%;
	content: "";
	display: inline-block;
}

.colour-theme-icon[selected="true"] {
	transform: rotate(-90deg);
	box-shadow: var(--default-glow);
	outline: v-bind("theme.backgroundSecondary") solid 15px;
	outline-offset: -18px;
	pointer-events: none;
}

.sub {
	border-radius: 0 35px 35px 0;
	background: v-bind("theme.secondary");
	height: 100%;
	width: 50%;
	display: inline-block;
}

.colour-theme-icon[selected="false"]:hover {
	outline-width: 3px;
	outline-offset: -3px;
	transform: rotate(45deg);
}

.colour-theme-icon[selected="false"]:active {
	outline-width: 10px;
	outline-offset: -10px;
}

.v-enter-from .colour-theme-icon,
.v-leave-to .colour-theme-icon {
	outline-width: 1px;
	outline-offset: -1px;
	transform: rotate(90deg);
}

.v-leave-to .colour-theme-icon {
	transform: rotate(-90deg);
}
</style>