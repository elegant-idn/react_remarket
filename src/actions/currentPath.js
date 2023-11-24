import * as types from  '../constants/currentPath'

export function setLocation(pathname) {
    return {
             type: types.PATH_NAME,
             pathname
          }
}
