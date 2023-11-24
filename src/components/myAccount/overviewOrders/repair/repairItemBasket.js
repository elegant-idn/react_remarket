import React from 'react'
import PropTypes from 'prop-types'

import OverviewOrdersRepairItemModel from "./repairItemModel"
import OverviewOrdersRepairItemModelMobile from "./repairItemModelMobile"

const OverviewOrdersRepairItemBasket = ( { data } ) => {
    return(
        <div className="overview_orders_item_basket repair clearfix">
            {!window.isMobile && <OverviewOrdersRepairItemModel data={data}/> }
            {window.isMobile && <OverviewOrdersRepairItemModelMobile data={data}/> }
        </div>
    )
}

OverviewOrdersRepairItemBasket.propTypes = {}
OverviewOrdersRepairItemBasket.defaultProps = {}

export default OverviewOrdersRepairItemBasket