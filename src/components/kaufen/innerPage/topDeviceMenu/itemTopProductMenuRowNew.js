import React, { Component, Fragment } from 'react'
import { Link } from 'react-router'
import Slider from "react-slick";

class ItemTopProductMenuRowNew extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.mapSubmodels = this.mapSubmodels.bind(this)
    }
    mapSubmodels( item ){        
        let { index, params, layer } = this.props;
        let className = "smallModel forBrand";
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
            <span key={`top-product-menu-${item.id}`}>
                <Link to={linkUrl}
                    className={className} style={{paddingLeft: '12px', paddingRight: '12px'}}>
                    {item.deviceModelGroupLogoContent ? 
                    (<div className="image" dangerouslySetInnerHTML={{ __html: item.deviceModelGroupLogoContent}}></div>) : 
                    (<div className="image"><img src={`/images/design/submodel/${item.deviceModelGroupId}.svg`} alt=""/></div>)}
                    <span>
                        { item.deviceModelName }
                    </span>
                </Link>
            </span>
        )
    }
    render() {
        let { submodels, index, params } = this.props
        var settings = {
            dots: false,
            arrows: true,
            infinite: false,
            speed: 300,
            slidesToShow: 7,
            slidesToScroll: 5,
            responsive: [
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 4,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 3
                    }
                }
            ]
        };
        return(
            <Fragment>
                <div className="clearfix container text-center subModels slideEffect topChange">
                    <Fragment>
                        <Slider ref='sliderMod' {...settings}>
                            {submodels.map(this.mapSubmodels)}
                        </Slider>
                    </Fragment>
                </div>
            </Fragment>
        )
    }
}
ItemTopProductMenuRowNew.propTypes = {}
ItemTopProductMenuRowNew.defaultProps = {}
export default ItemTopProductMenuRowNew
