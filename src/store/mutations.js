import * as types from './mutation-types';

export default {
    [types.LOGIN]: (state, { token }) => {
        state.token = token;
        state.authenticated = true;
        localStorage.setItem('token', token);
    },

    [types.VALIDATE_ERROR]: (state, errors) => {
        state.validate_errors = errors;
    },

    [types.LOGOUT]: (state) => {
        state.name = '';
        state.token = '';
        state.authenticated = false;
        localStorage.removeItem('token');
    },
}
