import * as types from './mutation-types';

export default {
    [types.LOGIN]: (state, response) => {
        state.token = response.data.Authorization
        state.accountInfo = response.data.accountInfo
        state.authenticated = true

        sessionStorage.setItem('token', state.token)
        sessionStorage.setItem('accountInfo', state.accountInfo)
    },

    [types.VALIDATE_ERROR]: (state, errors) => {
        state.validate_errors = errors
    },

    [types.LOGOUT]: (state) => {
        state.name = ''
        state.token = ''
        state.accountInfo = {}
        state.authenticated = false

        sessionStorage.removeItem('token')
        sessionStorage.removeItem('accountInfo')
    },
}
