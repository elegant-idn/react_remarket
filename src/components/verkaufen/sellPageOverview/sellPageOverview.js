import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import axios from 'axios'

import ProductsList from './productsList'
import TemplateSamsung from './templateSamsung'
import TemplateImacMacbook from './templateImacMacbook'
import TemplateIphoneIpadIpod from './templateIphoneIpadIpod'

import  {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as basketActions from '../../../actions/basket'

export class SellPageOverview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            basketDataVerkaufen: []
        }

        this.mapTemplates = this.mapTemplates.bind(this)
    }
    componentWillMount(){
        let basketDataVerkaufen = JSON.parse(window.localStorage.getItem('basketDataVerkaufenForSellPage'))
        if(!basketDataVerkaufen) browserHistory.push('/')
    }
    componentDidMount(){
        let email = window.localStorage.getItem('email'),
            order = window.localStorage.getItem('order'),
            template = JSON.parse(window.localStorage.getItem('template')),
            PDFData = JSON.parse(window.localStorage.getItem('PDFData')),
            basketDataVerkaufen = JSON.parse(window.localStorage.getItem('basketDataVerkaufenForSellPage')),
            data = { email, order, PDFData }
        axios.post('/api/generatePDF', data)
            .then( result => {
                let btn = document.querySelector('.btnPDF')
                btn.innerText = 'Versanddokumente öffnen'
                btn.disabled = false
                btn.classList.remove('btnPDFGenerating')
                btn.onclick = () => window.open( `//${window.location.host}/${result.data}`, '_blank' )
            })

        window.localStorage.removeItem('email')
        window.localStorage.removeItem('order')
        window.localStorage.removeItem('template')
        window.localStorage.removeItem('PDFData')
        window.localStorage.removeItem('basketDataVerkaufenForSellPage')
        this.setState({ email, order, template, PDFData, basketDataVerkaufen })

    }
    mapTemplates( item, i ){
        switch ( item ){
            case 'imac_macbook_mac_mini_template':
                return <TemplateImacMacbook key={i}/>
                break
            case 'iphone_ipad_ipod_template':
                return <TemplateIphoneIpadIpod key={i}/>
                break
            case 'samsung_galaxy_template':
                return <TemplateSamsung key={i}/>
                break
            default:
                return null
        }
    }

    render() {
        let { email, order, template, basketDataVerkaufen } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3>Auftragsbestätigung</h3>
                        <p>Wir haben Ihnen eine Auftragsbestätigung per E-Mail an <strong>{ email }</strong> gesendet. Ihre Auftragsnummer lautet <strong>{ order }</strong>.</p>
                    </div>
                </div>
                <div className="row">
                    <ProductsList basketData={basketDataVerkaufen}/>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Auf Werkseinstellungen zurücksetzen</h3>
                        { template && template.map( this.mapTemplates ) }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Versanddokumente</h3>
                        <button className="btnPDF btnPDFGenerating" disabled>Versanddokumente werden erstellt</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Checkliste</h3>
                        <ul>
                          <li>1. Setzen Sie das Gerät zurück auf die Werkseinstellungen</li>
                          <li>2. Gerät inkl. Zubehör (falls vorhanden) ins Paket legen</li>
                          <li>3. Legen Sie den Lieferschein (Seite 1) mit dem Gerät ins Paket</li>
                          <li>4. Kleben Sie den vorfrankierten Versandschein auf das Paket um das Paket <strong>kostenlos</strong> bei der Post abzugeben.</li>
                        </ul><br /><br />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>Informationen zur Auszahlung</h3>
                        <div className="information-small"><p>Sobald wir das Paket erhalten haben, werden wir nach detaillierter Prüfung des Gerätes die Zahlung auf Ihr Bankkonto auslösen.</p></div>

                    </div>
                </div>
            </div>
        );
    }
}

SellPageOverview.propTypes = {}
SellPageOverview.defaultProps = {}

function mapStateToProps (state) {
    return {
        basket: state.basket
    }
}
function mapDispatchToProps(dispatch) {
    return {
        basketActions: bindActionCreators(basketActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(SellPageOverview)