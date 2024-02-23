<script setup lang="ts">
import { useStore } from '@/store';
import { onMounted, ref } from 'vue';

const store = useStore();

defineProps<{
	name?: string,
	type: string,
	inputmode: "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined,
}>();

const input = ref();
const value = ref("");

onMounted(() => {
	input.value.addEventListener("focusout", () => {
		input.value.toggleAttribute("hasValue", input.value.value != "");
		store.feedback();
	});
	input.value.addEventListener("input", () => {
		value.value = input.value.value;
		input.value?.toggleAttribute("hasValue", value.value != "");
	});
	input.value.addEventListener("focusin", store.feedback);
});
</script>

<template>
	<div class="text-input-wrap">
		<input :inputmode="inputmode" :type="type" ref="input">
		<label>
			<h2 class="name">
				<slot></slot>
			</h2>
		</label>
	</div>
</template>

<style scoped>
.text-input-wrap {
	height: 40px;
	/* width: 100%; */
	max-width: 300px;
	/* padding: 5px 10px; */
	overflow: visible;
	margin: 10px 0;
	border-radius: 15px;
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

label {
	height: 100%;
	margin: 0 10px;
	padding: 0 10px;
	position: relative;
	top: -100%;
	left: -10px;
	display: table;
	z-index: 0;
	backdrop-filter: blur(0px);
	border-radius: 20px;
}

input:focus+label,
input[hasValue]+label {
	backdrop-filter: blur(10px);
	transform: scale(.8) translate(-10px, -25px);

}

h2 {
	margin: auto;
	text-align: left;
	opacity: .6;
	display: table-cell;
	vertical-align: middle;
}
</style>