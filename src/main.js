// 引入INSPINIA所需文件，css不并入app.js会统一打包到style.css
require('@/assets/css/bootstrap.css')
require('@/assets/font-awesome/css/font-awesome.css')
require('@/assets/css/animate.css')
require('@/assets/css/style.css')
require('@/assets/js/jquery-3.1.1.min.js')
require('@/assets/js/bootstrap.min.js')
require('@/assets/js/plugins/metisMenu/jquery.metisMenu.js')
require('@/assets/js/plugins/slimscroll/jquery.slimscroll.min.js')
require('@/assets/js/inspinia.js')
require('@/assets/js/plugins/pace/pace.min.js')

// 引入开发所需包
import Vue from 'vue'
import App from './components/App'
import router from './router'
import { sync } from 'vuex-router-sync'
import axios from 'axios'
import VueAxios from 'vue-axios'
import NProgress from 'vue-nprogress'
import store from './store'
import * as filters from './filters'
import * as types from './store/mutation-types'
// tough-cookie需要net依赖
import tough from 'tough-cookie'
var Cookie = tough.Cookie
window.cookieJar = new tough.CookieJar()

// 提升为全局变量
window.Vue = Vue
window.router = router

// vue配置
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(NProgress)
Vue.use(VueAxios, axios)

// store、router同步
sync(store, router)

// 加载条
const nprogress = new NProgress(/*{ parent: '.nprogress-container' }*/)

// 路由钩子
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (sessionStorage.getItem('token')) {
            // 将token和登陆用户信息保存到sessionStorate，因为放到store里刷新会重新登陆
            // 如果sessionStorage里能拿到token就视为登陆，不管这个token是否过期，如果过期了，发起请求的时候会自动跳转到登陆页面
            // 如果state里相关数据为空，但是sessionStorage里不为空，更新为sessionStorage里的数据
            if (!store.state.authenticated) {
                store.state.token = sessionStorage.getItem('token')
                store.state.accountInfo = sessionStorage.getItem('accountInfo')
                store.state.authenticated = true
            }
            next();
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        next();
    }
})

// 设置页面标题
router.afterEach(route => {
    if (route.meta.title) {
        document.title = route.meta.title;
    }
})

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'https://v.zivoo.cn:8443'
// TODO 不清楚为什么没有生效，改为在拦截器里配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true

// http request 拦截器
axios.interceptors.request.use(
    config => {
        nprogress.start()

        if (store.state.token) {
            config.headers.Authorization = sessionStorage.getItem('token')
        }
        // console.log(config)
        if (config.method == 'post') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }

        // cookieJar.getCookies(config.url, function(err, cookies) {
            // 不支持设置cookie头，报错Refused to set unsafe header "cookie"
            // config.headers.cookie = cookies.join('; ');
        // });

        return config
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.headers['set-cookie'] instanceof Array) {
            // TODO 跨域问题，这里获取不到set-cookie
            cookies = response.headers['set-cookie'].forEach(function(c) {
                cookieJar.setCookie(Cookie.parse(c), response.config.url, function(err, cookie) {});
            });
        }

        nprogress.done()

        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT)
                    router.replace({
                        path: 'login',
                        query: { redirect: router.currentRoute.fullPath }
                    })
                case 500:
                    // TODO 弹框提示错误
                    break
            }
        }

        console.log(error);
        nprogress.done()

        return Promise.reject(error.response.data)
    }
);

// 注册过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

const vm = new Vue({
    // el: '#app',
    router,
    store,
    nprogress,
    // ...App
    render: h => h(App)
}).$mount('#app')
