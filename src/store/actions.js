import * as types from './mutation-types';
// axios使用application/x-www-form-urlencoded必须配合querystring
import querystring from 'querystring'

export const login = ({ commit, state }, payload) => {
    if (!payload.params.username) {
        payload.error = state.errors[50002].display
        return
    } else if (!payload.params.password) {
        payload.error = state.errors[50003].display
        return
    }

    Vue.axios.post('/cloud_center/security_account/login', querystring.stringify(payload.params)).then(response => {
        console.log(response)
        var data = response.data
        if (data.errorCode) {
            payload.password = '';
            payload.error = state.errors[data.errorCode].display
            return
        }
        payload.error = ''
        // TODO 跨域问题，这里获取不到set-cookie
        // console.log(response.config.url)
        // cookieJar.getCookies(response.config.baseURL, function(err, cookies) {
        //     console.log(cookies)
        // })
        // commit(types.LOGIN, {
        //     token: response.data.token,
        // });
    }).catch(error => {
        payload.password = '';
        payload.error = error
    });
}
