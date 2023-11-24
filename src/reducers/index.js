import {combineReducers} from 'redux'
import shop from './shop'
import user from './user'
import currentPath from './currentPath'
import basket from './basket'
import places from './places'
const rootReducer = combineReducers({
    shop,
    user,
    currentPath,
    basket,
    places,
})
export default rootReducer