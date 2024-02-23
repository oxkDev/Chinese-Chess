<script setup lang="ts">
import SettingSection from '@/components/SettingSection.vue';
import SliderGroup from '@/components/groups/SliderGroup.vue';
import GridGroup from '@/components/groups/GridGroup.vue';
import SwitchGroup from '@/components/groups/SwitchGroup.vue';
import IconButtonMain from '@/components/IconButtonMain.vue';
import ColourThemeIcon from '@/components/ColourThemeIcon.vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store';
import { ref, watch } from 'vue';
import { ColourTheme, colourThemes } from '@/store/themes';
import router from '@/router';

const route = useRoute();
const store = useStore();
const settings = ref(store.getSettings);

function setSetting(key: string, value: boolean | number | string | ColourTheme) {
  (settings.value as unknown as { [key: string]: boolean | number | string | ColourTheme })[key] = value;
  store.setSettings(settings.value);
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
  <div id="settings">
    <div id="settingsScreen">
      <setting-section title="appearance">
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
        <slider-group :value="parseInt(String(settings.blur))" @update="v => setSetting('blur', v)" name="Blur" :max="2"
          :options="{
            0: 'None',
            1: 'Minimal',
            2: 'Fancy',
          }">
          <option value="0" label="None"></option>
          <option value="1" label="Minimal"></option>
          <option value="2" label="Fancy"></option>
        </slider-group>
      </setting-section>

      <setting-section title="sound">
        <switch-group @update="v => setSetting('music', v)" :def="settings.music">Music</switch-group>
        <switch-group @update="v => setSetting('game', v)" :def="settings.game">Gameplay</switch-group>
        <switch-group @update="v => setSetting('atmos', v)" :def="settings.atmos">Atmosphere</switch-group>
        <switch-group @update="v => setSetting('haptic', v)" :def="settings.haptic">Vibrations</switch-group>
      </setting-section>

      <setting-section title="animation">
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
      </setting-section>

      <setting-section title="behaviour">
        <switch-group @update="v => setSetting('positionAid', v)" :def="settings.positionAid">Position
          Aid</switch-group>
        <switch-group @update="v => setSetting('stalemateAid', v)" :def="settings.stalemateAid">Stalemate
          Aid</switch-group>
      </setting-section>
    </div>
    <nav id="settingsSideNav">
      <icon-button-main v-for="( value, key ) in sideNav " :active="route.hash == value" :key="key" :to="value"
        :icon="key" class="side-nav" />
    </nav>
  </div>
</template>


<style>
#settings {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0px;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#settingsScreen {
  height: 100vh;
  max-width: 300px;
  width: calc(100% - 120px);
  padding: 0 60px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.theme {
  width: 55px;
  aspect-ratio: 1;
  border-radius: 10px;
  color: white;
  background-color: grey;
}

nav#settingsSideNav {
  display: flex;
  flex-direction: column;
  position: absolute;
  justify-content: center;
  right: 0px;
  height: 100%;
  top: 0px;
}

nav#settingsSideNav path {
  transition: var(--transition-m);
}

.v-enter-from a.side-nav,
.v-leave-to a.side-nav {
  transform: scale(.9);
  opacity: 0;
}
</style>@/store/themes