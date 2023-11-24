import React from 'react'
import PropTypes from 'prop-types'

import OverviewOrdersKaufenItemModel from './kaufenItemModel'
import OverviewOrdersKaufenItemModelMobile from './kaufenItemModelMobile'

const OverviewOrdersKaufenItemBasket = ( { data, printShippingDocuments } ) => {
    function printDocuments(){
        return printShippingDocuments(data.shortcode)
    }
    return (
        <div className="overview_orders_item_basket clearfix">
            {!window.isMobile ?
                <div>
                    <OverviewOrdersKaufenItemModel data={data.devices}/>
                    <div className="col-xs-12">
                        <div className="col-xs-9 text-right">
                            <span className="shortcode">Auftragsnummer: {data.shortcode}</span>
                            {data.showShippingDocuments &&
                                                            <span className="downloadPdf"
                                                                  onClick={ printDocuments }>Rechnung herunterladen</span>
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
                    <OverviewOrdersKaufenItemModelMobile data={data.devices}/>
                    <div className="col-xs-12">
                        <div className="col-xs-6">
                            <span className="shortcode">Auftragsnummer: {data.shortcode}</span>
                        </div>
                        <div className="col-xs-6">
                            {data.trackingLink && <a href={data.trackingLink}
                                                     className="tracking"
                                                     target="_blank">
                                                  Paket verfolgen</a>
                            }
                            {data.showShippingDocuments &&
                                                            <span className="downloadPdf"
                                                                  onClick={ printDocuments }>Versanddokumente herunterladen</span>
                            }
                        </div>
                    </div>
                </div>

            }

        </div>
    )
}

OverviewOrdersKaufenItemBasket.propTypes = {}
OverviewOrdersKaufenItemBasket.defaultProps = {}

export default OverviewOrdersKaufenItemBasket