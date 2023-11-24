import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { cookieApi } from '../../api/apiCookie'
import ListSimilarItems from '../detailModelPage/listSimilarItems'


class ErrorPaymentPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            basketDataForSimilarItems: [],
            similarItems: [],
            errorPay: ''
        }

        this.clickTryAgain = this.clickTryAgain.bind(this)
    }

    componentDidMount(){
        let basketShortcode = window.localStorage.getItem('basketShortcode');
        if(basketShortcode){
            axios.get(`/api/basket/failed?basketShortcode=${basketShortcode}`)
                .then( result => {
                    window.localStorage.removeItem('basketShortcode')
                })
                .catch( error => {
                });
        }
        let basketDataForSimilarItems = JSON.parse(window.localStorage.getItem('basketData'))

        this.setState({ basketDataForSimilarItems })

        axios.post(`/api/similarItems`, {basketData: basketDataForSimilarItems })
            .then( data => {
                this.setState({similarItems: data.data})
            })
            .catch( () => false )

        // if error on pay method
        let errorMessage = cookieApi.getCookie('errorMessage')
        cookieApi.deleteCookie('errorMessage')
        if (errorMessage) {
            this.setState({errorPay: errorMessage.replace( /[+]/g, ' ')})
        }
    }
    clickTryAgain(){
        window.localStorage.setItem('paymentFailedTryAgain', true)
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
                            <Link to={'/warenkorb'}
                                  onClick={this.clickTryAgain}
                                  className="btn false">
                                erneut versuchen
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </Link>
                        </div>
                    </div>
                </div>
                {!window.isMobile &&
                                                                <div className="similar">
                                                                    <div className="container">
                                                                        <ListSimilarItems similarItems={this.state.similarItems}/>
                                                                        <div className="cb"/>
                                                                    </div>
                                                                </div>
                }
            </div>
        );
    }
}

ErrorPaymentPage.propTypes = {}
ErrorPaymentPage.defaultProps = {
    errorText: 'Fehlerhafte Zahlung'
}

export default ErrorPaymentPage