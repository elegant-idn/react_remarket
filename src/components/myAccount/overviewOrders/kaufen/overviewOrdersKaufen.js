import React from 'react'
import PropTypes from 'prop-types'

import OverviewOrdersKaufenItemBasket from './kaufenItemBasket'

const OverviewOrdersKaufen = ( { dataKaufen, printShippingDocuments, msg } ) => {
    return (
        <div>
            <div className="col-md-12">
                <div className="header clearfix">
                    <h1>Gekauft ({dataKaufen.length})</h1>
                </div>
                <p className="msgField">{ msg }</p>
                <div className="row">
                    <div className="col-md-12 wrapBaskets">
                        { dataKaufen.map( ( item, i ) => <OverviewOrdersKaufenItemBasket data={item}
                                                                                         printShippingDocuments={printShippingDocuments}
                                                                                         key={i}/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

OverviewOrdersKaufen.propTypes = {}
OverviewOrdersKaufen.defaultProps = {}

export default OverviewOrdersKaufen