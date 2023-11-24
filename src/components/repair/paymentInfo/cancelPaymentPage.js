import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { cookieApi } from '../../../api/apiCookie'

class CancelPaymentPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errorPay: ''
        }

    }

    componentDidMount(){
        window.localStorage.removeItem('basketDataRepair')

        // if error on pay method
        let errorMessage = cookieApi.getCookie('errorMessage')
        cookieApi.deleteCookie('errorMessage')
        if (errorMessage) {
            this.setState({errorPay: errorMessage.replace( /[+]/g, ' ')})
        }
    }

    render() {
        return (
            <div className="paymentPage">
                <div className="container">
                    <div className="col-sm-8 col-sm-push-2" >
                        <div className="wrapWindow text-center">
                            <div className="circle false"/>
                            <p className="bigText">{this.props.errorText}</p>
                            <p className="smallText">{this.state.errorPay}</p>
                            <Link to={'/reparieren'}
                                  className="btn false">
                                erneut versuchen
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CancelPaymentPage.propTypes = {}
CancelPaymentPage.defaultProps = {
    errorText: 'Fehlerhafte Zahlung'
}

export default CancelPaymentPage