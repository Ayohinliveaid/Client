import { createRouter, createWebHistory } from 'vue-router'
import Index from '/src/pages/index.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Index }
    ]
})

export default router;