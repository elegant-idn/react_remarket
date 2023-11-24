import React from 'react'
import PropTypes from 'prop-types'

const ShowResultsCounterOffer = ({ oldOffer, newOffer, oldPrice, newPrice, image, comment, acceptOffer, declineOffer, couponTotal = 0}) => {

    function mapCriterias(offer) {
        let content = offer.map((item, i) => {
            let className = item.changes ? 'changed' : ''
            return(
                <div className="col-sm-4 itemAnswer" key={i}>
                    <p className="title">{item.name}</p>
                    <ul>{item.values.map( (item, i) => <li key={i} className={className}>{item}</li>)}</ul>
                    <div className="clearfix"></div>
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
        <div className="modal fade bs-example-modal-lg"
             id="modalCounterOffer"
             tabIndex="-1"
             role="dialog"
             aria-labelledby="myLargeModalLabel">
            <div className="modal-dialog modal-lg" role="document">

                <div className="btnCloseModal"
                     data-dismiss="modal"
                     onClick={ () => $('#modalCounterOffer').modal('hide') }>
                    <i className="fa fa-times" aria-hidden="true"/>
                </div>
                <div className="modal-content">
                    <div className="row">
                        <div className="col-sm-7 left-part">
                            <div className="wrap">
                                <div className="col-sm-5">
                                    <div className="image">
                                        <img src={'/images/design/guy-banner.svg'} alt=""/>
                                    </div>
                                </div>
                                <div className="col-sm-7 counter-offer">
                                    <h1>Gegenofferte</h1>
                                    <div className="say">
                                        <p>Wir haben bei Ihrem Ankauf eine Abweichung der eingesendeten Angaben gefunden und offerieren Ihnen einen neuen Preis. Sie können diesen akzeptieren oder ablehnen.</p>
                                        { comment && <p><br /><br /><h4>Kommentar:</h4> {comment}</p>}
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
                                                    <div className="couponPrice">{ `+${couponTotal}` } {window.currencyValue}</div>
                                                </div>
                                            </div>
                                            <div className="coupon-right">
                                                <h3 className="title">Total</h3>
                                                <p className="newPrice">{ (parseFloat(newPrice) + parseFloat(couponTotal)).toFixed(2) } {window.currencyValue}</p>
                                                <p className="oldPrice">{ newPrice } {window.currencyValue}</p>
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5 col-sm-push-7">
                            <div className="criterias">
                                <div className="image">
                                    <img src={image} alt=""/>
                                </div>
                                <div className="wrapAnswers oldOffer clearfix">
                                    <h1 className="title">Ihre Beschreibung</h1>
                                    { mapCriterias(oldOffer) }
                                </div>
                                <div className="wrapAnswers newOffer clearfix">
                                    <h1 className="title">Geprüfter Zustand</h1>
                                    { mapCriterias(newOffer)}
                                </div>
                            </div>
                            <div className="text-left buttons">

                                <button className="btn" onClick={acceptOffer}>
Akzeptieren, Gerät verkaufen<span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                </button>
                                <p className="decline"><span onClick={declineOffer}>Nicht akzeptieren, Gerät zurücksenden</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ShowResultsCounterOffer.propTypes = {}
ShowResultsCounterOffer.defaultProps = {}

export default ShowResultsCounterOffer