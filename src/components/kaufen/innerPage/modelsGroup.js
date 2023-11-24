import React from 'react'
import PropTypes from 'prop-types'

const ModelsGroup = ({ models, handleClickItemGroup }) => {
    return (
        <div>
            <div className="col-md-12">
                { models.map( (model, i ) => {
                    return(<div key={i}
                                className="modelsGroupItem"
                                onClick={handleClickItemGroup}
                                data-model={model.model}
                                data-capacity={model.capacity}
                                data-color={model.color}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <img src={ model.image || "/images/model/iphone.png"}  alt=""/>
                                    </div>
                                    <div className="col-md-9">
                                        <sapn>Modell: {model.model}  </sapn>
                                        <sapn>Kapazität: {model.capacity}  </sapn>
                                        <sapn>Farbe: {model.color}  </sapn>
                                        <hr></hr>
                                        <div className="row conditionPrice">
                                            <div className="col-md-2">
                                                <p>Stake Gebrauchsspuren</p>
                                                <p>{model.firstConditionMinPrice === 0 ? '-' : model.firstConditionMinPrice + ` ${window.currencyValue}`}</p>
                                            </div>
                                            <div className="col-md-3">
                                                <p>Leichte Gebrauchsspuren</p>
                                                <p>{model.secondConditionMinPrice === 0 ? '-' : model.secondConditionMinPrice + ` ${window.currencyValue}`}</p>
                                            </div>
                                            <div className="col-md-2">
                                                <p>wie Neu</p>
                                                <p>{model.thirdConditionMinPrice === 0 ? '-' : model.thirdConditionMinPrice + ` ${window.currencyValue}`}</p>
                                            </div>
                                            <div className="col-md-2">
                                                <p>Neu in Folie</p>
                                                <p>{model.fourthConditionMinPrice === 0 ? '-' : model.fourthConditionMinPrice + ` ${window.currencyValue}`}</p>
                                            </div>
                                            <div className="col-md-2">
                                                <p>Neu in OVP (verschweist)</p>
                                                <p>{model.fivesConditionMinPrice === 0 ? '-' : model.fivesConditionMinPrice + ` ${window.currencyValue}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    )
                }) }
            </div>
        </div>
    );
}

ModelsGroup.propTypes = {}
ModelsGroup.defaultProps = {}

export default ModelsGroup