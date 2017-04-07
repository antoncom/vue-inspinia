import Vue from 'vue'
import Router from 'vue-router'
import App from '../components/App'
import Home from '@/components/views/Home'
import Login from '@/components/views/Login'


Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            requireAuth: true,
            title: '主页'
        }
    }, {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '登陆'
        }
    }]
})

export default router
