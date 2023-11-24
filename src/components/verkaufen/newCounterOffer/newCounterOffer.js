import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import axios from 'axios'

import AnswersField from '../answersField/answersField'
import AsideVerkaufenPage from '../asideVerkaufenPage'
import ShowResultsCounterOffer from './modalShowResults'
import ShowResultsCounterOfferMobile from './modalShowResultsMobile'
import ErrorPaymentPage from '../../common/errorPaymentPage'

class NewCounterOffer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userAnswers: {},
            userData: {
                gender: '',
                name: ''
            },
            price: {
                newPrice: '',
                oldPrice: ''
            },
            image: '',
            comment: '',
            newOffer: [],
            oldOffer: [],
            modelData: {},
            couponTotal: 0,
            showButton: false,
            invalidShortcode: {
                show: false,
                text: ''
            }

        }

        this.viewNewOffer = this.viewNewOffer.bind(this)
        this.acceptOffer = this.acceptOffer.bind(this)
        this.acceptOffer = this.acceptOffer.bind(this)
        this.declineOffer = this.declineOffer.bind(this)
        this.modalCounterOfferDeclainedClose = this.modalCounterOfferDeclainedClose.bind(this)
        this.modalCounterOfferAcceptClose = this.modalCounterOfferAcceptClose.bind(this)
    }
    componentDidMount(){
        let { shortcode } = this.props.params
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/counterOffer?shortcode=${shortcode}`)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                if(result.data.status === 3 || result.data.status === 4){
                    let answer = result.data.status === 3 ? 'Vielen Dank, wir werden Ihnen den Betrag in Kürze Ihrem Bankkonto gutschreiben.'
                                                          : 'Vielen Dank, wir werden Ihnen in Kürze das Gerät auf dem Postweg kostenlos retournieren.'
                    this.setState({
                                    userAnswers: {...this.state.userAnswers, newOffer: [{name: answer}] },
                                    userData: { ...this.state.userData, gender: result.data.gender, name: result.data.firstName}
                    })
                    $('.newOfferResults').hide()
                    $('.part-left').show()
                }
                else{
                    $('#modalCounterOffer').modal('show')
                    $('.newOfferResults').show()
                    this.setState({
                        userAnswers: {...this.state.userAnswers, newOffer: [] },
                        userData: { ...this.state.userData, gender: result.data.gender, name: result.data.firstName},
                        price: {...this.state.price, newPrice: result.data.newPrice, oldPrice: result.data.oldPrice},
                        newOffer: result.data.newOffer,
                        oldOffer: result.data.oldOffer,
                        image: result.data.image,
                        comment: result.data.comment,
                        modelData: result.data.modelData,
                        couponTotal: result.data.couponTotal,
                        showButton: true
                    })
                }
            })
            .catch( error => {
                if( error.response.status === 404){
                    document.getElementById('spinner-box-load').style.display = 'none'
                    this.setState({ invalidShortcode: {...this.state.invalidShortcode,
                                                        show: true,
                                                        errorText: error.response.data}
                    })
                }
            })
    }

    viewNewOffer(){
        $('#modalCounterOffer').modal('show')
    }
    acceptOffer(){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/counterOfferAnswer?shortcode=${this.props.params.shortcode}&answer=1`)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                let answer = 'Vielen Dank, wir werden Ihnen Betrag in Kürze Ihrem Bankkonto gutschreiben.'
                this.setState({
                    userAnswers: {...this.state.userAnswers, newOffer: [{name: answer}] },
                    showButton: false
                })
                $('#modalCounterOffer').modal('hide')
                $('#modalCounterOfferDeclained').modal('hide')
                $('#modalCounterOfferAccepter').modal('show')
            })

    }
    declineOffer(){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/counterOfferAnswer?shortcode=${this.props.params.shortcode}&answer=0`)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                let answer = 'Vielen Dank, wir werden Ihnen in Kürze das Gerät auf dem Postweg kostenlos retournieren.'
                this.setState({
                    userAnswers: {...this.state.userAnswers, newOffer: [{name: answer}] },
                    showButton: false
                })
                $('#modalCounterOffer').modal('hide')
                $('#modalCounterOfferDeclained').modal('show')
            })

    }
    modalCounterOfferAcceptClose(){
        $('#modalCounterOfferAccepter').modal('hide')
        if(window.isMobile){
            $('.newOfferResults').hide()
            $('.part-left').show()
        }
    }
    modalCounterOfferDeclainedClose(){
        $('#modalCounterOfferDeclained').modal('hide')
        if(window.isMobile){
            $('.newOfferResults').hide()
            $('.part-left').show()
        }
    }
    render() {
        let { userData, showButton, newOffer, oldOffer, price, image, comment, modelData, couponTotal, invalidShortcode } = this.state
        let newSortOffer=[];
        let newUnsortOffer=[];
        oldOffer.map(
            (item) => {
                newOffer.find(item2 => {
                    if(item.name==item2.name) {
                        newSortOffer = [...newSortOffer, item2];
                    }
                })
            }
        )
        newOffer.map((item) => {
            if(!newSortOffer.some(item2 => item2.name == item.name)){
                newUnsortOffer = [...newUnsortOffer, item];
            }
            })
        newSortOffer = [...newSortOffer, ...newUnsortOffer];
        return (
            <div className="sellPage newCounterOffer">
                { !invalidShortcode.show &&   <div className="sellPage-wrap">
                                            <div className="part-left">
                                                <AnswersField showQuestion={{}}
                                                              showLastQuestion={true}
                                                              showButton={showButton}
                                                              userData={userData}
                                                              viewNewOffer={this.viewNewOffer}
                                                              userAnswers={this.state.userAnswers}
                                                              criteriasList={[]}
                                                              conditionQuestion={{}}/>
                                            </div>
                                            <AsideVerkaufenPage userAnswers={{}} />
                                        </div>
                }
                {invalidShortcode.show && <ErrorPaymentPage errorText={invalidShortcode.errorText}/> }
                {!window.isMobile ?
                                                            <ShowResultsCounterOffer oldPrice={price.oldPrice}
                                                                                     newPrice={price.newPrice}
                                                                                     image={image}
                                                                                     comment={comment}
                                                                                     acceptOffer={this.acceptOffer}
                                                                                     declineOffer={this.declineOffer}
                                                                                     newOffer={newSortOffer}
                                                                                     couponTotal={couponTotal}
                                                                                     oldOffer={oldOffer}/>
                                                            :
                                                            <ShowResultsCounterOfferMobile oldPrice={price.oldPrice}
                                                                                           newPrice={price.newPrice}
                                                                                           image={image}
                                                                                           comment={comment}
                                                                                           acceptOffer={this.acceptOffer}
                                                                                           declineOffer={this.declineOffer}
                                                                                           newOffer={newSortOffer}
                                                                                           couponTotal= {couponTotal}
                                                                                           oldOffer={oldOffer}/>
                }

                <div className="modal fade" tabIndex="-1" id="modalCounterOfferDeclained" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="btnCloseModal"
                             data-dismiss="modal"
                             data-backdrop="static"
                             onClick={ this.modalCounterOfferDeclainedClose }>
                            <i className="fa fa-times" aria-hidden="true"/>
                        </div>
                        <div className="modal-content">
                            <div className="row">
                                <div className="paymentPage">
                                    <div className="row">
                                        <div className="col-sm-12" >
                                            <div className="wrapWindow text-center">
                                                <div className="circle false"/>
                                                <p className="bigText">Neues Angebot nicht akzeptiert!</p>
                                                <p className="smallText">Vielen Dank, wir werden Ihnen in Kürze das Gerät auf dem Postweg kostenlos retournieren. Das ist die letzte Gelegenheit Ihrer Entscheidung zu ändern.</p>
                                                <div className="wrapBasketItems">
                                                    <div className="itemModel">
                                                        <div className="model">
                                                            <p>{modelData.name}</p>
                                                            <p>{modelData.color}, {modelData.capacity}</p>
                                                        </div>
                                                        <div className="price">
                                                            <p>{price.newPrice}{window.currencyValue}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="buttons">
                                                    <span onClick={this.acceptOffer }>Ja, Offerte akzeptieren</span>
                                                    <span onClick={ this.modalCounterOfferDeclainedClose } className="accept">Nein, senden Sie mir das Gerät zurück</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" tabIndex="-1" id="modalCounterOfferAccepter" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="btnCloseModal"
                             data-dismiss="modal"
                             data-backdrop="static"
                             onClick={ this.modalCounterOfferAcceptClose}>
                            <i className="fa fa-times" aria-hidden="true"/>
                        </div>
                        <div className="modal-content">
                            <div className="row">
                                <div className="paymentPage">
                                    <div className="row">
                                        <div className="col-sm-12" >
                                            <div className="wrapWindow text-center">
                                                <div className="circle ok"/>
                                                <p className="bigText">Neues Angebot akzeptiert!</p>
                                                <p className="smallText">Vielen Dank für die Bestätigung. Wir werden Ihnen in Kürze den Betrag auf Ihr Bankkonto gutschreiben. Sie können den Status jederzeit über Ihr Kundenkonto verfolgen!</p>
                                                <div className="wrapBasketItems">
                                                    <div className="itemModel">
                                                        <div className="model">
                                                            <p>{modelData.name}</p>
                                                            <p>{modelData.color}, {modelData.capacity}</p>
                                                        </div>
                                                        <div className="price">
                                                            <p>{price.newPrice}{window.currencyValue}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="buttons">
                                                    <Link to={'/kundenkonto'}
                                                          onClick={() => $('#modalCounterOfferAccepter').modal('hide')}
                                                          className="btn">
                                                        Im Detail ansehen
                                                        <span><i className="fa fa-long-arrow-right" aria-hidden="true"></i></span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

NewCounterOffer.propTypes = {}
NewCounterOffer.defaultProps = {}

export default NewCounterOffer