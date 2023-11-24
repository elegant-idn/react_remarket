import React, { Component } from 'react'
import {Link} from 'react-router'

import RepairPageDeliveryForm from './delivery/repairPageDeliveryForm'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../actions/basket'

export class RepairPageRepairsList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            repairList: [],
            model: {
                id: null,
                frontImage: null,
                backImage: null,
                title: null
            },
            isPhonePositionFront: true,
            selectedRepairOptions: [],
            totalPrice: 0,
            totalTime: 0
        }

        this.getRepairsList = this.getRepairsList.bind(this)
        this.mapRepairList = this.mapRepairList.bind(this)
        this.rotatePhone = this.rotatePhone.bind(this)
        this.wrapRepairOptionsInRow = this.wrapRepairOptionsInRow.bind(this)
        this.chooseRepairOption = this.chooseRepairOption.bind(this)
        this.mapOptionsOnPhone = this.mapOptionsOnPhone.bind(this)
        this.calculatePriceAndTime = this.calculatePriceAndTime.bind(this)
    }
    componentDidMount(){
        this.getRepairsList()
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.params.model !== this.props.params.model){
            this.getRepairsList(nextProps.params.model)
        }
        if(nextProps.selectedRepairOptions !== this.props.selectedRepairOptions){
            this.calculatePriceAndTime(nextProps.selectedRepairOptions)
        }
    }
    mapOptionsOnPhone(type, item, i){
        let style = { position: 'absolute', margin: `${item.positionY}px 0 0 ${item.positionX}px`},
            className = '',
            { selectedRepairOptions } = this.props
        if(selectedRepairOptions.some(itemSelected => itemSelected.shortcode == item.shortcode)) className = 'active'
        if(item.isBackPosition && type === 'back'){
            return(
                <div className="item-option" key={i} style={style}>
                    <label htmlFor={`option-${item.shortcode}`}  className={className}></label>
                    <span className="title">{item.title}</span>
                </div>
            )
        }
        if(!item.isBackPosition && type === 'front'){
            return(
                <div className="item-option" key={i} style={style}>
                    <label htmlFor={`option-${item.shortcode}`}  className={className}></label>
                    <span className="title">{item.title}</span>
                </div>
            )
        }
    }
    wrapRepairOptionsInRow(){
        let rows = this.state.repairList.map(this.mapRepairList).reduce((r, element, index) => {
            index % 2 === 0 && r.push([])
            r[r.length - 1].push(element)
            return r;
        }, []).map((rowContent ,i) => <div className="row" key={i}>{rowContent}</div> )
        return rows
    }
    getRepairsList( modelParam = this.props.params.model){
        let modelId = modelParam.slice(modelParam.lastIndexOf('-') + 1)
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/getModelRepairList?modelId=${modelId}`)
            .then( response => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ repairList: response.data.repairList, model: response.data.model})
                window.scrollTo(0, document.querySelector('.select-device').offsetTop - 110)
            })
    }
    mapRepairList(item, i){
        let { selectedRepairOptions } = this.props,
            maxPriceInSelectedRepairOption = 0,
            priceValue = item.priceMax,
            domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]
        selectedRepairOptions.forEach(itemSelectedOption => {
            if( +itemSelectedOption.priceMax > maxPriceInSelectedRepairOption) {
                maxPriceInSelectedRepairOption = +itemSelectedOption.priceMax
            }
        })
        if(selectedRepairOptions.length > 0){
            if(maxPriceInSelectedRepairOption > +item.priceMax){
                priceValue = item.minPrice
            }
            else if(maxPriceInSelectedRepairOption == +item.priceMax){
                let firstSelected = this.state.repairList.find( element => {
                    return ( +element.priceMax == maxPriceInSelectedRepairOption
                             && selectedRepairOptions.some( itemSelected => itemSelected.shortcode == element.shortcode)
                    )
                })
                firstSelected.shortcode == item.shortcode ? priceValue = item.priceMax : priceValue = item.minPrice
            }
        }
        return(
            <div className="col-sm-6" key={i}>
                <label className="item-repair-option">
                    <div className="left">
                        <input type="checkbox"
                               id={`option-${item.shortcode}`}
                               checked={ selectedRepairOptions.some( itemSelected => itemSelected.shortcode === item.shortcode)}
                               onChange={() => this.chooseRepairOption(item)}/>
                        <span/>
                        <div className="image">
                            <img src={item.icon || 'https://www.ireparatur.ch/images/repair-icons/battery.png'} alt=""/>
                        </div>
                        <span className="name">{item.title}</span>
                    </div>
                    <div className="right">
                        <span className="price">{priceValue} {domain === 'ch' ? 'CHF' : 'EUR'}</span>
                    </div>
                </label>
            </div>
        )
    }
    chooseRepairOption(option){
        let selectedRepairOptions = [ ...this.props.selectedRepairOptions ]
        if(selectedRepairOptions.some( item => item.shortcode === option.shortcode)){
            selectedRepairOptions = selectedRepairOptions.filter( item => item.shortcode !== option.shortcode)
        }
        else selectedRepairOptions.push(option)
        this.props.basketActions.changeBasketDataRepair(selectedRepairOptions)
    }
    calculatePriceAndTime(selectedRepairOptions){
        let maxPriceSelectedOptions = 0,
            maxTimeSelectedOptions = 0,
            totalPrice = 0,
            totalTime = 0
        selectedRepairOptions.forEach( itemSelectedOption => {
            if( +itemSelectedOption.priceMax >= maxPriceSelectedOptions) {
                maxPriceSelectedOptions = +itemSelectedOption.priceMax
            }
            if( +itemSelectedOption.timeMax >= maxTimeSelectedOptions){
                maxTimeSelectedOptions = +itemSelectedOption.timeMax
            }
        })
        this.state.repairList.forEach( itemRepair => {
            if(selectedRepairOptions.some(itemSelected => itemRepair.shortcode === itemSelected.shortcode)){
                if(+itemRepair.priceMax == maxPriceSelectedOptions){
                    totalPrice += +itemRepair.priceMax
                    maxPriceSelectedOptions = null
                }
                else{
                    totalPrice += +itemRepair.minPrice
                }
                if(+itemRepair.timeMax == maxTimeSelectedOptions){
                    totalTime += +itemRepair.timeMax
                    maxTimeSelectedOptions = null
                }
                else{
                    totalTime += +itemRepair.timeMin
                }
            }
        })
        totalTime = totalTime/3600
        this.setState({ totalPrice, totalTime })
    }
    rotatePhone(){
        this.setState({ isPhonePositionFront: !this.state.isPhonePositionFront })
    }
    render() {
        let { model, repairList, isPhonePositionFront, totalPrice, totalTime } = this.state,
            { selectedRepairOptions, basketActions } = this.props
        return (
            <section className="select-device repair-list-part">
                <p className="title">Reparatur auswählen und Preis berechnen</p>
                { selectedRepairOptions.length > 0 &&
                    <RepairPageDeliveryForm selectedRepairOptions={selectedRepairOptions}
                                            basketActions={basketActions}
                                            model={model}
                                            totalTime={totalTime}
                                            totalPrice={totalPrice}/>
                }
                <div className="container">
                    <div className="wrap-repair-list">
                        <div className="row">
                            <div className="col-md-4 text-center">
                                <p className="title" style={{maxWidth: '270px'}}>{ model.title }</p>
                                <div className={ isPhonePositionFront ? "phone-model" : "phone-model flipped"}>
                                    <div className="model front">
                                        {repairList.map(this.mapOptionsOnPhone.bind(this, 'front'))}
                                        <img src={model.frontImage || 'https://www.ireparatur.ch/images/model-outline/iphone7-front.png'} alt=""/>
                                    </div>
                                    <div className="model back">
                                        {repairList.map(this.mapOptionsOnPhone.bind(this, 'back'))}
                                        <img src={model.backImage || 'https://www.ireparatur.ch/images/model-outline/iphone7-back.png'} alt=""/>
                                    </div>
                                </div>
                                <div style={{maxWidth: '270px'}} className="buttons">
                                    <div className="btn-rotate" onClick={this.rotatePhone}>Gerät umdrehen</div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="repair-options">
                                    { selectedRepairOptions.length > 0 &&
                                        <p className="result">Sehr gut, diese Reparatur / Dienstleistung können wir durchführen und ist (vor Ort) in ca.
                                            <span> {Math.round((+totalTime) * 100) / 100}</span> Stunden für
                                            <span> {Math.round((+totalPrice) * 100) / 100}</span> {window.currencyValue} erledigt</p>
                                    }
                                    <p className="title">Wählen Sie aus der Reparatur-Liste (unten) den Fehler auf Ihrem Gerät, oder direkt auf dem Gerät (links).</p>
                                    {this.wrapRepairOptionsInRow()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-info">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <p>The technical specifications of the iPhone 7 Plus are based on the basic version iPhone 7, but differ in some points. Thus, the screen diagonal of 5.5 inches is slightly larger and the resolution of 1920 x 1080 pixels corresponds to the full HD standard. The device has 3 gigabytes of RAM and also has a higher battery capacity of about 2.900 mAh, which allows up to 384 hours in standby mode. The experts at iReparatur.ch in Basel know the technical features of the iPhone 7 Plus from Apple and offer a wide range of repairs. From the typical iPhone 7 plus glass defect through the silent switch and the battery to the back or front camera, the specialists are familiar with the typical weak points of the device and gladly repair your iPhone 7 Plus. In our branch in the heart of Basel, you can easily preview your iPhone 7 Plus without any appointment agreement.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

function mapStateToProps (state) {
    return {
        selectedRepairOptions: state.basket.basketDataRepair.selectedOptions,
        shippingMethod: state.basket.basketDataRepair.shippingMethod
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(RepairPageRepairsList)