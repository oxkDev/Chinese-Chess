<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

defineProps<{
	name?: string,
	type?: "email" | "number" | "password" | "text",
	inputMode?: "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined,
}>();

const emits = defineEmits<{
	(e: "update", value: string): void,
}>();

const input = ref();

onMounted(() => {
	input.value.addEventListener("focusout", () => {
		input.value.toggleAttribute("hasValue", input.value.value != "");
		userStore.feedback();
	});
	input.value.addEventListener("input", () => {
		emits("update", input.value.value);
		input.value.toggleAttribute("hasValue", input.value.value != "");
	});
	input.value.addEventListener("focusin", userStore.feedback);
});
</script>

<template>
	<div class="text-input">
		<input :inputmode="inputMode ? inputMode : 'text'" :type="type ? type : 'text'" ref="input">
		<label class="input-label">
			<h2 class="input-title">
				<slot></slot>
			</h2>
		</label>
	</div>
</template>

<style scoped>
.text-input {
	height: 40px;
	width: 100%;
	max-width: 300px;
	/* padding: 5px 10px; */
	margin: 10px 0;
	border-radius: 15px;
	overflow: visible;
	position: relative;
	background: var(--translucent);
	box-shadow: var(--inner-shadow);
}

input {
	margin: 5px 10px;
	width: calc(100% - 20px);
	height: calc(100% - 10px);
	padding: 0;
	outline: none;
	border: none;
	background: transparent;
	font: var(--font-heading-1);
	letter-spacing: 3px;
	color: var(--text);
	z-index: 1;
	position: relative;
}

label.input-label {
	height: 100%;
	max-width: calc(100% - 20px);
	padding: 0 10px;
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	z-index: 0;
	backdrop-filter: none;
	border-radius: 20px;
	overflow: hidden;
}

input:focus+label.input-label,
input[hasValue]+label.input-label {
	backdrop-filter: var(--blur-m);
	transform: scale(.8) translate(calc(-10% + 10px), -25px);
}

h2.input-title {
	/* max-width: 50vw; */
	margin: auto 0;
	text-align: left;
	opacity: .6;
	/* display: block; */
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.v-enter-from .text-input,
.v-leave-to .text-input {
	transform: scale(.9);
	opacity: 0;
}
</style>