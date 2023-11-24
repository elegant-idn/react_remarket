import * as types from '../constants/shop'
import initialState  from './initialState'
export default function ( state = initialState.shop, action) {
    switch(action.type){
        case types.LOAD_DEVICES_SUCCESS:
            return {...state, devices: action.payload }
        case types.LOAD_DEVICES_FOR_SELL_SUCCESS:
            return {...state, devicesSell: action.payload }
        /*case types.LOAD_FILTER_OPTIONS_SUCCESS:
            return {...state, filterOptions: { ...state.filterOptions, capacities: action.payload.capacity, conditions: action.payload.condition, colors: action.payload.color  } }
        */
        case types.LOAD_MODELS_SUCCESS:
            return { ...state, models: action.payload.models, modelsGroup: action.payload.categoriesList  }
        case types.SET_FILTER_OPTIONS_SUCCESS:
                    return { ...state, filterOptions: action.payload }
        case types.SET_SEARCH_RESULTS:
                    return { ...state, searchResults: action.payload }
        case types.RETURN_SEARCH_RESULTS_TO_PREV_ROUTE:
                    return { ...state, helperCounter: action.payload }
        default:
            return state
    }
}
