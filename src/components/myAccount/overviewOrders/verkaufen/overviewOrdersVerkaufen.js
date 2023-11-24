import React from 'react'
import PropTypes from 'prop-types'

import OverviewOrdersVerkaufenItemBasket from './verkaufenItemBasket'

const OverviewOrdersVerkaufen = ( { dataVerkaufen, printShippingDocuments, msg, acceptOffer } ) => {
    return (
        <div className="col-md-12">
            <div className="header clearfix">
                    <h1>Verkauft ({dataVerkaufen.length})</h1>
            </div>
            <p className="msgField">{ msg }</p>
            <div className="row">
                <div className="col-md-12 wrapBaskets">
                    { dataVerkaufen.map( ( item, i ) =>
                        <OverviewOrdersVerkaufenItemBasket data={item}
                                                           acceptOffer={acceptOffer}
                                                           printShippingDocuments={printShippingDocuments}
                                                           key={i}/>
                    )}
                </div>
            </div>
        </div>
    )
}

OverviewOrdersVerkaufen.propTypes = {}
OverviewOrdersVerkaufen.defaultProps = {}

export default OverviewOrdersVerkaufen