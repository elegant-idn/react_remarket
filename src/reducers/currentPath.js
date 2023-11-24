import {PATH_NAME} from '../constants/currentPath'
import initialState  from './initialState'
export default function ( state = initialState.currentPath, action) {
    switch(action.type){
        case PATH_NAME:
            return {...state,
                currentPath: action.pathname
            };

        default:
            return state
    }
}
