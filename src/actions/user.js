import * as types from  '../constants/user'

export function loginSuccess(data) {
    if(data){
        // window.Intercom('update', { name: data.systemAddress.first_name + ' ' + data.systemAddress.last_name,
        //                             email: data.systemAddress.email,
        //                             created_at: data.created_at})

        window.localStorage.setItem('loggedUserData', JSON.stringify(data))
    }
    return {
            type: types.LOGIN_SUCCESS,
            payload: data
            }
}
export function logOut() {
    // window.Intercom('shutdown')
    // window.Intercom('boot', {app_id: 'o5fsmxhh'})
    window.localStorage.removeItem('userDataVerkaufen')
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('loggedUserData')

    return {
             type: types.LOGOUT_SUCCESS
            }
}
export function setRedirectTo(data) {
    return {
             type: types.REDIRECT_TO,
             payload: data
            }
}
export function cancelRedirectToMyAccount(data) {
    return {
             type: types.CANCEL_REDIRECT_TO,
             payload: data
            }
}
