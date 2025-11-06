import { createApp } from 'vue';
import { createPinia } from 'pinia';
import TDesign from 'tdesign-vue-next';

import App from './App.vue';
import 'tdesign-vue-next/es/style/index.css';
import '@/assets/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(TDesign);

app.mount('#app');
