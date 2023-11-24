import React from 'react'
import PropTypes from 'prop-types'

import OverviewOrdersVerkaufenItemModel from './verkaufenItemMoodel'
import OverviewOrdersVerkaufenItemModelMobile from './verkaufenItemModelMobile'

const OverviewOrdersVerkaufenItemBasket = ( { data, printShippingDocuments, acceptOffer } ) => {
    function printDocuments(){
        return printShippingDocuments(data.devices, data.basketPayoutId)
    }
    return (
        <div className="overview_orders_item_basket clearfix">
            {!window.isMobile ?
                <div>
                    <OverviewOrdersVerkaufenItemModel data={data.devices}
                                                      coupon={data.coupon}
                                                      showPriceWithCoupon={data.devices.length === 1}
                                                      acceptOffer={acceptOffer} />
                    <div className="col-xs-12">
                        <div className="col-xs-9 text-right">
                            <span className="shortcode">Auftragsnummer: {data.shortcode}</span>
                            {data.showShippingDocuments &&
                                                            <span className="downloadPdf"
                                                                  onClick={ printDocuments }>Versanddokumente herunterladen</span>
                            }
                        </div>
                        <div className="col-xs-3">
                            {data.trackingLink && <a href={data.trackingLink}
                                                     className="tracking"
                                                     target="_blank">
                                                  Paket verfolgen</a>
                            }
                        </div>
                    </div>
                </div>

                :
                <div>
                    <OverviewOrdersVerkaufenItemModelMobile data={data.devices}
                                                            coupon={data.coupon}
                                                            showPriceWithCoupon={data.devices.length === 1}
                                                            acceptOffer={acceptOffer} />
                    <div className="col-xs-12">
                        <div className="col-xs-12">
                            <span className="shortcode">Auftragsnummer: {data.shortcode}</span>
                        </div>
                        <div className="col-xs-12">
                            {data.showShippingDocuments &&
                                                            <span className="downloadPdf"
                                                                  onClick={ printDocuments }>Versanddokumente herunterladen</span>
                            }
                            {data.trackingLink && <a href={data.trackingLink}
                                                     className="tracking"
                                                     target="_blank">
                                                  Paket verfolgen</a>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

OverviewOrdersVerkaufenItemBasket.propTypes = {}
OverviewOrdersVerkaufenItemBasket.defaultProps = {}

export default OverviewOrdersVerkaufenItemBasket