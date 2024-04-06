<script setup lang="ts">
import SliderGroup from '@/components/groups/SliderGroup.vue';
import { useGameStore } from '@/store';
import { computed, ref, watch } from 'vue';

const gameSettings = useGameStore().getSettings;

// const props = defineProps({
//   defaults: { default: { gameDuration: 60, turnDuration: 5 } },
// });

const emits = defineEmits<{
  (e: "update", durations: { gameDuration: number, turnDuration: number }): void,
}>();

const modelDefault = { gameDuration: Math.round(gameSettings.gameDuration / 60000), turnDuration: Math.round(gameSettings.turnDuration / 60000) }

const duration = defineModel({ default: { gameDuration: 60, turnDuration: 5 } });

duration.value = modelDefault;
// console.log("reset", modelDefault);
 
// defineExpose({
//   duration,
// });

const turnMax = ref(60);

function setTurnMax() {
  // let turn = 60;
  const game = parseInt(duration.value.gameDuration.toString());
  turnMax.value = game ? (game + game % 2) / 2 : 60;
  // if (turn >= duration.value.turn) emits("update", duration.value);
  // return turn;
}

</script>

<template>
  <slider-group name="Game Duration" :value="modelDefault.gameDuration"
    @update="() => { setTurnMax(); emits('update', duration); }" :options="{ 0: 'Infinite' }"
    :max="60" unit="min" v-model="duration.gameDuration">
    <option value="0" label="∞" />
    <option value="60" label="60 min" />
  </slider-group>
  <slider-group name="Turn Duration" :value="modelDefault.turnDuration"
    @update="() => { emits('update', duration); }" :options="{ 0: 'Infinite' }" :max="turnMax"
    unit="min" v-model="duration.turnDuration">
    <option value="0" label="∞" />
    <option :value="turnMax" :label="turnMax.toString() + ' min'" />
  </slider-group>
</template>