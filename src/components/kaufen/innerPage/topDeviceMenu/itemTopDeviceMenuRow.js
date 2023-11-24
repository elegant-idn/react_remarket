import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

class ItemTopDeviceMenuRow extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.mapSubmodels = this.mapSubmodels.bind(this)
    }

    mapSubmodels( item ){
        let { index, params } = this.props,
            className = 'smallBrand',
            strPrevUrl = ''
        /*get prev url*/
        for(let key in params){
            let paramKeyIndex = key.slice(14)
            if(key.includes('deviceCategory') && params[key] && +paramKeyIndex < index) strPrevUrl += params[key] + '/'
        }
        /*add current name*/
        strPrevUrl += item.name.toLowerCase().replace(/ /g, '-') + '/'
        /*add submodels url*/
        /*
        we need to ignore submdels url for now
        function mapSubmodels(submodels){
            strPrevUrl += submodels[0].name.replace( / /g, '-').toLowerCase() + '/'
            if(submodels[0].submodels) mapSubmodels(submodels[0].submodels)
        }
        if(item.submodels) mapSubmodels(item.submodels)
        */

        if( params['deviceCategory' + index]
            && params['deviceCategory' + index].replace( /-/g, ' ') === item.name.toLowerCase()) className += ' current'
        return(
            <Link to={`/kaufen/${strPrevUrl}filter`}
                  className={className}
                  key={item.id}>
                {/* {item.logoContent && <div className="image" dangerouslySetInnerHTML={{ __html: item.logoContent}}></div>} */}
                {item.images && <img src={item.images[0]} className="deviceIcon" alt=""/>}
                <span>{ item.name }</span>
            </Link>
        )
    }
    render() {
        let { submodels, index, params } = this.props,
            currentDevice = [],
            currentSubmodels = []
        if(params['deviceCategory' + index]){
            currentDevice = submodels.filter( item => item.name.toLowerCase() == params['deviceCategory' + index].replace( /-/g, ' ') )
        }
        if(currentDevice[0] && currentDevice[0].submodels) currentSubmodels = currentDevice[0].submodels
        return(
            <div>
                <div className="clearfix text-center subModels">
                    <div style={{maxWidth: "970px"}}>
                        {submodels.map(this.mapSubmodels)}
                    </div>
                </div>
                { currentSubmodels.length > 0 &&
                    <ItemTopDeviceMenuRow submodels={currentSubmodels}
                                          params={params}
                                          index={index + 1}/>
                }
            </div>
        )
    }
}
ItemTopDeviceMenuRow.propTypes = {}
ItemTopDeviceMenuRow.defaultProps = {}
export default ItemTopDeviceMenuRow
