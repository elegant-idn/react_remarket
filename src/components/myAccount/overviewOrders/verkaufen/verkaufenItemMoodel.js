import React from 'react'
import PropTypes from 'prop-types'

const OverviewOrdersVerkaufenItemModel = ( { data, acceptOffer, showPriceWithCoupon, coupon } ) => {
    function mapDevices( item, i ){
        let statusBarClass = `statusBarVerkaufen statusId-${item.statusId}`,
            statusTypeClass = `statusTypeVerkaufen statusId-${item.statusId}`,
            showPriceCoupon = coupon.price && !item.counterOfferLink && showPriceWithCoupon
        return(
            <div key={i} className="item-model clearfix" >
                <div className="col-md-12">
                    <div className="col-sm-2 col-xs-6">
                        <img src={ item.image } alt=""/>
                    </div>
                    <div className="col-sm-10">
                        <div className="itemWrap clearfix">
                            <div className="col-xs-9">
                                <span className="modelName">{item.model}{item.extendedTitle && ` (${item.extendedTitle})`}</span>
                                <span className="modelValues">
                            <span>{item.capacity}</span>
                            {item.color && <span>{item.color}&nbsp;
                                                  {item.colorCode && <span className="colorPic"
                                                                           style={{backgroundColor: item.colorCode}}/>}
                                            </span>
                            }
                         </span>
                            </div>
                            <div className="col-xs-3">
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
                        <div className="itemWrap clearfix">
                            <div className="col-xs-9">

                            <span className="modelValues-small">
                                <span>Allgemeiner Zustand:</span><br/>
                                <span> <b>{ item.criteriaCategory }</b></span>
                            </span>
                            </div>
                            <div className="col-xs-3">
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
                        { item.counterOfferLink &&
                        <div className="itemWrap counterOfferWrap clearfix">
                            <div className="col-xs-9 text-right">
                                { item.counterOfferLink && <button className="btn"
                                                                   onClick={() => acceptOffer(item.purchaseShortcode)}>
                                    Neues Angebot akzeptieren</button> }
                            </div>
                            <div className="col-xs-3">
                                { item.counterOfferLink &&
                                <a className="counterOffer" href={item.counterOfferLink} target="_blank">Gegenofferte ansehen</a> }

                            </div>
                        </div>
                        }
                    </div>
                </div>
                <div className="col-md-12">
                    <span className="shortcode">ID: {item.purchaseShortcode} /&nbsp;</span>
                    <span className="date">Verkaufdatum: {item.date}</span>
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

OverviewOrdersVerkaufenItemModel.propTypes = {}
OverviewOrdersVerkaufenItemModel.defaultProps = {}

export default OverviewOrdersVerkaufenItemModel