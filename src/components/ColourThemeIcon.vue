<script setup lang="ts">
import { ColourTheme } from '@/store/themes';
import { useUserStore } from '@/store';

const userStore = useUserStore();

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
		:onclick="() => { emits('click'); userStore.feedback([10, 200, 2]); }">
		<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="theme-icon-svg">
			<circle cx="16" cy="16" r="16" :fill="theme.primary" class="theme-icon-background" />
			<path d="M16 3V3C23.1797 3 29 8.8203 29 16V16C29 23.1797 23.1797 29 16 29V29V3Z" :fill="theme.secondary" />
			<circle cx="16" cy="16" r="13.5" stroke-width="5" :stroke="theme.backgroundSecondary"
				class="theme-icon-outline" />
		</svg>
	</button>
</template>

<style scoped>
.colour-theme-icon {
	height: 35px;
	aspect-ratio: 1;
	border-radius: 100%;
	background: none;
	box-shadow: var(--default-shadow);
}

.colour-theme-icon[selected="true"] {
	box-shadow: var(--default-glow);
	pointer-events: none;

	&>.theme-icon-svg {
		transform: rotate(-90deg);
	}

	circle.theme-icon-outline {
		stroke-width: 13px;
		r: 6.5px;
	}
}

.colour-theme-icon[selected="false"]:hover>.theme-icon-svg {
	transform: rotate(45deg);
}

.colour-theme-icon[selected="false"]:hover circle.theme-icon-outline {
	r: 15px;
}

.colour-theme-icon[selected="false"]:active circle.theme-icon-outline {
	r: 12px;
	stroke-width: 8px;
}

.v-enter-from,
.v-leave-to {

	.colour-theme-icon {
		transform: rotate(90deg) scale(.9);
	}

	.colour-theme-icon circle.theme-icon-outline {
		r: 15px;
		stroke-width: 5px;
	}
}

.v-leave-to .colour-theme-icon {
	transform: rotate(-90deg) scale(.9);
}
</style>