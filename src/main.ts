import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { firebaseApp } from '@/store/firebase'

const app = createApp(App);
app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
    ],
}).use(store).use(router).mount('#app');
