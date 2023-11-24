import React, { Component } from 'react'
import { Link } from 'react-router'

class ItemTopProductMenuRow extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.mapSubmodels = this.mapSubmodels.bind(this)
    }
    mapSubmodels( item ){        
        let { index, params, layer } = this.props;
        let className = "smallBrand";
        let filterParams = ''
        if (layer == 0) {
            filterParams = 'kategorie-compatibility-brand=';
        } else if (layer == 1) {
            filterParams = 'kategorie-compatibility-brand1=';
        }
        for(let key in params){
            if(params[key].includes(filterParams)) {
                let brandInfos = params[key].split('=');
                if (brandInfos.length > 1 && brandInfos[1] == item.deviceModelGroupId) {
                    className += ' current';
                }
            }
        }
        let linkUrl = ''
        if (layer == 0) {
            linkUrl = `/kaufen/${params.deviceCategory1}/${params.deviceCategory2}/filter/kategorie-compatibility-brand=${item.deviceModelGroupId}`;
        } else if (layer == 1) {
            linkUrl = `/kaufen/${params.deviceCategory1}/${params.deviceCategory2}/filter/kategorie-compatibility-brand=${item.deviceModelParentGroupId}/kategorie-compatibility-brand1=${item.deviceModelGroupId}`;
        }
        
        return(
            <Link to={linkUrl}
                  className={className}
                  key={item.deviceModelGroupId} style={{paddingLeft: '12px', paddingRight: '12px'}}>
                {/* {item.deviceModelGroupLogoContent ? 
                (<div className="image" dangerouslySetInnerHTML={{ __html: item.deviceModelGroupLogoContent}}></div>) : 
                (<div className="image"><img src={`/images/design/submodel/${item.deviceModelGroupId}.svg`} alt=""/></div>)} */}
                <span>
                    {/* <img src={`/images/design/submodel/${item.deviceModelGroupId}.svg`} style={{maxWidth: '25px', height: '25px', marginRight: '3px'}} alt=""/> */}
                    { item.deviceModelName }
                </span>
            </Link>
        )
    }
    render() {
        let { submodels, index, params } = this.props
        return(
            <div>
                <div className="clearfix text-center subModels">
                    <div style={{maxWidth: "970px"}}>
                        {submodels.map(this.mapSubmodels)}
                    </div>
                </div>
            </div>
        )
    }
}
ItemTopProductMenuRow.propTypes = {}
ItemTopProductMenuRow.defaultProps = {}
export default ItemTopProductMenuRow
