import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useFireStore } from './store'

const pinia = createPinia();
const app = createApp(App)

app.use(router).use(pinia);

app.mount('#app')

// const userStore = useUserStore()
// await userStore.signIn({email: "test@gmail.com", password: "abcdefg"}).then(f => {
//   console.log(f);
//   if (f == "success") userStore.deleteAccount();
// });

useFireStore();