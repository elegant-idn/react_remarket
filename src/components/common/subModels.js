import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const SubModels = ( { subModels, type, currentDevice= ''} ) => {
    let currentDeviceName = currentDevice.replace(/-/g, ' ')
    function mapSubmodels( device, i ) {
        let nameForUrl = device.name.split(" ").join('-')
        return  <Link to={`/${type}/${nameForUrl}`}
                     title={`${device.name} ${type}`}
                     className={ currentDeviceName === device.name ? 'activeDevice row' : 'row'}
                         key={i}>
                    <span className="image"><img src={ device.image || '/images/model/iphone.png' } ></img></span>
                    <span className="title">{ device.name }</span>
                </Link>
    }
    return (
        <div>
            { subModels.length > 0 &&
                                        <div>
                                            <h2>Modell auswählen</h2>
                                            <div className="model" id="submodelsList">

                                                { subModels.map( mapSubmodels ) }

                                                <div className="cb"></div>
                                            </div>

                                            <div className="line"></div>
                                        </div>
            }
        </div>
    );
}

SubModels.propTypes = {}
SubModels.defaultProps = {}

export default SubModels