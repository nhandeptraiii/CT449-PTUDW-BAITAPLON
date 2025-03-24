// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'
import { createPinia } from 'pinia';
const app = createApp(App);

app.use(createPinia())
app.use(router) 
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
})
// createApp(App).use(router).use(pinia).mount('#app');
app.mount('#app')