import { createApp } from 'vue'
import App from './App.vue'
import { DatePicker } from 'ant-design-vue';
import router from './router/router.js'
import { Collapse, Tabs, Dropdown, Menu, Modal, Form, Input, Button } from 'ant-design-vue';

const app = createApp(App);
app.use(Collapse)
app.use(Menu);
app.use(Dropdown);
app.use(router);
app.use(Modal);
app.use(Form);
app.use(Input);
app.use(Button);



app.mount('#app')
