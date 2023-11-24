import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CouponFromAds extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.setEqualHeight = this.setEqualHeight.bind(this)
    }

    componentDidMount(){
        this.setEqualHeight()
        document.addEventListener("keyup", this.handleKeyPress, {passive: true})
    }
    componentWillUnmount(){
        document.removeEventListener("keyup", this.handleKeyPress)
    }
    setEqualHeight(){
        setTimeout(() => {
            $('.horizontal.first').height() > $('.horizontal.last').height()
                ? $('.horizontal.last').height($('.horizontal.first').height())
                : $('.horizontal.first').height($('.horizontal.last').height())
        }, 10)
    }
    handleKeyPress(e){
        if(e.key === "Escape"){
            this.props.toggleLightbox()
        }
    }

    render() {
        return (
            <div className="coupon-light-box light-box">
                <div className="light-box-container">
                    <div className="content">
                          <div className="top text-right">
                              <img src="/images/design/simple-close-logForm.svg"
                                   onClick={this.props.toggleLightbox}
                                   alt=""/>
                          </div>
                          <div className="body">
                              <p style={{width: '100%', textAlign: '-webkit-center'}}>
                                <div className="Oval-2">
                                  <img src="/images/design/cut.svg" className="cut" />
                                </div>
                              </p>
                              <p className="title">The coupon is added</p>
                              <p className="description">Dein persönlicher Rabattcode <span style={{color:'black', fontWeight: 'bold'}} id="coupon_text"></span> wurde hinzugefügt und wir beim Checkout verrechnet.</p>
                              <p style={{width: '100%', textAlign: '-webkit-center'}}>
                                <button class="btn" onClick={this.props.toggleLightbox} style={{width: '60%'}}>ok</button>
                              </p>
                          </div>
                    </div>
                </div>
            </div>
        )
    }
}
CouponFromAds.propTypes = {}
CouponFromAds.defaultProps = {}

export default CouponFromAds
