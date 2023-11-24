import React, { Component } from 'react'
import PropTypes from 'prop-types'

class WarrantyLightbox extends Component {
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
            <div className="warranty-light-box light-box">
                <div className="light-box-container">
                    <div className="content">
                        <div className="col-xs-12">
                            <div className="top text-right">
                                <img src="/images/design/simple-close-logForm.svg"
                                     onClick={this.props.toggleLightbox}
                                     alt=""/>
                            </div>
                            <div className="body">
                                <p className="title">Garantie Information</p>
                                <p className="description">Bei jedem erworbenen Gerät erhalten Sie bei uns ein Rundum-sorglos-Paket. Auf jedes gebrauchte Geräte erhalten Sie <strong>1 Jahr Garantie</strong>, auf Neugeräte <strong>2 Jahre Garantie</strong>.</p>
                                <p className="description"></p>
                                <div className="wrap-steps">
                                    <div className="horizontal first">
                                        <div className="item-step">
                                            <div className="wrap">
                                                <div className="image"><img src="/images/design/warranty-lightbox/step-1.svg" alt=""/></div>
                                                <p>Gerät hat ein Problem</p>
                                            </div>
                                        </div>
                                        <div className="image arrow">
                                            <img src="/images/design/warranty-lightbox/arrow.svg" alt=""/>
                                        </div>
                                        <div className="item-step">
                                            <div className="wrap">
                                                <div className="image"><img src="/images/design/warranty-lightbox/step-2.svg" alt=""/></div>
                                                <p>Erstelle ein Retourenlabel im Kundenkonto</p>
                                            </div>
                                        </div>
                                        <div className="image arrow">
                                            <img src="/images/design/warranty-lightbox/arrow.svg" alt=""/>
                                        </div>
                                        <div className="item-step">
                                            <div className="wrap">
                                                <div className="image"><img src="/images/design/warranty-lightbox/step-3.svg" alt=""/></div>
                                                <p>Sende es kostenlos ein oder besuche unseren Shop</p>
                                            </div>
                                        </div>
                                        <div className="image arrow">
                                            <img src="/images/design/warranty-lightbox/arrow.svg" alt=""/>
                                        </div>
                                    </div>
                                    <div className="vertical">
                                        <div className="item-step">
                                            <div className="wrap">
                                                <div className="image"><img src="/images/design/warranty-lightbox/step-4-a.svg" alt=""/></div>
                                                <p>Wenn eine Reparatur möglich ist wird diese kostenlos durchgeführt</p>
                                            </div>
                                        </div>
                                        <div className="item-step">
                                            <div className="wrap">
                                                <div className="image"><img src="/images/design/warranty-lightbox/step-4-b.svg" alt=""/></div>
                                                <p>Wenn diese nicht möglich ist, wird das Gerät ausgetauscht</p>
                                            </div>
                                        </div>
                                        <div className="item-step">
                                            <div className="wrap">
                                                <div className="image"><img src="/images/design/warranty-lightbox/step-4-c.svg" alt=""/></div>
                                                <p>Falls der Austausch nicht möglich ist, erhalten Sie eine Gutschrift</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="horizontal last">
                                        <div className="image arrow" style={{marginLeft: '10px'}}>
                                            <img src="/images/design/warranty-lightbox/arrow.svg" alt=""/>
                                        </div>
                                        <div className="item-step">
                                            <div className="wrap">
                                                <div className="image"><img src="/images/design/warranty-lightbox/step-5.svg" alt=""/></div>
                                                <p>Happy End!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
WarrantyLightbox.propTypes = {}
WarrantyLightbox.defaultProps = {}

export default WarrantyLightbox