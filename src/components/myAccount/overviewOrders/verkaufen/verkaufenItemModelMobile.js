import React from 'react'
import PropTypes from 'prop-types'

const OverviewOrdersVerkaufenItemModelMobile = ( { data, acceptOffer, showPriceWithCoupon, coupon } ) => {
    function mapDevices( item, i ){
        let statusBarClass = `statusBarVerkaufen statusId-${item.statusId}`,
            statusTypeClass = `statusTypeVerkaufen statusId-${item.statusId}`,
            showPriceCoupon = coupon.price && !item.counterOfferLink && showPriceWithCoupon
        return(
            <div key={i} className="item-model clearfix" >
                <div className="col-md-12 clearfix">
                    <div className="wrapLine clearfix">
                        <div className="col-xs-6 image">
                            <img src={ item.image } alt=""/>
                        </div>
                        <div className="col-xs-6">
                            <div className="itemWrap clearfix">
                                <span className="modelName">{item.model}{item.extendedTitle && ` (${item.extendedTitle})`}</span>
                                <span className="modelValues-small">
                                    <span>Allgemeiner Zustand:</span><br/>
                                    <span> <b>{ item.criteriaCategory }</b></span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="itemWrap text-center clearfix">
                            <span className="modelValues">
                                    <span>{item.capacity}</span>
                                    {item.color && <span>
                                                        {item.color}&nbsp;
                                                        {item.colorCode && <span className="colorPic"
                                                                                 style={{backgroundColor: item.colorCode}}/>}
                                                    </span>
                                    }
                            </span>
                    </div>
                    <div className="wrapLine clearfix">
                        <div className="col-xs-6">
                            <div className="itemWrap clearfix">
                            <span className="price">
                                { item.counterOfferLink && <p className="oldPrice">{item.oldPrice} {window.currencyValue}</p> }
                                <span className="title">Preis</span><br/>
                                <span className={showPriceCoupon ? 'priceWithoutCoupon' : ''}>{ item.calculatedPrice } {window.currencyValue}</span>
                                {showPriceCoupon && <span className="priceWithCoupon">
                                                            {+item.calculatedPrice + +coupon.price} {window.currencyValue}
                                                        </span>}
                            </span>
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="itemWrap clearfix">
                                <div className="status">
                                    <div className={statusTypeClass}>{item.status}</div>
                                    { (item.statusId !== 100 && item.statusId !== 6 ) &&
                                    <div className="status_bar">
                                        <div className={statusBarClass}></div>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                { item.counterOfferLink &&
                                            <div className="itemWrap counterOfferWrap clearfix">
                                                <div className="col-xs-12 text-left">
                                                    { item.counterOfferLink &&
                                                    <a className="counterOffer" href={item.counterOfferLink} target="_blank">Gegenofferte ansehen</a> }
                                                </div>
                                                <div className="col-xs-12 text-center">
                                                    { item.counterOfferLink && <button className="btn"
                                                                                       onClick={() => acceptOffer(item.purchaseShortcode)}>
                                                        Neues Angebot akzeptieren</button> }
                                                </div>
                                            </div>
                }
                <div className="col-xs-12">
                    <p className="shortcode">
                        <span className="shortcode">ID: {item.purchaseShortcode} /&nbsp;</span>
                        <span className="date">Verkaufdatum: {item.date}</span>
                    </p>
                </div>
            </div>
        )
    }
    return (
        <div>
            {data.map(mapDevices)}
        </div>
    );
}

OverviewOrdersVerkaufenItemModelMobile.propTypes = {}
OverviewOrdersVerkaufenItemModelMobile.defaultProps = {}

export default OverviewOrdersVerkaufenItemModelMobile