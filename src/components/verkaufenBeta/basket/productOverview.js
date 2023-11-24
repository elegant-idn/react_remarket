import React from 'react'
import PropTypes from 'prop-types'

const ProductOverview = ({ basketData,removeFromBasket, couponError, changeCoupon, goToCheckoutMobile  }) => {
    let totalPrice = 0

    function mapBasketData( item, i ){
        if( item.productTypeId == 999 ){
            totalPrice += +item.price
            return (
                <tr key={i}>
                    <td>{ item.note } ({item.shortcode})</td>
                    <td><h4 className="price">{ Math.round((+item.price) * 100) / 100} {window.currencyValue}</h4></td>
                    <td>
                        <span onClick={ () => removeFromBasket(item.productTypeId, item.shortcode)} className="removeFromBasket"/>
                    </td>
                </tr>
            )
        }
        else{
            item.id = i
            totalPrice += calculatePrice(item).price
            function mapCriterias() {
                let elementsArray = []
                for( let answer in item){
                    if( answer !== 'image' && answer !== 'Device' && answer !== 'Defects' && answer !== 'Submodel'
                        && answer !== 'Model' && answer !== 'Brand' && answer !== 'id' && answer !== 'comment'){
                        let name = answer === 'Condition' ? 'Allgemeiner Zustand' : answer
                        elementsArray.push(
                            <li key={answer}>
                                <strong>{name}:</strong> {item[answer].map( (value, i) => <span key={i}>{value.name}{i !==item[answer].length-1 ? ', ': null}</span>)}
                            </li>
                        )
                    }
                }
                return elementsArray
            }
            return(
                <tr className="itemBasketDataVerkaufen" key={i}>
                    <td>
                        <h4>{item.Model[0].name} {item.Model[0].nameExt ? ` (${item.Model[0].nameExt})` : null}</h4>
                        <div className="wrapCriterias">
                            <img src={item.image}/>
                            <ul> {mapCriterias()} </ul>
                        </div>

                    </td>
                    <td>
                        <p className="price discount-price">{calculatePrice(item).price} {window.currencyValue}</p>
                        {calculatePrice(item).oldPrice > 0 &&
                            <p className='price old-price'>{calculatePrice(item).oldPrice} {window.currencyValue}</p>
                        }
                    </td>
                    <td><span onClick={ () => removeFromBasket(null, item.id)} className="removeFromBasket"/></td>
                </tr>
            )
        }

    }
    return (
        <div className="col-md-5 productWrap">
            <h3 className="title">Verkaufsübersicht</h3>
            <div>
                <div>
                    <table className="verkaufenBasket">
                        <tbody>
                            {basketData.map(mapBasketData)}
                        </tbody>
                    </table>
                    {totalPrice > 0 && <div className="total clearfix">
                                            <p className="col-xs-6 title">Total geschätzter Preis:</p>
                                            <p className="col-xs-6 priceTotal">{totalPrice} {window.currencyValue}</p>
                                        </div>
                    }
                </div>
                <div className="commentField">
                    <textarea name="comment" rows="2" placeholder="Notiz / Spezielle Anmerkungen"/>
                </div>
                <div className="couponField">
                    <label>
                        <input type="checkbox"/>+ Gutscheincode hinzufügen
                        <input type="text"
                               className={ couponError ? 'errorInput' : ''}
                               name="coupon"
                               placeholder="Gutschein"
                               onChange={changeCoupon}/>
                        { couponError && <span className="errorText">{couponError}</span> }
                    </label>
                </div>
            </div>
            {window.isMobile && <div className="btn basketToCheckout mobileFixedBtn"
                                                                onClick={goToCheckoutMobile}>Zur Kasse</div>

            }
        </div>
    )
}

ProductOverview.propTypes = {}
ProductOverview.defaultProps = {}

export default ProductOverview
export function calculatePrice(userAnswers) {
    let minPrice = +userAnswers.Model[0].minPrice,
        total = 0,
        oldPrice = 0
    for( let key in userAnswers){
        if( key === 'Defects'){
            userAnswers[key].forEach( item => total += +item.price)
        }
        else if( key !== 'Brand' && key !== 'Submodel' && key !== 'image' && key !== 'Device' && key !== 'Condition' && key !== 'id' && key !== 'comment'){
            if(key === 'Model'){
                userAnswers[key].forEach( item => {
                    total += +item.price
                })
            }
            else{
                userAnswers[key].forEach( item => {
                    let modelPrice = +userAnswers.Model[0].price,
                        itemPrice = +item.valuePrice.replace(/,/g, ".").replace(/[^0-9.]/g, ""),
                        newPrice = 0,
                        isPersantage = item.valuePrice.includes('%'),
                        isNegative = item.valuePrice.includes('-')
                    if( isPersantage ){
                        newPrice = Math.ceil((modelPrice * (itemPrice/100))/5)*5
                        if(isNegative){
                            total -= newPrice
                        }
                        else{
                            total += newPrice
                        }
                    }
                    else{
                        if(isNegative){
                            total -= itemPrice
                        }
                        else{
                            total += itemPrice
                        }
                    }

                })
            }
        }
    }
    if(total < minPrice) total = minPrice
    oldPrice = total
    if(userAnswers.Model[0].discountPrice > 0) total += +userAnswers.Model[0].discountPrice
    if(oldPrice === total) oldPrice = 0
    oldPrice = (Math.round(oldPrice/5))*5
    total = (Math.round(total/5))*5

    return { price: total, oldPrice}
}
