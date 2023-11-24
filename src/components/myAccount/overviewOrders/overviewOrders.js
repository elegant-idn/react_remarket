import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Select from 'react-select';
import  {connect} from 'react-redux'

import OverviewOrdersVerkaufen from './verkaufen/overviewOrdersVerkaufen'
import OverviewOrdersKaufen from './kaufen/overviewOrdersKaufen'
import OverviewOrdersRepair from "./repair/overviewOrdersRepair";

export class OverviewOrders extends Component {
    constructor(props) {
        super(props)

        this.state = {
            years: {
                allYearsVerkaufen: [],
                allYearsKaufen: [],
                allYears: [],
                currentYear: ''
            },
            data: {
                dataVerkaufen: [],
                dataKaufen: {
                    baskets: [],
                    totalPrice: ''
                },
                dataRepair: []
            },
            messages: {
                verkaufen: '',
                kaufen: '',
                repair: ''
            },
            currentTypeOrder: 'All',

        }

        this._getOrdersVerkaufen = this._getOrdersVerkaufen.bind(this)
        this._getOrdersKaufen = this._getOrdersKaufen.bind(this)
        this._getOrdersRepair = this._getOrdersRepair.bind(this)
        this._getYears = this._getYears.bind(this)
        this.changeYear = this.changeYear.bind(this)
        this.changeCurrentTypeOrder = this.changeCurrentTypeOrder.bind(this)
        this.printShippingDocumentsSell = this.printShippingDocumentsSell.bind(this)
        this.printShippingDocumentsBuy = this.printShippingDocumentsBuy.bind(this)
        this.acceptOffer = this.acceptOffer.bind(this)
        this.getData = this.getData.bind(this)

    }

    componentWillReceiveProps( nextProps ){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            browserHistory.push('/')
        }
    }
    componentDidMount(){
        this._getYears()
    }
    _getOrdersVerkaufen(currentYear){
        document.getElementById('spinner-box-load').style.display = 'block'
        return axios.get(`/api/sellOrdersOverview?year=${currentYear}`)
    }
    _getOrdersKaufen(currentYear){
        document.getElementById('spinner-box-load').style.display = 'block'
        return axios.get(`/api/buyOrdersOverview?year=${currentYear}`)
    }
    _getOrdersRepair(currentYear){
        document.getElementById('spinner-box-load').style.display = 'block'
        return axios.get(`/api/repairOrdersOverview?year=${currentYear}`)
    }
    async getData(currentYear){
        let kaufen = this._getOrdersKaufen(currentYear),
            verkaufen = this._getOrdersVerkaufen(currentYear),
            repair = this._getOrdersRepair(currentYear),
            dataKaufen = await kaufen,
            dataVerkaufen = await verkaufen,
            dataRepair = await repair

        return {dataVerkaufen: dataVerkaufen.data, dataKaufen: dataKaufen.data, dataRepair: dataRepair.data}

    }
    _getYears(){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/ordersYearsList`)
            .then( ( { data } ) => {
                let verkaufenMsg = '',
                    kaufenMsg = '',
                    repairMsg = ''

                document.getElementById('spinner-box-load').style.display = 'none'
                if(data.allYears.length > 0) {
                    this.getData(data.allYears[0])
                        .then( result => {
                            document.getElementById('spinner-box-load').style.display = 'none'
                            this.setState({ data: { ...this.state.data,
                                                    dataVerkaufen: result.dataVerkaufen,
                                                    dataRepair: result.dataRepair,
                                                    dataKaufen: result.dataKaufen }
                            })
                        })
                }
                else {
                    kaufenMsg = 'No data'
                    verkaufenMsg = 'No data'
                    repairMsg = 'No data'
                }

                let allYears = []
                    data.allYears.forEach( item => allYears.push({ value: item, label: item} ))

                this.setState({ years: { ...this.state.years, allYearsVerkaufen: data.sellYears,
                                        allYearsKaufen: data.buyYears,
                                        allYears: allYears,
                                        currentYear: data.allYears[0]
                                        },
                                messages: { ...this.state.messages,
                                            verkaufen: verkaufenMsg,
                                            kaufen: kaufenMsg,
                                            repair: repairMsg}
                                })
            })
    }

    changeYear(e){
        let { value } = e

        this.getData(value)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ data: { ...this.state.data,
                                        dataVerkaufen: result.dataVerkaufen,
                                        dataRepair: result.dataRepair,
                                        dataKaufen: result.dataKaufen },
                                years: {...this.state.years, currentYear: value}
                })
            })
    }
     changeCurrentTypeOrder(e){
        let value = e.target.getAttribute('data-typeorder')
        this.setState({ currentTypeOrder: value })
     }
     printShippingDocumentsSell(devices, basketPayoutId){
        let data = { devices, basketPayoutId }
        document.getElementById('spinner-box-load').style.display = 'block'
        let windowPdf = window.open(`//${window.location.host}/load-pdf`, '_blank')
        windowPdf.onload = function() {
            let loadPdf = windowPdf.document.createElement('div')
            loadPdf.className = "loadPdf"
            windowPdf.document.body.appendChild(loadPdf)
        }
        axios.post('/api/overviewGeneratePDF', data)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                windowPdf.location = result.data
            })
    }
     printShippingDocumentsBuy(shortcode){
         document.getElementById('spinner-box-load').style.display = 'block'
         let windowPdf = window.open(`//${window.location.host}/load-pdf`, '_blank')
         windowPdf.onload = function() {
             let loadPdf = windowPdf.document.createElement('div')
             loadPdf.className = "loadPdf"
             windowPdf.document.body.appendChild(loadPdf)
         }
         axios.get(`/api/printInvoice?basketShortcode=${shortcode}`)
             .then( result => {
                 document.getElementById('spinner-box-load').style.display = 'none'
                 windowPdf.location = result.data.link
             })
     }
    acceptOffer(shortcode){
         document.getElementById('spinner-box-load').style.display = 'block'
         axios.get(`/api/counterOfferAnswer?shortcode=${shortcode}&answer=1`)
             .then( result => {
                 document.getElementById('spinner-box-load').style.display = 'none'
                 let { currentTypeOrder, years } = this.state

                 if(currentTypeOrder === 'All'){
                     this._getOrdersVerkaufen(years.currentYear)
                     this._getOrdersKaufen(years.currentYear)
                 }
                 else if( currentTypeOrder === 'Sold') this._getOrdersVerkaufen(years.currentYear)
                 else this._getOrdersKaufen(years.currentYear)
             })

     }
    render() {
        let { years, data, messages, currentTypeOrder } = this.state,
            noData = null
        if(currentTypeOrder === 'All' && data.dataVerkaufen.length === 0 && data.dataKaufen.baskets.length === 0
            && data.dataRepair.length === 0){
            noData = <p className="text-center">Es wurden bisher noch keine Käufe / Verkäufe getätigt</p>
        }
        else if(currentTypeOrder === 'Sold' && data.dataVerkaufen.length === 0) {
            noData = <p className="text-center">Es wurden bisher noch keine Verkäufe getätigt</p>
        }
        else if(currentTypeOrder === 'Bought' && data.dataKaufen.baskets.length === 0) {
            noData = <p className="text-center">Es wurden bisher noch keine Käufe getätigt</p>
        }
        else if(currentTypeOrder === 'Repair' && data.dataRepair.length === 0) {
            noData = <p className="text-center">Es wurden bisher noch keine Käufe getätigt</p>
        }
        return (
            <div className="overviewOrders">
                <div className="topRow">
                    <div className="col-md-9 text-left menuList">
                        <span className={currentTypeOrder === 'All' ? "typeOrder active" : "typeOrder"}
                              onClick={this.changeCurrentTypeOrder}
                              data-typeorder="All">Alle ({data.dataVerkaufen.length + data.dataKaufen.baskets.length + data.dataRepair.length})</span>
                        <span className={currentTypeOrder === 'Sold' ? "typeOrder active" : "typeOrder"}
                              onClick={this.changeCurrentTypeOrder}
                              data-typeorder="Sold">Verkaufen ({data.dataVerkaufen.length})</span>
                        <span className={currentTypeOrder === 'Bought' ? "typeOrder active" : "typeOrder"}
                              onClick={this.changeCurrentTypeOrder}
                              data-typeorder="Bought">Kaufen ({data.dataKaufen.baskets.length})</span>
                        <span className={currentTypeOrder === 'Repair' ? "typeOrder active" : "typeOrder"}
                              onClick={this.changeCurrentTypeOrder}
                              data-typeorder="Repair">Reparieren ({data.dataRepair.length})</span>
                    </div>
                    <div className="col-md-3 text-right year">
                        <span>Jahr</span>

                        <Select
                            placeholder="Auswählen..."
                            value={years.currentYear}
                            name="changeYear"
                            clearable={false}
                            options={years.allYears}
                            searchable={false}
                            onChange={this.changeYear}/>
                    </div>
                </div>
                <div>
                    { data.dataVerkaufen.length > 0 && (currentTypeOrder === 'All' || currentTypeOrder === 'Sold') &&
                    <OverviewOrdersVerkaufen  printShippingDocuments={this.printShippingDocumentsSell}
                                              msg={messages.verkaufen}
                                              acceptOffer={this.acceptOffer}
                                              dataVerkaufen={data.dataVerkaufen}/>
                    }
                    { data.dataKaufen.baskets.length > 0 && (currentTypeOrder === 'All' || currentTypeOrder === 'Bought') &&
                    <OverviewOrdersKaufen totalPrice={data.dataKaufen.totalPrice}
                                          printShippingDocuments={this.printShippingDocumentsBuy}
                                          msg={messages.kaufen}
                                          dataKaufen={data.dataKaufen.baskets}/>
                    }
                    { data.dataRepair.length > 0 && (currentTypeOrder === 'All' || currentTypeOrder === 'Repair') &&
                    <OverviewOrdersRepair msg={messages.repair}
                                          dataRepair={data.dataRepair}/>
                    }
                </div>
                <div className='col-md-12'>
                { noData }
                </div>
            </div>
        );
    }
}

OverviewOrders.propTypes = {}
OverviewOrders.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps)(OverviewOrders)