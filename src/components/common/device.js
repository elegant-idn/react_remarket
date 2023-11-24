import React from 'react'
import { Link } from 'react-router'

const Device = ( { devices, type, currentDevice='', currentSubmodel='', setBrands, subModels } ) => {
    let currentDeviceName = currentDevice.replace(/-/g, ' ')
    let currentSubmodelName = currentSubmodel.replace(/-/g, ' ')

    function mapDevices( device, i ) {
        let nameForUrl = device.name.split(" ").join('-')
        if(device.submodels.length > 0){
            return <Link to={`/${type}`}
                                title={`${device.name} ${type}`}
                                onClick={ () => setBrands(device.submodels) }
                                className={ device.submodels === subModels ? 'activeDevice row' : 'row'}
                                key={i}>
                        <span className="image"><img src={ device.image || '/images/model/iphone.png' } ></img></span>
                        <span className="title">{ device.name }</span>
                    </Link>
        }
    }
    return (
        <div>
            <div className="model" id="devicesList">

                { devices.map( mapDevices ) }

                <div className="cb"></div>
            </div>

            <div className="line"></div>
        </div>
    )
}

export default Device;