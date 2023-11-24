import React, { Fragment, PureComponent } from 'react';
import { Link } from "react-router";
import Slider from "react-slick";


class ProductModelMenuRowNew extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentSlide: null,
        }
    }

    mapModels = (item, key) => {
        const  { params } = this.props;
        let className = 'smallModel';
        for(let key in params){
            if(params[key].includes('kategorie-compatibility=')) {
                let modelInfos = params[key].split('=');
                if (modelInfos.length > 1 && modelInfos[1] == item.id) {
                    className += ' current';
                }
            }
        }
        let linkUrl = ''
        linkUrl = item.modelSubGroupId ? 
            `/kaufen/${params.deviceCategory1}/${params.deviceCategory2}/filter/kategorie-compatibility-brand=${item.modelGroupId}/kategorie-compatibility-brand1=${item.modelSubGroupId}/kategorie-compatibility=${item.id}`
            :
            `/kaufen/${params.deviceCategory1}/${params.deviceCategory2}/filter/kategorie-compatibility-brand=${item.modelGroupId}/kategorie-compatibility=${item.id}`;
        return(
            <span key={`product-menu-${item.id}`}>
                <Link to={linkUrl}
                      className={className}>
                    {
                        item.image && <img src={item.image} className="deviceIcon" alt=""/>
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
                        slidesToShow: 5,
                        slidesToScroll: 3
                    }
                }
            ]
        };
        const maxcount = window.isMobile ? 3 : 5;
        return (
                <Fragment>
                    <div className="clearfix container text-center subModels slideEffect bgChange">
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

export default ProductModelMenuRowNew
