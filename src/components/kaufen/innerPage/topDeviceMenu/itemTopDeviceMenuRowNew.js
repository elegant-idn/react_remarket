import React, { Component, Fragment } from 'react'
import { Link } from 'react-router'
import Slider from "react-slick";

class ItemTopDeviceMenuRowNew extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.mapSubmodels = this.mapSubmodels.bind(this)
    }

    mapSubmodels( item ){
        let { index, params } = this.props,
            className = 'smallModel forBrand',
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
            <span key={`top-device-menu-${item.id}`}>
                <Link to={`/kaufen/${strPrevUrl}filter`}
                    className={className}>
                    {/* {item.logoContent && <div className="image" dangerouslySetInnerHTML={{ __html: item.logoContent}}></div>} */}
                    {item.images && <img src={item.images[0]} className="deviceIcon" alt=""/>}
                    <span>{ item.name }</span>
                </Link>
            </span>
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
                <div className="clearfix container text-center subModels slideEffect bgChange">
                    <Fragment>
                        <Slider ref='sliderMod' {...settings}>
                            {submodels.map(this.mapSubmodels)}
                        </Slider>
                    </Fragment>
                </div>
                { currentSubmodels.length > 0 &&
                    <ItemTopDeviceMenuRowNew submodels={currentSubmodels}
                                          params={params}
                                          index={index + 1}/>
                }
            </Fragment>
        )
    }
}
ItemTopDeviceMenuRowNew.propTypes = {}
ItemTopDeviceMenuRowNew.defaultProps = {}
export default ItemTopDeviceMenuRowNew
