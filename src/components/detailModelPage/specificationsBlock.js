import React from 'react'
import PropTypes from 'prop-types'
import Masonry from 'react-masonry-component'
import ScrollAnimation from 'react-animate-on-scroll'

const SpecificationsBlock = ( { specifications, additionalSpecifications }) => {
    function mapSpecification( itemSpecification, i ){
        return(
            <div className="col-sm-6 col-xs-12 item-specification-block" key={i}>
                <ScrollAnimation animateOnce={true} animateIn="fadeIn" offset={i <= 1 ? 0 : 150}>
                    <div key={i} className="box-category">
                        <h3>
                            { itemSpecification.categoryName }
                            { itemSpecification.categoryDescription &&
                            <div className="descriptionBlock" >
                                <i className="fa fa-info" aria-hidden="true"></i>
                                <div className="descriptionOptions">
                                    <p>{itemSpecification.categoryDescription}</p>
                                </div>
                            </div>
                            }
                        </h3>
                        {
                            itemSpecification.options.map( ( itemOption, i ) => {
                                return(
                                    <div key={i} className="box-specifications">
                                        <div>
                                        <span className="box-specifications-option">
                                            { itemOption.optionName}
                                            { itemOption.optionDescription &&
                                            <div className="descriptionBlock" >
                                                <i className="fa fa-info" aria-hidden="true"></i>
                                                <div className="descriptionOptions">
                                                    <p>{itemOption.optionDescription}</p>
                                                </div>
                                            </div>
                                            }:
                                        </span>
                                        <strong></strong>
                                            <span className="box-specifications-values">
                                            {
                                                itemOption.values.map( ( itemValue, i ) =>{
                                                    return(
                                                        <span className="value" key={i}>
                                                            {itemValue.valueName}
                                                            {itemValue.valueName === 'Ja' && <span className="circleJa"/> }
                                                            { itemValue.valueDescription &&
                                                            <div className="descriptionBlock" >
                                                                <i className="fa fa-info" aria-hidden="true"/>
                                                                <div className="descriptionOptions">
                                                                    <p>{itemValue.valueDescription}</p>
                                                                </div>
                                                            </div>
                                                            }
                                                            { i < itemOption.values.length - 1 ? ', ' : null}
                                                        </span>
                                                    )
                                                })
                                            }
                                        </span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </ScrollAnimation>
            </div>
        )
    }
    function mapAdditionalSpecifications() {
        let arrayElements = []
        for ( let key in additionalSpecifications ){
            let value = ''
            switch (key){
                case 'SIMLock':
                    additionalSpecifications[key] === 0 ? value = 'Nein' : 'Ja'
                    arrayElements.push(
                        <div key={key} className="box-specifications">
                            <div>
                                <span className="box-specifications-option">SIM-Lock:</span>
                                <strong></strong>
                                <span className="box-specifications-values">
                                    { value }
                                    { value === 'Ja' && <span className="circleJa"/> }
                                </span>
                            </div>
                        </div>
                    )
                    break
                case 'cloudLock':
                    additionalSpecifications[key] === 0 ? value = 'Nein' : 'Ja'
                    arrayElements.push(
                        <div key={key} className="box-specifications">
                            <div>
                                <span className="box-specifications-option">Cloud-Lock:</span>
                                <strong></strong>
                                <span className="box-specifications-values">
                                    { value }
                                    { value === 'Ja' && <span className="circleJa"/> }
                                </span>
                            </div>
                        </div>
                    )
                    break
                case 'batteryCapacity':
                    value = additionalSpecifications[key];
                    arrayElements.push(
                        <div key={key} className="box-specifications">
                            <div>
                                <span className="box-specifications-option">Batteriekapazität:</span>
                                <strong></strong>
                                <span className="box-specifications-values">{ value == -1 ? "n.v." : `${value} %` }</span>
                            </div>
                        </div>
                    )
                    break
                case 'operationSystemVersion':
                    value = additionalSpecifications[key];
                    arrayElements.push(
                        <div key={key} className="box-specifications">
                            <div>
                                <span className="box-specifications-option">Betriebssystem Version:</span>
                                <strong></strong>
                                <span className="box-specifications-values">{ value == -1 ? "n.v." : value }</span>
                            </div>
                        </div>
                    )
                    break
            }
        }
        return (
            <div className="col-sm-6 col-xs-12 item-specification-block" key="detail">
                <ScrollAnimation animateOnce={true} animateIn="fadeIn">
                    <div className="box-category">
                        <h3>Detaillierte Informationen</h3>
                        {arrayElements}
                    </div>
                </ScrollAnimation>
            </div>
        )
    }

    let additionalSpecification = additionalSpecifications && Object.keys(additionalSpecifications).length > 0 && mapAdditionalSpecifications()
    let allSpecifications = specifications ? [...specifications.map( mapSpecification ), additionalSpecification] : []

    return (
        <div className="specificationsBlock">
            <div>
                <Masonry className={'wrap-specifications'} disableImagesLoaded={true}>
                    { allSpecifications }
                </Masonry>
            </div>
        </div>
    )
}

SpecificationsBlock.propTypes = {}
SpecificationsBlock.defaultProps = {}

export default SpecificationsBlock