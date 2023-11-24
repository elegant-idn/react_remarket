import * as types from  '../constants/basket'
import api from '../api/index'

export function changeWishlisteData(data) {
    window.localStorage.setItem('wishlisteData', JSON.stringify(data))
    let countWishlistItems = 0;

    data.forEach( (item, index, object) => {
        if(item.productTypeId != 11 && item.productTypeId != 100 && item.productTypeId != 999) {
            ++countWishlistItems;            
        }
    })
    return ( dispatch ) => {
        dispatch({
                    type: types.CHANGE_WISHLIST_DATA,
                    payload: {
                        data,
                        countWishlistItems
                    }
        })
    }
}

export function changeBasketData(data) {
    window.localStorage.setItem('basketData', JSON.stringify(data))
    let countBasketItems = 0,
        domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1];

    data.forEach( (item, index, object) => {
        if(item.productTypeId != 11 && item.productTypeId != 100 && item.productTypeId != 999)
        {
            ++countBasketItems;
            if(window.isFBConnection){
            if (domain === 'ch') {
                fbq('track', 'AddToCart',
                    {value: item.discountPrice || item.price , currency: 'CHF'}
                )// facebook pixel
            }
            }
        }
    })
    return ( dispatch ) => {
        dispatch({
                    type: types.CHANGE_BASKET_DATA,
                    payload: {
                        data,
                        countBasketItems
                    }
        })
    }
}

export function changeBasketVerkaufenData(data) {
    window.localStorage.setItem('basketDataVerkaufen', JSON.stringify(data));
    let countBasketVerkaufenItems = 0;
    data.forEach( item => {
        if(item.productTypeId != 999)
        {
            ++countBasketVerkaufenItems;
        }
    })
    return(
        {
            type: types.CHANGE_BASKET_VERKAUFEN_DATA,
            payload: {
                data,
                countBasketItems: countBasketVerkaufenItems
            }
        }
    )
}
export function changeShippingMethod(data) {
    window.localStorage.setItem('shippingMethod', JSON.stringify(data))
    return(
        {
            type: types.CHANGE_SHIPPING_METHOD,
            payload: data
        }
    )
}
export function basketAddEffect(data) {
    return(
        {
            type: types.BASKET_ADD_EFFECT,
            payload: data
        }
    )
}
export function wishlistAddEffect(data) {
    return(
        {
            type: types.WISHLIST_ADD_EFFECT,
            payload: data
        }
    )
}
export function changeBasketDataRepair(data) {
    return ( dispatch ) => {
        dispatch({
            type: types.CHANGE_BASKET_REPAIR_DATA,
            payload: data
        })
    }
}
export function changeShippingMethodRepair(data) {
    return(
        {
            type: types.CHANGE_REPAIR_SHIPPING_METHOD,
            payload: data
        }
    )
}
