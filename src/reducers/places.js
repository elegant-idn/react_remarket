import * as types from '../constants/places'
import initialState  from './initialState'

export default function ( state = initialState.places, action) {

    switch(action.type){
        case types.SET_LOCATION:
            return {
                ...state,
                currentLocation: action.payload,
            };

        default:
            return state
    }
}
