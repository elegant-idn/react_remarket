import * as types from '../constants/user'
import initialState  from './initialState'

export default function ( state = initialState.user, action) {

    switch(action.type){
        case types.LOGIN_SUCCESS:
            return {...state, isLogin: true, data: action.payload}
        case types.LOGOUT_SUCCESS:
            return {...state, isLogin: false, data: {} }
        case types.MSG_INFO:
            return {...state, msgInfo: action.payload }
        case types.REDIRECT_TO:
            return {...state, redirectTo: action.payload }
        case types.CANCEL_REDIRECT_TO:
            return {...state, cancelRedirectToMyAccount: action.payload }
        default:
            return state
    }
}