import { createApp } from 'vue'
import App from './App.vue'
import { DatePicker } from 'ant-design-vue';
import router from './router/router.js'

const app = createApp(App);
app.use(router);
app.use(DatePicker);

app.mount('#app')
