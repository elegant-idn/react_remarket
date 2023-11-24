import React, { Component } from 'react'
import Basket from '../../basket/basket'
import HeaderMobile from '../header/headerMobile'


class BasketKaufenMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            titleForHead: 'Warenkorb',
            basketStep: 'paymentMethod'
        }

        this.handleBackBtn = this.handleBackBtn.bind(this)
        this._defineTitleHead = this._defineTitleHead.bind(this)
        this.goToCheckout = this.goToCheckout.bind(this)
        this.goToDelivery = this.goToDelivery.bind(this)
        this.goToPayment = this.goToPayment.bind(this)
        this.goToMethod = this.goToMethod.bind(this)
    }

    componentDidMount(){
        if($('#intercom-container').length > 0){
            $('#intercom-container .intercom-launcher-frame').removeAttr('style')
            $('#intercom-container').before('<div class="fixedBtnBasketKaufen"></div>')
        }
        if($('#tidio-chat').length > 0){
            $('#tidio-chat').before('<div class="fixedBtnBasketKaufen"></div>')
        }
        else $('body').append('<div class="fixedBtnBasketKaufen"></div>')

        if(window.localStorage.getItem('paymentFailedTryAgain')){
            window.localStorage.removeItem('paymentFailedTryAgain')
            $('.productWrap, .personalData, .shippingMethod, .basketSubmit').hide()
            $('#accordion, .paymentMethod, .paymentMethod .wrapperItemBasket, .shippingMethod .wrapperItemBasket, .basketSubmit').show()
            this.setState({ basketStep: 'paymentMethod'})
            this._defineTitleHead('<span class="count">3/3</span> checkout')
        }
    }
    componentWillUnmount(){
        $('#intercom-container .intercom-launcher-frame').attr('style', 'bottom:20px !important')
        $('#tidio-chat #tidio-chat-iframe').css({
            bottom: "-10px",
            right: "10px"
        })
        $('body .fixedBtnBasketKaufen').remove()
    }
    _defineTitleHead(name){
        this.setState({ titleForHead: name })
    }    
    handleBackBtn(){
        if(this.state.basketStep === 'paymentMethod'){
            $('.productWrap').show()
            $('#accordion').hide()
            this.setState({ basketStep: 'paymentMethod' })
        }
        else if(this.state.basketStep === 'personalData'){
            $('.paymentMethod').show()
            $('.shippingMethod, .personalData, .basketSubmit').hide()
            this.setState({ basketStep: 'paymentMethod' })
        }
        else if(this.state.basketStep === 'shippingMethod'){
            $('.personalData').show()
            $('.shippingMethod, .paymentMethod, .basketSubmit').hide()
            this.setState({ basketStep: 'personalData' })
        }
    }
    goToCheckout(){
            $('.productWrap, .shippingMethod, .personalData, .basketSubmit').hide()
            $('#accordion').show()
        this.setState({ basketStep: 'paymentMethod' })

        $("html, body").animate({ scrollTop: 0 }, "fast");
    }
    goToMethod() {
        $('.paymentMethod').show()
        $('.shippingMethod, .personalData, .basketSubmit').hide()        
        this.setState({ basketStep: 'paymentMethod' })
        $("html, body").animate({ scrollTop: 0 }, "fast");
    }
    goToDelivery(){
        if([...document.querySelectorAll('.paymentMethod input[type="radio"][required]')].some( item => item.checked)){
            $('.personalData, .personalData .wrapperItemBasket').show()
            $('.shippingMethod, .paymentMethod, .basketSubmit').hide()
            this.setState({ basketStep: 'personalData' })
            $("html, body").animate({ scrollTop: 0 }, "fast");
        }
        /*
        if(document.querySelector('input[name="shippingAddress"]').checked){
            if( [...document.querySelectorAll('.personalData input:not([type="radio"])[required]')].every( item => item.value.trim() !== '')
                && [...document.querySelectorAll('.personalData .billingForm input[type="radio"][required]')].some( item => item.checked)
            ){
                $('.personalData').hide()
                $('.shippingMethod, .shippingMethod .wrapperItemBasket').show()
                this.setState({ basketStep: 'shippingMethod'})
                this._defineTitleHead('<span class="count">2/3</span> checkout')

                $("html, body").animate({ scrollTop: 0 }, "fast");
            }
            else $(".basketSubmit").click()
        }
        else{
            if( [...document.querySelectorAll('.personalData input:not([type="radio"])[required]')].every( item => item.value.trim() !== '')
                && [...document.querySelectorAll('.personalData .shippingForm input[type="radio"][required]')].some( item => item.checked)
                && [...document.querySelectorAll('.personalData .billingForm input[type="radio"][required]')].some( item => item.checked)
            ){
                $('.personalData').hide()
                $('.shippingMethod, .shippingMethod .wrapperItemBasket').show()
                this.setState({ basketStep: 'shippingMethod'})
                this._defineTitleHead('<span class="count">2/3</span> checkout')

                $("html, body").animate({ scrollTop: 0 }, "fast");
            }
            else $(".basketSubmit").click()
        }
        */
    }
    goToPayment(fromError){
        if(fromError === true){
            $('.shippingMethod, .personalData').hide()
            $('.paymentMethod, .paymentMethod .wrapperItemBasket').show()
            this.setState({ basketStep: 'paymentMethod'})
            $("html, body").animate({ scrollTop: 0 }, "fast");
        } else {
            if(document.querySelector('input[name="shippingAddress"]').checked){
                if( [...document.querySelectorAll('.personalData input:not([type="radio"])[required]')].every( item => item.value.trim() !== '')
                    && [...document.querySelectorAll('.personalData .billingForm input[type="radio"][required]')].some( item => item.checked)
                ){
                    $('.paymentMethod, .personalData').hide()
                    $('.shippingMethod, .shippingMethod .wrapperItemBasket').show()
                    this.setState({ basketStep: 'shippingMethod'})
                    $("html, body").animate({ scrollTop: 0 }, "fast");
                }
            }
            else{
                if( [...document.querySelectorAll('.personalData input:not([type="radio"])[required]')].every( item => item.value.trim() !== '')
                    && [...document.querySelectorAll('.personalData .shippingForm input[type="radio"][required]')].some( item => item.checked)
                    && [...document.querySelectorAll('.personalData .billingForm input[type="radio"][required]')].some( item => item.checked)
                ){
                    $('.paymentMethod, .personalData').hide()
                    $('.shippingMethod, .shippingMethod .wrapperItemBasket').show()
                    this.setState({ basketStep: 'shippingMethod'})
                    $("html, body").animate({ scrollTop: 0 }, "fast");
                }
            }            
            /*
            if([...document.querySelectorAll('.shippingMethod input[type="radio"][required]')].some( item => item.checked)){
                $('.shippingMethod').hide()
                $('.paymentMethod, .paymentMethod .wrapperItemBasket, .basketSubmit').show()
                this.setState({ basketStep: 'paymentMethod'})
                this._defineTitleHead('<span class="count">3/3</span> checkout')

                $("html, body").animate({ scrollTop: 0 }, "fast");
            }
            else $(".basketSubmit").click()
            */
        }
    }

    render() {
        let { titleForHead } = this.state
        return (
            <div className="basketKaufen">
                <HeaderMobile menu={true} title='<img alt="Logo" src="/images/design/logo_all_pages.svg"/>'/>
                <Basket goToCheckout={this.goToCheckout}
                        goToDelivery={this.goToDelivery}
                        goToPayment={this.goToPayment}
                        goToMethod={this.goToMethod}
                        handlerBack={this.handleBackBtn}
                        basketStep={this.state.basketStep}
                        location={this.props.location}/>
            </div>
        )
    }
}

BasketKaufenMobile.propTypes = {}
BasketKaufenMobile.defaultProps = {}

export default BasketKaufenMobile
