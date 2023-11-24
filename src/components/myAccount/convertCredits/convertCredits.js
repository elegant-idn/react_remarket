import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

import PayoutOperations from './payoutOperationsTable'

import  {connect} from 'react-redux'

export class ConvertCredits extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {
                totalCredits: null,
                payoutOperations: []
            },
            error: null
        }
        this.send = this.send.bind(this)
        this.deleteError = this.deleteError.bind(this)
        this.clickMaxTotalCredits = this.clickMaxTotalCredits.bind(this)
        this._setFormFields = this._setFormFields.bind(this)
    }
    componentDidUpdate(){
        $('.tableRow .show').prop('onclick',null).off('click')
        $('.tableRow .show').on('click', function(){
            $(this).parent().parent().find('.userData').toggle('slow')
            if($(this).find('i').hasClass('fa-plus')){
                $(this).find('i').removeClass('fa-plus').addClass('fa-minus')
            }
            else $(this).find('i').removeClass('fa-minus').addClass('fa-plus')
        })
    }
    componentWillReceiveProps( nextProps ){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false){
            browserHistory.push('/')
        }
        if( nextProps.user.data !== this.props.user.data && nextProps.user.data){
            this._setPersonalDataFields(nextProps.user.data)
        }

    }
    componentDidMount(){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/creditsPayoutList`)
            .then( ( result ) => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this.setState({ data: {
                                        ...this.state.data,
                                        totalCredits: result.data.credits,
                                        payoutOperations: result.data.payouts
                                      }
                })
            })
        axios.get(`/api/accountData`)
            .then( ( result ) => {
                this._setFormFields(result.data)
            })

    }

    _setFormFields(data){
        let form = document.forms.payoutCredit
        form.name.value = `${data.first_name} ${data.last_name}`
        form.iban.value = `${data.IBAN}`
    }
    deleteError(){
        this.setState({ error: null })
    }
    clickMaxTotalCredits(e){
        let value = e.target.innerText.slice(5)
        document.querySelector('#count').value = +value
    }
    send(e){
        e.preventDefault()
        document.getElementById('spinner-box-load').style.display = 'block'
        let data = new FormData(document.forms.payoutCredit)
        axios.post('/api/storeCreditsPayout', data)
            .then( result => {
                document.forms.payoutCredit.count.value = ''
                axios.get(`/api/creditsPayoutList`)
                    .then( ( result ) => {
                        document.getElementById('spinner-box-load').style.display = 'none'
                        this.setState({ data: {
                                                ...this.state.data,
                                                totalCredits: result.data.credits,
                                                payoutOperations: result.data.payouts
                                              }
                        })
                    })
            })
            .catch( errors => {
                document.getElementById('spinner-box-load').style.display = 'none'
                let error = errors.response.data
                this.setState({ error })
            })
    }
    render() {
        let { data } = this.state
        return (
            <div className="payoutCredits row clearfix">
                <div className="col-md-8 tableCredits">
                    <div className="payCredits-forMobile">
                        <p className="totalCredits">{ data.totalCredits } credits</p>
                        <button className="btn" onClick={this.props.clickPayoutBtn}>Auszahlung</button>
                    </div>
                    <span className="descr">1 credit = 1 {window.currencyValue}</span>
                    <p className="title">Auszahlung</p>
                    {data.payoutOperations.length > 0 && <PayoutOperations data={data.payoutOperations}/>}
                    {data.payoutOperations.length === 0 && <p>Es wurden bisher noch keine Auszahlungen getätigt.</p>}
                </div>
                <div className="col-md-4 formCredits">
                    <p className="totalCredits">
                        { data.totalCredits } credits
                    </p>
                    <span className="descr">1 credit = 1 {window.currencyValue}</span>
                    <div className="form">
                        <form onSubmit={this.send} name="payoutCredit">
                            <div className="count">
                                <input id="count"
                                       onChange={this.state.error && this.deleteError}
                                       type="text"
                                       name="count"
                                       placeholder="Betrag" pattern="[0-9]+([\.,][0-9]+)?" required />
                                {this.state.error && <p className="error">{this.state.error}</p>}
                                { data.totalCredits > 0 && <p><span onClick={this.clickMaxTotalCredits}>max. { data.totalCredits }</span></p>}
                            </div>
                            <input id="iban" type="text" name="iban" placeholder="IBAN" pattern=".{15,}" required />
                            <input id="accountName" type="text" name="name" placeholder="Vorname Nachname" required/>
                            <button type="submit" className="btn">
                                Jetzt auszahlen
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

ConvertCredits.propTypes = {}
ConvertCredits.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps)(ConvertCredits)