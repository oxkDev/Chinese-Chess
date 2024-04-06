<script setup lang="ts">
import SnapSection from '@/components/SnapSection.vue';
import SliderGroup from '@/components/groups/SliderGroup.vue';
import GridGroup from '@/components/groups/GridGroup.vue';
import SwitchGroup from '@/components/groups/SwitchGroup.vue';
import IconButtonMain from '@/components/IconButtonMain.vue';
import ColourThemeIcon from '@/components/ColourThemeIcon.vue';
import { useRoute, useRouter } from 'vue-router';
import { Settings, useUserStore } from '@/store';
import { computed, watch } from 'vue';
import { ColourTheme, colourThemes } from '@/store/themes';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const settings = computed(() => userStore.getSettings);

function setSetting(key: string, value: boolean | number | string | ColourTheme) {
  const newSettings = ({ ...settings.value } as { [key: string]: boolean | number | string | ColourTheme });
  if (newSettings[key] != value) {
    newSettings[key] = value;
    userStore.setSettings(newSettings as unknown as Settings);
  }
}

const sideNav = {
  "appearance": "#appearance",
  "sound": "#sound",
  "animation": "#animation",
  "behaviour": "#behaviour",
}

watch(route, () => {
  if (Object.values(sideNav).indexOf(route.hash) == -1) router.push(sideNav.appearance);
});
</script>

<template>
  <div id="settings" class="scroll-snap-view">
    <snap-section title="appearance" route-name="/settings">
      <grid-group margin="20px" name="Colour Palette">
        <colour-theme-icon v-for="(theme, k) in colourThemes" :key="k" :theme="theme"
          :selected="JSON.stringify(theme) == JSON.stringify(settings.colourTheme)"
          @click="setSetting('colourTheme', theme);" />
      </grid-group>
      <grid-group margin="20px" name="Design Theme">
        <div class="theme">e</div>
        <div class="theme">f</div>
        <div class="theme">g</div>
        <div class="theme">h</div>
      </grid-group>
      <slider-group :value="parseInt(settings.blur.toString())" @update="v => setSetting('blur', v)" name="Blur"
        :max="2" :options="{
          0: 'None',
          1: 'Minimal',
          2: 'Fancy',
        }">
        <option value="0" label="None"></option>
        <option value="1" label="Minimal"></option>
        <option value="2" label="Fancy"></option>
      </slider-group>
    </snap-section>

    <snap-section title="sound" route-name="/settings">
      <switch-group @update="v => setSetting('music', v)" :value="settings.music">Music</switch-group>
      <switch-group @update="v => setSetting('game', v)" :value="settings.game">Gameplay</switch-group>
      <switch-group @update="v => setSetting('atmos', v)" :value="settings.atmos">Atmosphere</switch-group>
      <switch-group @update="v => setSetting('haptic', v)" :value="settings.haptic">Vibrations</switch-group>
    </snap-section>

    <snap-section title="animation" route-name="/settings">
      <slider-group :value="parseInt(settings.animationSpeed.toString())" @set="v => setSetting('animationSpeed', v)"
        name="Speed" unit="%">
        <option value="0" label="0%"></option>
        <option value="100" label="100%"></option>
      </slider-group>
      <slider-group :value="parseInt(settings.animationLevel.toString())" @update="v => setSetting('animationLevel', v)"
        name="Style" :max="2" :options="{
          0: 'Minimal',
          1: 'Standard',
          2: 'Fancy'
        }">
        <option value="0" label="Minimal"></option>
        <option value="50" label="Standard"></option>
        <option value="100" label="Fancy"></option>
      </slider-group>
    </snap-section>

    <snap-section title="behaviour" route-name="/settings">
      <switch-group @update="v => setSetting('positionAid', v)" :value="settings.positionAid">Position
        Aid</switch-group>
      <switch-group @update="v => setSetting('stalemateAid', v)" :value="settings.stalemateAid">Stalemate
        Aid</switch-group>
    </snap-section>
    <nav id="sideNav">
      <icon-button-main v-for="( value, key ) in sideNav " :active="route.hash == value" :key="key" :to="value"
        :icon="key" class="side-nav" />
    </nav>
  </div>
</template>


<style>
.theme {
  width: 55px;
  aspect-ratio: 1;
  border-radius: 10px;
  color: white;
  background-color: grey;
}
</style>