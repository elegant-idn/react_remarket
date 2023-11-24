import * as types from '../constants/basket'
import initialState  from './initialState'
export default function ( state = initialState.basket, action) {

    switch(action.type){

        case types.CHANGE_BASKET_DATA:
            return {...state, basketData: action.payload.data, count: action.payload.countBasketItems }

        case types.CHANGE_WISHLIST_DATA:
            return {...state, wishlistData: action.payload.data, wishlistCount: action.payload.countWishlistItems }    

        case types.CHANGE_BASKET_VERKAUFEN_COUNT:
            return {...state, countVerkaufen: action.payload }

        case types.CHANGE_BASKET_VERKAUFEN_DATA:
            return {...state, basketDataVerkaufen: action.payload.data, countVerkaufen: action.payload.countBasketItems }

        case types.CHANGE_SHIPPING_METHOD:
                    return {...state, shippingMethod: action.payload }
        case types.BASKET_ADD_EFFECT:
            return {...state, basketAddEffect: action.payload }
        case types.WISHLIST_ADD_EFFECT:
            return {...state, wishlistAddEffect: action.payload }    
        /*repair page*/
        case types.CHANGE_BASKET_REPAIR_DATA:
            return {...state, basketDataRepair: {...state.basketDataRepair, selectedOptions: action.payload } }
        case types.CHANGE_REPAIR_SHIPPING_METHOD:
            return {...state,
                basketDataRepair: {...state.basketDataRepair, shippingMethod: action.payload } }
        default:
            return state
    }
}
