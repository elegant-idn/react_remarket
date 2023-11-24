import React from 'react'
import PropTypes from 'prop-types'

const ProductsList = ({ basketData }) => {
    let totalPrice = 0
    function calculatePrice(userAnswers) {
        let minPrice = +userAnswers.Model[0].minPrice,
            total = 0
        for( let key in userAnswers){
            if( key === 'Defects'){
                userAnswers[key].forEach( item => total += +item.price)
            }
            else if( key !== 'Brand' && key !== 'Submodel' && key !== 'image' && key !== 'Device' && key !== 'id' && key !== 'Condition' && key !== 'comment'){
                if(key === 'Model'){
                    userAnswers[key].forEach( item => {
                        total += +item.price
                    })
                }
                else{
                    userAnswers[key].forEach( item => {
                        let modelPrice = +userAnswers.Model[0].price,
                            itemPrice = +item.valuePrice.replace(/[^0-9.]/g, ""),
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
        if(total < minPrice) {
            totalPrice += minPrice
            return minPrice
        }
        else {
            totalPrice += total
            return total
        }
    }
    function mapBasketData( item, i ){
        if( item.productTypeId == 999 ){
            totalPrice += +item.price
            return (
                <tr key={i}>
                    <h4><strong>{ item.note } ({item.shortcode})</strong></h4>
                    <td><p>Price: <strong>{ Math.round((+item.price) * 100) / 100} {window.currencyValue}</strong></p></td>
                </tr>
            )
        }
        else{
            function mapCriterias() {
                let elementsArray = []
                for( let answer in item){
                    if( answer !== 'image' && answer !== 'Device' && answer !== 'Defects'
                        && answer !== 'Model' && answer !== 'id' && answer !== 'comment'){
                        elementsArray.push(
                                <span key={answer}><strong>{answer}</strong>: {item[answer].map( (value, i) => <span key={i}>{value.name}{i !==item[answer].length-1 ? ', ': null} </span>)} </span>
                        )
                    }
                }
                return elementsArray
            }
            return(
                <tr className="itemBasketDataVerkaufen" key={i}>
                    <td>
                        <h4><strong>{item.Model[0].name}</strong></h4>
                        <p> {mapCriterias()} </p>
                        { item.comment && <p>Notiz / Spezielle Anmerkung: {item.comment}</p> }
                    </td>
                    <td>
                        <p>Preis: <strong>{calculatePrice(item)} {window.currencyValue}</strong></p>
                    </td>
                </tr>
            )
        }

    }
    return (
        <div className="col-md-12">
            <h3>Products</h3>
            <div className="sellPageOverview">
                <table >
                    <tbody>
                        { basketData.map(mapBasketData)}
                    </tbody>
                </table>
            </div>
            <hr/>
            <h5 className="text-right">Gesamtbetrag: <strong>{totalPrice} {window.currencyValue}</strong></h5>
        </div>
    );
}

ProductsList.propTypes = {}
ProductsList.defaultProps = {}

export default ProductsList