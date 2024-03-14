<script setup lang="ts">
import SliderGroup from '@/components/groups/SliderGroup.vue';
import { ref } from 'vue';

const props = defineProps({
  gameDuration: { type: Number, default: 60 },
  turnDuration: { type: Number, default: 5 },
});

const emits = defineEmits<{
  (e: "update", durations: { game: number, turn: number }): void,
}>();

const duration = ref({
  game: props.gameDuration,
  turn: props.turnDuration,
});

const turnSlider = ref();

defineExpose({
  duration,
});

const defaults = Object({ ...props });

function turnMax() {
  let turn = 60;
  const game = parseInt(duration.value.game.toString());
  if (game) turn = (game + game % 2) / 2;

  if (turn >= duration.value.turn) emits("update", duration.value);
  return turn;
}

</script>

<template>
  <slider-group name="Game Duration" :value="defaults.gameDuration"
    @update="val => { duration.game = val; emits('update', duration); }" :options="{ 0: 'Infinite' }" :max="60"
    unit="min">
    <option value="0" label="∞" />
    <option value="60" label="60 min" />
  </slider-group>
  <slider-group name="Turn Duration" :value="defaults.turnDuration"
    @update="val => { duration.turn = val; emits('update', duration); }" :options="{ 0: 'Infinite' }" :max="turnMax()"
    unit="min" ref="turnSlider">
    <option value="0" label="∞" />
    <option :value="turnMax()" :label="turnMax().toString() + ' min'" />
  </slider-group>
</template>