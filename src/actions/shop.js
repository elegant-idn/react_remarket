import * as types from  '../constants/shop'
import api from '../api/index'

export function loadDevices(url, type) {
    return ( dispatch ) => {
        if (type === 'verkaufen') {
            const devicesForPurchaseWithParams = window.localStorage.getItem("devicesForPurchaseWithParams") && window.localStorage.getItem("devicesForPurchaseWithParams") !== '' ? JSON.parse(window.localStorage.getItem("devicesForPurchaseWithParams")) : null    
            if (devicesForPurchaseWithParams) {
                dispatch({
                    type: types.LOAD_DEVICES_FOR_SELL_SUCCESS,
                    payload: devicesForPurchaseWithParams
                })
            } else {
                api.loadDevices(url).then( ({ data: { data } }) => {
                    window.localStorage.setItem('devicesForPurchaseWithParams', JSON.stringify(data))
                    dispatch({
                        type: types.LOAD_DEVICES_FOR_SELL_SUCCESS,
                        payload: data
                    })
                })
            }
        } else {
            const devicesData = window.localStorage.getItem("devicesData") && window.localStorage.getItem("devicesData") !== '' ? JSON.parse(window.localStorage.getItem("devicesData")) : null
            const devicesForPurchase = window.localStorage.getItem("devicesForPurchase") && window.localStorage.getItem("devicesForPurchase") !== '' ? JSON.parse(window.localStorage.getItem("devicesForPurchase")) : null
            if (url === '/api/devices' && devicesData) {
                dispatch({
                    type: types.LOAD_DEVICES_SUCCESS,
                    payload: devicesData
                })
            } else if (url === '/api/devicesForPurchase' && devicesForPurchase) {
                dispatch({
                    type: types.LOAD_DEVICES_SUCCESS,
                    payload: devicesForPurchase
                })
            } else {
                api.loadDevices(url).then( ({ data: { data } }) => {
                    axios.get('/api/getShopCategories')
                        .then( result => {
                            let newData = [...data];
                            if(result.data.length > 0) newData = [...data, { id: 11, name: 'Zubehör', submodels: result.data}];
                            if (url === '/api/devices')
                                window.localStorage.setItem('devicesData', JSON.stringify(newData))
                            if (url === '/api/devicesForPurchase')
                                window.localStorage.setItem('devicesForPurchase', JSON.stringify(newData))
                            dispatch({
                                type: types.LOAD_DEVICES_SUCCESS,
                                payload: newData
                            })
                        })
                })
            }
        }
    }
}

export function loadModels(models, categoriesList) {
    return ( dispatch ) => {
            dispatch({
                type: types.LOAD_MODELS_SUCCESS,
                payload: {
                    models,
                    categoriesList
                }
            })
    }
}
export function setFilterOptions(data) {
    return ( dispatch ) => {
        dispatch({
            type: types.SET_FILTER_OPTIONS_SUCCESS,
            payload: data
        })
    }
}
export function setSearchResult(data, searchValue) {
    return {
        type: types.SET_SEARCH_RESULTS,
        payload: { data: data.data, total: data.meta.totalCount, searchValue }
    }
}

export function definedCounerForSearchInput (data) {
    return {
        type: types.RETURN_SEARCH_RESULTS_TO_PREV_ROUTE,
        payload: data
    }
}
