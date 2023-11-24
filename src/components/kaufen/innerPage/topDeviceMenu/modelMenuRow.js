import React, { PureComponent, Fragment } from 'react'
import { Link } from "react-router";
import Slider from "react-slick";

class ModelMenuRow extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentSlide: null,
        }
    }

    mapModels = (item, key) => {
        const  { params } = this.props;
        let className = 'smallModel';
        Object.values(params).map((param) => {
           if(param.replace(/modell=/, '') == item.id){
               className = className + ' current';
               if(!this.state.currentSlide || this.state.currentSlide != key){
                   this.setState({currentSlide: key});
               }
           }
        });

        let isModel = Object.values(params).find((param) => param.includes('modell='));
        if (!isModel && this.state.currentSlide ){
            this.setState({currentSlide: null});
        }
        let url = `/kaufen/`;
        url = params.deviceCategory1 ? url + params.deviceCategory1 : url;
        url = params.deviceCategory2 ? url + '/' + params.deviceCategory2 : url;
        url = params.deviceCategory3 ? url + '/' + params.deviceCategory3 : url;
        url = params.deviceCategory4 ? url + '/' + params.deviceCategory4 : url;
        url = params.deviceCategory5 ? url + '/' + params.deviceCategory5 : url;
        url += `/filter/modell=${item.id}`        
        return(
            <span key={item.id}>
                <Link to={url}
                      className={className}>
                    {
                        item.deviceImages && <img src={item.deviceImages.mainImg.src} className="deviceIcon" alt=""/>
                    }
                    <span >{ item.name }</span>
                </Link>
            </span>

        )
    };

    render() {
         let { models, params } = this.props;
        models.sort(function(a, b){
            return a.orderBy-b.orderBy;
        });
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
                        slidesToShow: 3,
                        slidesToScroll: 2
                    }
                }
            ]
        };
        const maxcount = window.isMobile ? 3 : 5;
        return (
                <Fragment>
                    <div className="clearfix container text-center subModels">
                        { !window.isMobile && !!models.length &&
                            <Link  className="backButton" to={`/kaufen/${params.deviceCategory1}/filter/`}>
                                <img src="/images/icons/arrow-back.svg" alt="" />
                            </Link>
                        }
                        { !!models.length && models.length > maxcount &&
                                <Fragment>
                                    <Slider ref='sliderMod' {...settings}>
                                        {models.map(this.mapModels)}
                                    </Slider>
                                </Fragment>

                        }
                        {
                            models.length <= maxcount &&
                            <div>
                                { models.map(this.mapModels) }
                            </div>
                        }

                    </div>
                </Fragment>
            )

    }
}

export default ModelMenuRow
