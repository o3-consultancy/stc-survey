import { createRouter, createWebHistory } from 'vue-router'

const Start = () => import('../pages/Start.vue')
const PersonalInfo = () => import('../pages/PersonalInfo.vue')
const Interest = () => import('../pages/Interest.vue')
const Thoughts = () => import('../pages/Thoughts.vue')
const QRScan = () => import('../pages/QRScan.vue')
const ThankYou = () => import('../pages/ThankYou.vue')

const routes = [
    { path: '/', name: 'start', component: Start },
    { path: '/info', name: 'info', component: PersonalInfo },
    { path: '/interest', name: 'interest', component: Interest },
    { path: '/thoughts', name: 'thoughts', component: Thoughts },
    { path: '/scan', name: 'scan', component: QRScan },
    { path: '/thanks', name: 'thanks', component: ThankYou },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
