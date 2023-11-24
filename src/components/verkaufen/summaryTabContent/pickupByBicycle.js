import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _debounce from "lodash/debounce";

class PickupByBicycle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            infoPostCode: null,
            errors: {
                zip: '',
                date: ''
            }
        }

        this._initCalendar = this._initCalendar.bind(this)
        this.handleChangeZip = this.handleChangeZip.bind(this)
        this.handlerClickBook = this.handlerClickBook.bind(this)
    }

    componentDidMount(){
        this._initCalendar()
    }
    componentWillMount(){
        this.inputZipCallback = _debounce(function (e) {
            let zip = e.target.value
            axios.get(`/api/checkShippingZip?zip=${zip}`)
                .then( result => {
                    this.setState({ infoPostCode: result.data })
                })
                .catch(error => {
                    let zip = error.response.data.errors.zip[0]
                    this.setState({ errors: {...this.state.errors, zip} })
                })
        }, 1000);
    }
    handleChangeZip(e){
        this.setState({errors: {...this.state.errors, zip: null}, infoPostCode: null })
        e.persist()
        if(e.target.value) this.inputZipCallback(e)
        else this.inputZipCallback.cancel()
    }
    handlerClickBook(){
        if(!$('#datetimepicker').val()) this.setState({ errors: {...this.state.errors, date: 'Please select date and time'} })
    }
    _initCalendar(){
        let disabledWeekDays = [0,6],
            minTimeParam = '9.00',
            initialMinTimeParam = setMinTimeForToday(),
            maxTimeParam = '18.31',
            _this = this

        $.datetimepicker.setLocale('de');
        $('#datetimepicker').datetimepicker({
            formatDate:'d.m.Y',
            formatTime: 'H:i',
            inline:true,
            step: 5,
            disabledWeekDays,
            minTime: initialMinTimeParam,
            maxTime: maxTimeParam,
            minDate: new Date(),
            defaultSelect: false,
            onChangeMonth: function(current_time,$input){

            },
            onSelectDate:function(ct,$i){
                let today = new Date,
                    minTime = null,
                    currentYear = today.getFullYear(),
                    currentMonth = today.getMonth(),
                    currentDay = today.getDate(),
                    selectedYear = ct.getFullYear(),
                    selectedMonth = ct.getMonth(),
                    selectedDay = ct.getDate(),
                    selectedDayEqualTodayDay = currentYear === selectedYear && currentMonth === selectedMonth && currentDay === selectedDay

                if(selectedDayEqualTodayDay){
                    minTime = setMinTimeForToday()
                    $('#datetimepicker').datetimepicker('setOptions', { minTime });
                }
                else $('#datetimepicker').datetimepicker('setOptions', { minTime: minTimeParam });
                _this.setState({ errors: {..._this.state.errors, date: ''} })
            }
        })
        function setMinTimeForToday(){
            let today = new Date,
                startTimeHour = today.getHours() + 3,
                startTimeMinutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
            return startTimeHour + '.' + startTimeMinutes
        }
    }

    render() {
        return (
            <div className="pickup-by-bicycle">
                <div>
                    <h3 className="title"><img src="/images/design/packing.svg" alt=""/>Velokurier aufbieten</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                    <div className="row-input">
                        <div className="input">
                            <span>Ihre Postleitzahl:</span>
                            <input type="text" placeholder="z.B. 4142" onChange={this.handleChangeZip}/>
                        </div>
                        {this.state.infoPostCode &&
                        <div className="result">
                            <i className="fa fa-times-circle-o"/>
                            <p >Eine Abholung per Velokurier ist möglich</p>
                        </div>
                        }
                        {this.state.errors.zip &&
                        <div className="result">
                            <i className="fa fa-check-circle-o"/>
                            <p>Eine Abholung per Velokurier ist leider nicht möglich. Bitte wählen Sie eine andere Abholmethode aus.</p>
                        </div>
                        }

                    </div>
                    {this.state.errors.date && <p className="info error" style={{color: '#ff0000'}}>{this.state.errors.date}</p>}
                    <div id="datetimepicker"/>
                </div>
                {this.state.infoPostCode &&
                    <button className="btn" onClick={this.handlerClickBook}>
                        Book apointment
                        <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                    </button>
                }
            </div>
        )
    }
}
PickupByBicycle.propTypes = {}
PickupByBicycle.defaultProps = {}
export default PickupByBicycle