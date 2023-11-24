import * as types from  '../constants/places'
import axios from 'axios'

export function setLocation(data) {
    return {
        type: types.SET_LOCATION,
        payload: data
    };
}


