import React, { Component } from 'react';

class ItemModel extends Component {
    constructor(props) {
        super(props);
        this.showQuickView = this.showQuickView.bind(this)
        this.addModelToBasket = this.addModelToBasket.bind(this)
    }

    componentDidMount() {
        if (!window.isMobile) AOS.init()
    }
    componentWillReceiveProps(nextProps) {
        if (!window.isMobile) {
            if (nextProps.model != this.props.model && nextProps.model) {
                $('.itemModel.aos-init').removeClass('aos-animate')
                AOS.init()
            }
        }
    }

    gtagEnhancedEcommerce(){
        let model = this.props.model;
        gtag('event', 'select_content', {
            "content_type": "product",
            "items": [
                {
                    "id": model.shortcode,
                    "name": model.descriptionLong,
                    "list_name": "Kaufen",
                    "quantity": 1,
                    "price": model.discountPrice || model.price,
                    "brand": model.deviceName,
                    "category": this.props.deviceName,
                }
            ]
        });
        let gtagData = {"category": this.props.deviceName};
        window.localStorage.setItem('gtag', JSON.stringify(gtagData))
    }

    showQuickView(e) {
        e.stopPropagation()
        this.props.openQuickView(this.props.model);
        if (window.isGoogleConnection)
            this.gtagEnhancedEcommerce();
    }


    addModelToBasket(e) {
        e.stopPropagation();
        this.props.addModelToBasket(this.props.model)
    }

    handleOpenDetailPage(deviceName, modelName, capacity, color, shortcode) {
        if (window.isGoogleConnection)
            this.gtagEnhancedEcommerce();
        window.open(`//${window.location.host}/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${shortcode}`, '_self')
    }

    render() {
        let {model, addModelToBasket, basketData} = this.props,
            modelName = model.model.split(" ").join('-').toLowerCase() || 'modelName',
            deviceName = model.deviceName.toLowerCase().replace(/ /g, '-') || 'deviceName',
            color = model.color ? model.color.toLowerCase() : 'color',
            capacity = model.capacity ? model.capacity.toLowerCase() : 'capacity',
            rowClass = model.discountPrice ? 'row itemModel discount' : 'row itemModel',
            noAos = (window.isMobile || this.props.position === 0) ? true : undefined,
            prozessor = model.criterias.find(item => item.name == 'Prozessor') ? model.criterias.find(item => item.name == 'Prozessor').values[0].name : '',
            ram = model.criterias.find(item => item.name == 'Arbeitsspeicher') ? model.criterias.find(item => item.name == 'Arbeitsspeicher').values[0].name : '',
            connection = model.criterias.find(item => item.name == 'Verbindungsart') ? model.criterias.find(item => item.name == 'Verbindungsart').values[0].name : ''
        return (
            <div className={rowClass}
                style={{opacity: 1}}
                 //style={noAos && {opacity: 1}}
                 //data-aos="fade"
                 //data-aos-once="true"
                 //data-aos-duration="1000"
                 //data-aos-anchor-placement="bottom-bottom"
                        onClick={e => this.handleOpenDetailPage(deviceName,modelName,capacity,color,model.shortcode)}>
                        {!window.isMobile && <div className='itemModel_helper row' style={{display: "block"}}>
                            <div className="itemMainInfo" >
                                <div className="itemImage">
                                    <img src={model.deviceImages.mainImg.src} alt=""/>
                                </div>
                                <div className="itemSpec">
                                    <span className="modelName">
                                        {model.model}
                                    </span>
                                    <span className="modelCriterias">
                                        {connection}
                                        {prozessor && prozessor + ', '}
                                        {ram && ram + ' RAM'}
                                    </span>                                     
                                </div>
                                <div className="itemSpec">

                                    <span className="modelValues">
                                        <span>
                                            {model.capacity}
                                            {model.capacityImage && <img src={model.capacityImage}/>}
                                        </span>
                                        <span>
                                            {model.color}&nbsp;
                                            {model.colorCode && <span className="colorPic"
                                                                    style={{backgroundColor: model.colorCode}}/>}
                                        </span>
                                    </span>
                                </div>
                                <div className="itemBtn">
                                    <button className="btn detail">Im Detail ansehen<img src="/images/design/preview.svg"/></button>
                                </div>
                                <div className="itemBtn">
                                    <button data-status={basketData.some(item => item.id === model.id) ? 'in' : 'out'}
                                            data-source="listingPage"
                                            className="btn detail"
                                            onClick={(e) => addModelToBasket(e, model)}>
                                        {basketData.some(item => item.id === model.id) ? 'Aus Warenkorb entfernen' : 'In den Warenkorb'}
                                        <img src="/images/design/bag-20.svg"/>
                                    </button>
                                </div>
                            </div>
                            <div className="itemBottomInfo">
                                <div className="itemPlace">
                                    <img src={`/images/design/aside_filter_category_icons/lagerort.svg`} alt=""
                                        style={{width: 16, marginRight: 11}}/>
                                    <span>{model.placeDescription}</span>
                                </div>
                                <div className="itemQuickView" onClick={this.showQuickView}>
                                    <img src={`/images/design/search-zoom-in.svg`} alt=""
                                        style={{width: 16, marginRight: 11}}/>
                                    <span>Schnellvorschau</span>
                                </div>
                                <div className="itemValues">
                                    <div className="wrapValues-small">
                                        <span className="modelValues-small warranty">
                                            <span>Garantie:</span><br/>
                                            <span style={{fontWeight: "bold"}}>{model.warranty.length > 15 ? model.warranty.substr(0,15) + '...' : model.warranty}</span>
                                        </span>
                                            <span className="modelValues-small condition">
                                            <span>Zustand:</span><br/>
                                            <span style={{fontWeight: "bold"}}> {model.condition.length > 15 ? model.condition.substr(0,15) + '...' : model.condition}</span>
                                        </span>
                                        <div className="price-block">
                                            <span className="price">
                                                <span className="title">Preis</span><br/>
                                                {model.discountPrice &&
                                                <span
                                                    className="value discount-price">{model.discountPrice} {window.currencyValue}</span>
                                                }
                                                <span
                                                    className={model.discountPrice ? 'value old-price' : 'value'}>{model.price} {window.currencyValue}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    {window.isMobile && <div className='itemModel_helper row'>
                        <div className="col-md-2 image">
                            <img src={model.deviceImages.mainImg.src} alt=""/>
                        </div>
                        <div className="col-md-10">
                            <div className="itemWrap col-md-12">
                                <div className="col-md-8 col-xs-12">
                                    <span className="modelName">{model.model}
                                        <span className="text-light">
                                            {model.extendedTitle && ` (${model.extendedTitle})`}
                                        </span>
                                    </span>
                                    <span className="modelCriterias">
                                        {connection}
                                        {prozessor && prozessor + ', '}
                                        {ram && ram + ' RAM'}
                                    </span>
                                    <span className="modelValues">
                                        <span>
                                            {model.capacity}
                                            {model.capacityImage && <img src={model.capacityImage}/>}
                                        </span>
                                        <span>
                                            {model.color}&nbsp;
                                            {model.colorCode && <span className="colorPic"
                                                                    style={{backgroundColor: model.colorCode}}/>}
                                        </span>
                                    </span>
                                </div>
                                <span className="modelValues-small for-mobile">
                                    <span>Zustand:</span>
                                    <span> <b>{model.condition}</b></span>
                                </span>
                                <div className="col-sm-4 col-xs-8 price-block">
                                <span className="price">
                                    <span className="title">Preis</span><br/>
                                    {model.discountPrice &&
                                    <span
                                        className="value discount-price">{model.discountPrice} {window.currencyValue}</span>
                                    }
                                    <span
                                        className={model.discountPrice ? 'value old-price' : 'value'}>{model.price} {window.currencyValue}</span>
                                </span>
                                </div>
                                <button data-id={model.id}
                                        data-status={basketData.some(item => item.id === model.id) ? 'in' : 'out'}
                                        data-source="listingPage"
                                        className="btn addToBasket for-mobile"
                                        onClick={(e) => addModelToBasket(e, model)}>
                                </button>
                                <div className="btn addToBasket for-mobile for-mobile_details">
                                    <i className='fa fa-list'/>
                                </div>
                            </div>
                            <div className="itemWrap col-md-12">
                                <div className="col-sm-8">
                                    <div className="wrapValues-small">
                                    <span className="modelValues-small warranty">
                                        <span>Garantie:</span><br/>
                                        <span><b>{model.warranty}</b></span>
                                    </span>
                                        <span className="modelValues-small condition">
                                        <span>Zustand:</span><br/>
                                        <span> <b>{model.condition}</b></span>
                                    </span>
                                    </div>
                                    <button className="quickView" onClick={this.showQuickView}>
                                        Schnellvorschau
                                    </button>
                                </div>
                                <div className="col-sm-4 buttonsBlock">
                                    <button className="btn detail">Im Detail ansehen<i className="fa fa-list"/></button>
                                    <button data-status={basketData.some(item => item.id === model.id) ? 'in' : 'out'}
                                            data-source="listingPage"
                                            className="btn addToBasket"
                                            onClick={(e) => addModelToBasket(e, model)}>
                                        {basketData.some(item => item.id === model.id) ? 'Aus Warenkorb entfernen' : 'In den Warenkorb'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                {(!window.isMobile || window.location.pathname.split('/')[2] === 'zubeh%C3%B6r') ? '' : <div className="col-md-12">
                    <div>
                        <img src={`/images/design/aside_filter_category_icons/lagerort.svg`} alt=""
                             style={{width: 16, marginRight: 11}}/>
                        <span style={{fontSize: 12}}>{model.placeDescription}</span>
                    </div>
                </div>}
            </div>
        )
    }
}


ItemModel.propTypes = {}
ItemModel.defaultProps = {}

export default ItemModel
