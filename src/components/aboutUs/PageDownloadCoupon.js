import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import  {connect} from 'react-redux'

export class PageDownloadCoupon extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errorMsg: ''
        }

        this.downloadPDF = this.downloadPDF.bind(this)
    }
    _gtag_report_conversion(url) {
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        }
        gtag('event', 'conversion', {
            'send_to': 'AW-827036726/3tyqCJ_ayXsQtqiuigM',
            'event_callback': callback
        })
        return false;
    }
    downloadPDF(){
        if(window.isGoogleConnection) {
            this._gtag_report_conversion()
        }
        let { shortcode } = this.props.params
        document.getElementById('spinner-box-load').style.display = 'block'
        let windowPdf = window.open(`//${window.location.host}/load-pdf`, '_blank')
        windowPdf.onload = function() {
            let loadPdf = windowPdf.document.createElement('div')
            loadPdf.className = "loadPdf"
            windowPdf.document.body.appendChild(loadPdf)
        }
        axios.get(`/api/generateCouponPdf?customerShortcode=${shortcode}`)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                windowPdf.location = '/' + result.data
            })
            .catch( error => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({errorMsg: error.response.data})
            })
    }
    render() {
        return (

            <div className="container">
                <p className="error">{ this.state.errorMsg }</p>
                <h1>Ihr persönlicher Gutschein</h1>
                <button className="btn downloadPDF" onClick={this.downloadPDF}>Jetzt 20.- {window.currencyValue} Gutschein downloaden</button><br /><br />
            </div>
        )
    }
}

PageDownloadCoupon.propTypes = {}
PageDownloadCoupon.defaultProps = {}

export default connect(null, null)(PageDownloadCoupon)
