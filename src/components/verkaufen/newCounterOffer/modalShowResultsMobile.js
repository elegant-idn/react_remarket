import React from 'react'
import PropTypes from 'prop-types'

const ShowResultsCounterOfferMobile = ({ oldOffer, newOffer, oldPrice, newPrice, image, comment, acceptOffer, declineOffer, couponTotal = 0}) => {
    function mapCriterias(offer) {
        let content = offer.map((item, i) => {
            let className = item.changes ? 'changed' : ''
            return(
                <div className="col-xs-4 itemAnswer" key={i}>
                    <p className="title">{item.name}</p>
                    <ul>{item.values.map( (item, i) => <li key={i} className={className}>{item}</li>)}</ul>
                    <div className="clearfix"/>
                </div>
            )
        })
        let groupSize = 3
        let rows = content.reduce(function(r, element, index) {
            index % groupSize === 0 && r.push([])
            r[r.length - 1].push(element)
            return r;
        }, []).map(function(rowContent ,i) {
            return <div className="row" key={i}>{rowContent}</div>
        })
        return rows
    }

    return (
        <div className="newOfferResults">
            <div className="description clearfix">
                <div className="image">
                    <img src={'/images/design/guy-banner.svg'} alt=""/>
                </div>
                <div className="col-xs-7 col-xs-push-5 counter-offer">
                    <h1>Gegenofferte</h1>
                    <p>Wir haben bei Ihrem Ankauf eine Abweichung der eingesendeten Angaben gefunden und offerieren Ihnen einen neuen Preis. Sie können diesen akzeptieren oder ablehnen.</p>
                    { comment && <p><br /><br /><strong>Kommentar:</strong> {comment}</p>}

                </div>
            </div>
            <div className="price">
                <h3 className="title">Neues Angebot</h3>
                <p className="newPrice">{ newPrice } {window.currencyValue}</p>
                <p className="oldPrice">{ oldPrice } {window.currencyValue}</p>
            </div>
            {parseFloat(couponTotal) !== 0 &&
                <div className="coupon">
                    <div className="coupon-left">
                        <h3 className="title">Ihr Gutschein</h3>
                        <div className="image">
                            <img src={'/images/design/counter_coupon.png'} alt=""/>
                            <div className="couponPrice">{`+${couponTotal}`} {window.currencyValue}</div>
                        </div>
                    </div>
                    <div className="coupon-right">
                        <h3 className="title">Total</h3>
                        <p className="newPrice">{ (parseFloat(newPrice) + parseFloat(couponTotal)).toFixed(2) } {window.currencyValue}</p>
                        <p className="oldPrice">{ newPrice } {window.currencyValue}</p>
                    </div>
                </div>
            }
            <div className="imageDevice">
                <img src={image} />
            </div>
            <div className="wrapAnswers oldOffer clearfix">
                <h1 className="title">Ihre Beschreibung</h1>
                { mapCriterias(oldOffer) }
            </div>
            <div className="wrapAnswers newOffer clearfix">
                <h1 className="title">Geprüfter Zustand</h1>
                { mapCriterias(newOffer)}
            </div>
            <div className="buttons">
                <button className="btn" onClick={acceptOffer}>
                    Akzeptieren, Gerät verkaufen
                </button>
                <p className="decline"><span onClick={declineOffer}>Nicht akzeptieren, Gerät zurücksenden</span></p>
            </div>
        </div>
    )
}

ShowResultsCounterOfferMobile.propTypes = {}
ShowResultsCounterOfferMobile.defaultProps = {}

export default ShowResultsCounterOfferMobile