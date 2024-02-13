<script setup lang="ts">
import { ColourTheme } from '@/store/colour themes';

defineProps<{
	theme: ColourTheme;
	selected?: boolean;
}>();

const emits = defineEmits<{
	(e: "click"): void,
}>();
</script>

<template>
	<button class="main" :selected="selected" :onclick="() => emits('click')">
		<div class="sub"></div>
	</button>
</template>

<style scoped>
.main {
	height: 35px;
	padding: 3px;
	aspect-ratio: 1;
	border-radius: 50%;
	background: v-bind("theme.primary");
	box-shadow: var(--default-shadow);
	outline: v-bind("theme.backgroundSecondary") solid 5px;
	outline-offset: -5px;
}

.main::before {
	width: 50%;
	content: "";
	display: inline-block;
}

.main[selected="true"] {
	transform: rotate(-90deg);
	box-shadow: var(--default-glow);
	outline: v-bind("theme.backgroundSecondary") solid 15px;
	outline-offset: -18px;
}

.sub {
	border-radius: 0 35px 35px 0;
	background: v-bind("theme.secondary");
	height: 100%;
	width: 50%;
	display: inline-block;
}
</style>