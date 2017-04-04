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
import Login from './components/views/Login'
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
window.Vue = Vue;

// vue配置
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV !== 'production'

// TODO 使用NProgress会导致axios报错，暂时注释
// Vue.use(NProgress)
Vue.use(VueAxios, axios)

// store、router同步
sync(store, router)

// 加载条
const nprogress = new NProgress({ parent: '.nprogress-container' })

// 如果没登陆就打开登陆页面
const entry = store.state.authenticated ? App : Login

// 路由钩子
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (store.state.authenticated) {
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
        if (store.state.token) {
            config.headers.Authorization = `cloud_center ${store.state.token}`;
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
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data)
    }
);

// 注册过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

const vm = new Vue({
    router,
    store,
    nprogress,
    ...entry
}).$mount('#app')
