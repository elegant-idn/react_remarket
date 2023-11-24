import React, {Component} from 'react'
import PropTypes from 'prop-types'

import ItemModel from './itemModel'

const ModelsList = ({ models, addModelToBasket, basketData, capacityName, openQuickView, deviceName }) => {
    return (
        <div className="col-md-12">
            { models.map( (model, i ) => <ItemModel model={model}
                                                    position={i}
                                                    capacityName={capacityName}
                                                    basketData={basketData}
                                                    openQuickView={openQuickView}
                                                    addModelToBasket={addModelToBasket}
                                                    key={i}
                                                    deviceName={deviceName}/>) }
        </div>
    );
}

ModelsList.propTypes = {}
ModelsList.defaultProps = {}

export default ModelsList