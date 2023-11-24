import React from 'react'
import PropTypes from 'prop-types'
import OverviewOrdersRepairItemBasket from "./repairItemBasket"

const OverviewOrdersRepair = ( { dataRepair, printShippingDocuments, msg } ) => {
    function mapRepairs(item, i) {
        return <OverviewOrdersRepairItemBasket data={item} key={i}/>
    }
    return (
        <div>
            <div className="col-md-12">
                <div className="header clearfix">
                    <h1>Reparieren ({dataRepair.length})</h1>
                </div>
                <p className="msgField">{ msg }</p>
                <div className="row">
                    <div className="col-md-12 wrapBaskets">
                        { dataRepair.map( mapRepairs )}
                    </div>
                </div>
            </div>
        </div>
    );
}

OverviewOrdersRepair.propTypes = {}
OverviewOrdersRepair.defaultProps = {}

export default OverviewOrdersRepair