<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const props = defineProps<{
	name?: string,
	type?: "email" | "number" | "password" | "text",
	value?: string,
	inputMode?: "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined,
	required?: boolean,
}>();

const emits = defineEmits<{
	(e: "update", value: string): void,
}>();

const model = defineModel<string>();

const input = ref();

onMounted(() => {
	input.value.value = props.value || "";
	if (input.value) input.value.toggleAttribute("hasValue", input.value.value != "");

	input.value.addEventListener("focusout", () => {
		if (input.value) input.value.toggleAttribute("hasValue", input.value.value != "");
		userStore.feedback();
	});
	input.value.addEventListener("input", () => {
		model.value = input.value.value;
		emits("update", input.value.value);
		input.value.toggleAttribute("hasValue", input.value.value != "");
	});
	input.value.addEventListener("focusin", userStore.feedback);
});
</script>

<template>
	<div class="text-input">
		<input :inputmode="inputMode ? inputMode : 'text'" :type="type ? type : 'text'"
			:minlength="type == 'password' ? 8 : undefined" ref="input" :required="required">
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

.v-enter-active .text-input label.input-label,
.v-leave-active .text-input label.input-label {
	backdrop-filter: none;
}

.v-enter-from .text-input,
.v-leave-to .text-input,
.v-enter-from.text-input,
.v-leave-to.text-input {
	transform: scale(.9);
	opacity: 0;

	label.input-label {
		backdrop-filter: none;
		/* opacity: 0; */
	}

	h2.input-title {
		transform: translateX(-100%);
	}
}
</style>