import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Recaptcha from 'react-recaptcha'
import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'
import Select from 'react-select'

import  {connect} from 'react-redux'

class BookAnAppointment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showInfo: false,
            captcha: {
                isCheckCaptcha: false,
                errorCaptcha: false
            },
            isSelectTime: false,
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                colorValue: '',
            },
            openHours: null,
            formWasSubmited: false,
            errors: {
                datetime: '',
            },
        }

        this.verifyCaptchaCallback = this.verifyCaptchaCallback.bind(this)
        this.sendForm = this.sendForm.bind(this)
        this.showCaptcha = this.showCaptcha.bind(this)
        this._setDataFields = this._setDataFields.bind(this)
        this.changePhoneNumber = this.changePhoneNumber.bind(this)
        this._initCalendar = this._initCalendar.bind(this)
        this.changeColor = this.changeColor.bind(this)
        this.handlerChangeInput = this.handlerChangeInput.bind(this)
        this._initMap = this._initMap.bind(this)
    }
    componentDidUpdate(){
        setHeight()
        calendarTimePosition()
    }
    componentWillReceiveProps(nextProps){
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === true){
            this._setDataFields(nextProps.user.data)
        }
        if( nextProps.user.isLogin !== this.props.user.isLogin && nextProps.user.isLogin === false) {
            this.setState({ formData: { firstName: '', lastName: '', email: '', phone: '', colorValue: '',}
            })
        }
        if(nextProps.totalTime !== this.props.totalTime) {
            $('#input').datetimepicker('destroy');
            this._initCalendar(nextProps.totalTime)
        }
    }

    componentDidMount(){
        this._initCalendar(this.props.totalTime)
        setHeight()
        if(this.props.user.isLogin){
            this._setDataFields(this.props.user.data)
        }
        if(window.isGoogleConnection) {
            this._initMap()
        }
    }
    changePhoneNumber(e){
        this.setState({ formData: {...this.state.formData, phone: e } })
    }
    handlerChangeInput(e){
        let { name, value } = e.target
        this.setState({ errors: {...this.state.errors, [name]: null },
            formData: {...this.state.formData, [name]: value}
        })
    }
    _initCalendar(totalTime){
        let disabledWeekDays = [],
            totalTimeForRepair = totalTime,
            initialMinTime = setMinTimeForToday(),
            minTime = null,
            maxTime = null,
            _this = this
        axios.get('/api/getShopOpenHours')
            .then( result => {
                let todayWeekDay = new Date().getDay()

                getOpenHours(result.data, todayWeekDay)
                createCalendar(initialMinTime, maxTime, disabledWeekDays)
                this.setState({ openHours: result.data })
            })
        function setMinTimeForToday(){
            let today = new Date,
                startTimeHour = today.getHours(),
                startTimeMinutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
            return startTimeHour + ':' + startTimeMinutes
        }
        function getOpenHours(data, todayWeekDay){
            data.forEach( (item, index) => {
                if(todayWeekDay == index){
                    minTime = item.from || 0
                    maxTime = item.to || 0
                }
                if(!item.from && !item.to) disabledWeekDays.push(index)
            })
            if(maxTime){
                let arr = maxTime.split('')
                arr[arr.length - 1] = +arr[arr.length - 1] + 1
                maxTime = arr.join('')
            }
        }
        function checkNeededTimeForRepair() {
            let totalMinutesForRepair = totalTimeForRepair*60 + 1,
                countHiddenTimeBlocks = Math.ceil(totalMinutesForRepair/30)

            $('.xdsoft_time_variant .xdsoft_time').each( function(index, element){
                let elementsArray = $('.xdsoft_time_variant .xdsoft_time')
                if( index + countHiddenTimeBlocks >= elementsArray.length){
                    $(this).css({opacity: '.4', pointerEvents: 'none'})
                }
            })
        }
        function setTimeAfterSelectDate(){
            let timeArray = [...$('.xdsoft_time_variant .xdsoft_time')]
            timeArray.forEach( item => item.classList.remove('xdsoft_current'))
        }

        function createCalendar(minTimeParam, maxTimeParam, disabledWeekDays ){
            $.datetimepicker.setLocale('de');
            $('#datetimepicker').datetimepicker({
                formatDate:'d.m.Y',
                formatTime: 'H:i',
                inline:true,
                step: 30,
                minDate: new Date(),
                disabledWeekDays,
                minTime: minTimeParam,
                maxTime: maxTimeParam,
                scrollMonth: false,
                defaultSelect: false,
                onChangeDateTime:function(dp,$input){
                    setHeight()
                    calendarTimePosition()
                },
                onChangeMonth: function(){
                    setHeight()
                },
                onChangeYear: function(){
                    setHeight()
                },
                onGenerate: function(ct, input){
                    setTimeout( () => {
                        setHeight()
                        calendarTimePosition()
                        checkNeededTimeForRepair()
                    }, 10)
                },
                onSelectTime: function(){
                    _this.setState({ isSelectTime: true })
                },
                onSelectDate:function(ct,$i){
                    let today = new Date,
                        currentYear = today.getFullYear(),
                        currentMonth = today.getMonth(),
                        currentDay = today.getDate(),
                        selectedYear = ct.getFullYear(),
                        selectedMonth = ct.getMonth(),
                        selectedDay = ct.getDate(),
                        selectedDayEqualTodayDay = currentYear === selectedYear && currentMonth === selectedMonth && currentDay === selectedDay

                    getOpenHours(_this.state.openHours, ct.getDay())
                    if(selectedDayEqualTodayDay) {
                        minTime = setMinTimeForToday()
                    }

                    $('#datetimepicker').datetimepicker('setOptions', { minTime, maxTime });
                    setTimeout(() => {
                        checkNeededTimeForRepair()
                        setTimeAfterSelectDate()
                    }, 20)
                    _this.setState({ errors: {..._this.state.errors, datetime: ''}, isSelectTime: false })
                }
            })
        }

    }
    _setDataFields(data){
        let email = data.systemAddress.email,
            phone = data.systemAddress.phone,
            firstName = data.systemAddress.first_name,
            lastName = data.systemAddress.last_name

        if(phone && phone.indexOf('0041') === 0) phone = '+' + phone.slice(2)
        this.setState({ formData: { ...this.state.formData, email, phone, firstName, lastName } })
    }

    verifyCaptchaCallback(res){
        this.setState({ captcha: { ...this.state.captcha, isCheckCaptcha: true, errorCaptcha: false } })
    }
    showCaptcha(e){
        let { captcha } = this.state
        if(!captcha.isCheckCaptcha){
            this.recaptchaInstance.execute();
        }
        else{
            this.recaptchaInstance.reset()
            this.setState({ captcha: { ...this.state.captcha, isCheckCaptcha: false, errorCaptcha: false }})
        }
    }

    sendForm(e){
        e.preventDefault()

        let { captcha, isSelectTime } = this.state,

            { selectedRepairOptions, model } = this.props,
            datetime = Date.parse(createDateAsUTC(new Date($('#datetimepicker').datetimepicker('getValue')))),
            data = { ...this.state.formData,
                datetime,
                repairs: selectedRepairOptions.map( item => item.shortcode),
                modelId: model.id,
                colorId: this.state.formData.colorValue && this.state.formData.colorValue.id
            }
        if( (captcha.isCheckCaptcha || !window.isGoogleConnection) && isSelectTime){
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.post('/api/bookingWithShopVisit', data)
                .then( result => {
                    document.getElementById('spinner-box-load').style.display = 'none'

                    this.setState({ formWasSubmited: true })
                    //this.props.basketActions.changeBasketDataRepair([])
                    //this.props.basketActions.changeShippingMethodRepair(null)
                })
                .catch( error => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    let errorsResponse = error.response.data.errors,
                        errors = {}

                    for( let key in errorsResponse){
                        errors[key] = errorsResponse[key][0]
                    }
                    this.setState({ errors })
                })
        }
        else{
            this.setState({ captcha: { ...this.state.captcha, errorCaptcha: !captcha.isCheckCaptcha },
                errors: { ...this.state.errors, datetime: !isSelectTime && 'Date/time field is required'}
            })
        }
        function createDateAsUTC(date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        }
    }
    changeColor(colorValue){
        this.setState({
            formData: {...this.state.formData, colorValue},
            errors: {...this.state.errors, colorId: ''}
        })
    }
    mapColorOptionSelected(item){
        return (
            <span>
                {item.value}<span className="colorPic" style={{background: item.code}}/>
            </span>
        )
    }
    mapColorOption(item){
        return (
            <span>
                {item.value}<span className="colorPic" style={{background: item.code}}/>
            </span>
        )
    }

    _initMap() {
        function CustomMarker(latlng, map, args) {
            this.latlng = latlng
            this.args = args
            this.setMap(map)
        }
        CustomMarker.prototype = new google.maps.OverlayView()
        CustomMarker.prototype.draw = function() {
            let div = this.div
            if (!div) {
                div = this.div = document.createElement('div')
                div.className = 'mapMarker'
                var panes = this.getPanes()
                panes.overlayImage.appendChild(div)
            }

            var point = this.getProjection().fromLatLngToDivPixel(this.latlng)
            if (point) {
                div.style.left = point.x - 20 + 'px'
                div.style.top = point.y + 'px'
            }
        }

        let myLatlng = new google.maps.LatLng(47.555012, 7.5886962);
        let map = new google.maps.Map(document.querySelector('.mapWrapper'), {
            zoom: 17,
            center: myLatlng
        })
        let infoWindow = new google.maps.InfoWindow();
        let service = new google.maps.places.PlacesService(map);
        let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1],
            placeId = domain === 'ch' ? 'ChIJ6Woipq25kUcRoqB8dyvAvKA' : 'ChIJxwhr9H6xkUcRzxmAyoHLx8k'
        service.getDetails({
            placeId
        }, function (result, status) {
            map.setCenter(result.geometry.location);
            let marker = new google.maps.Marker({
                map: map,
                place: {
                    placeId,
                    location: result.geometry.location
                }
            });
            marker.setVisible(false)
            let starWidth = (result.rating/5)*100 + '%'

            let starsContent = ``
            result.rating
                ?   starsContent = `<b style="color:#02ca95">${result.rating}&nbsp;</b>
                                    <div class="back-stars">
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <i class="fa fa-star active" aria-hidden="true"></i>
                                        <div class="front-stars" style="width: ${starWidth}">
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                            <i class="fa fa-star" aria-hidden="true"></i>
                                        </div>
                                    </div>`
                : null
            let content = `<div class="map-info-block">
                            <p><b>${result.name}</b></p>
                            <p>${result.adr_address.replace(/,/g, '')}</p>
                            ${starsContent}
                           </div>`
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
            let overlay = new CustomMarker(result.geometry.location, map, {})
        })
    }

    render(){
        let { totalPrice, model, totalTime } = this.props,
            { captcha, errors, formData, formWasSubmited } = this.state,
            country = window.domainName.name === 'remarket.ch' ? 'ch' : 'de'

        return(
            <div>
                <div className="delivery-book form-send-delivery-book">
                    {!formWasSubmited && <div className="price">
                        <h3 className="title">price</h3>
                        <p className="value">{totalPrice} {window.currencyValue}</p>
                    </div>
                    }
                    <div className="row">
                        <form name="contactData" onSubmit={this.sendForm}>

                            {formWasSubmited && <div className="col-md-4 col-sm-6">
                                <img className='form-send-device-photo' src="" alt=""/>

                                <h3 className='form-send-thanks'>Thank you!</h3>
                                <p className='form-send-thanks__content'>I'm glad I can help you estimate the repair price of your device. Book appintment</p>
                                <section className='form-send-devise'>
                                    <div>
                                        <span className='form-send-devise__model'>{model.title}</span>
                                        <p className="form-send-devise__color">
                                            <span className={`form-send-devise__color_${formData.colorValue && formData.colorValue.id}`}
                                                  style={{background: `${formData.colorValue.code}`,
                                                      width: "15px",
                                                      height: "15px",
                                                      display: "inleneBlock",
                                                      borderRadius: "50%"
                                                  }}/>&nbsp;
                                            <span className="form-send-devise__description">{formData.colorValue.value}, 32 GB</span>
                                        </p>
                                    </div>
                                    <div className='form-send-devise__price'>{totalPrice}{window.currencyValue}</div>
                                </section>
                                <p className='form-send__duration'>Duration:&nbsp;
                                    {totalTime.toFixed(2)} {+totalTime.toFixed(0) > 0 && +totalTime.toFixed(0) === 1? <span>hour</span> : <span>hours</span>}
                                </p>
                            </div>
                            }
                            <div className={formWasSubmited? "col-md-4 col-sm-6 calendar" : "col-md-4 col-sm-6 item-column calendar"}>
                                <div>
                                    {formWasSubmited ? <p className='form-send__title'>Add apointment</p> : <h3 className="title"><span className="num">1</span>Datum und Uhrzeit auswählen</h3> }
                                    <input type="text" id="datetimepicker"/>
                                    {formWasSubmited ? <button className="btn form-send__btn" type="submit">
                                        <p>Book apointment</p>
                                        <p className='form-send__btn-arrow'>&rarr;</p>
                                    </button> : ''
                                    }
                                </div>
                                <div className="input-row">
                                    {errors.datetime && <p className="info error">{errors.datetime}</p>}
                                </div>
                            </div>
                            {!formWasSubmited && <div className="col-md-4 col-sm-6 item-column">
                                <div>
                                    <h3 className="title"><span className="num">2</span>Kontaktdaten eintragen</h3>
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.firstName}
                                               onChange={this.handlerChangeInput}
                                               name="firstName"
                                               required placeholder="Vorname"/>
                                        {errors.firstName && <p className="info error">{errors.firstName}</p>}
                                    </div>
                                    <div className="input-row">
                                        <input type="text"
                                               value={formData.lastName}
                                               onChange={this.handlerChangeInput}
                                               name="lastName"
                                               required placeholder="Nachname"/>
                                        {errors.lastName && <p className="info error">{errors.lastName}</p>}
                                    </div>

                                    <div className="input-row">
                                        <ReactTelephoneInput
                                            inputProps={{name: "phone_number", required: true }}
                                            pattern="(\+?\d){11,}"
                                            value={formData.phone}
                                            onChange={this.changePhoneNumber}
                                            defaultCountry={country}
                                            autoFormat={false}
                                            placeholder="Ihre Mobiltelefonnummer"
                                            flagsImagePath='/images/design/flags.png'/>
                                        {errors.phone && <p className="info error">{errors.phone}</p>}
                                    </div>

                                    <div className="input-row">
                                        <input type="email"
                                               value={formData.email}
                                               onChange={this.handlerChangeInput}
                                               name="email"
                                               required
                                               placeholder="E-Mail"/>
                                        {errors.email && <p className="info error">{errors.email}</p>}
                                    </div>
                                    <div className="select">
                                        <Select
                                            placeholder="Bitte wählen Sie Farbe Ihres Gerätes aus"
                                            value={formData.colorValue}
                                            name="colorCode"
                                            clearable={false}
                                            options={model.colors}
                                            searchable={false}
                                            required={true}
                                            valueKey="id"
                                            labelKey="value"
                                            valueRenderer={this.mapColorOptionSelected.bind(this)}
                                            optionRenderer={this.mapColorOption.bind(this)}
                                            onChange={ this.changeColor }/>
                                        {errors.colorId && <p className="info error">{errors.colorId}</p>}
                                    </div>
                                </div>
                            </div>
                            }
                            {!formWasSubmited &&
                            <div className="col-md-4 col-sm-6 item-column">
                                <div>
                                    <h3 className="title"><span className="num">3</span>Termin bestätigen</h3>
                                    <p>Bitte kontrollieren Sie nochmals alle Angaben und bestätigen Sie den Termin.</p>
                                    <Recaptcha
                                        sitekey={window.captchaSitekey.key}
                                        render="explicit"
                                        hl={"de"}
                                        verifyCallback={this.verifyCaptchaCallback}
                                        onloadCallback={() => false}
                                    />
                                    { captcha.errorCaptcha && <p style={{color: 'red'}}>Bitte bestätigen Sie, dass Sie kein Roboter sind.</p> }
                                    <button className="btn send" type="submit">
                                        Jetzt Termin reservierendasdas
                                    </button>
                                </div>
                            </div>
                            }
                            {formWasSubmited &&
                            <div className="col-md-4 col-sm-6 item-column">
                                <div>
                                    <p className="form-send__title-address">Adressess</p>
                                    <p className='form-send__address'>IRepartur.ch <br/> Gerbergasse 82 <br/> CH-4001 Basel</p>
                                    <h3 className="form-send__title">Ofnungszeiten Basel</h3>
                                    <div className='form-send-container form-send__address'>
                                        <span>Mo-Fr:</span>
                                        <span>09:00 - 18.30 Uhr</span>
                                    </div>
                                    <div className='form-send-container form-send__address'>
                                        <span>Sa:</span>
                                        <span>10:00 - 18.00 Uhr</span>
                                    </div>
                                    <div className="form-send-contucts">
                                        <h3 className="form-send-contucts__title">E-mail</h3>
                                        <p className='form-send-contucts__mail'>
                                            <img src="/images/repair-icons/mail.svg" alt=""/>
                                            <span>basel@irepartur.ch</span>
                                        </p>
                                        <h3 className="form-send-contucts__title">Telephone</h3>
                                        <p className='form-send-contucts__mail'>
                                            061 511 22 42</p>
                                    </div>
                                </div>
                            </div>
                            }
                        </form>
                    </div>
                    <div className="row">
                        <div className={!formWasSubmited ? "mapWrapper form-send_none":  "mapWrapper form-send_active"} />
                        <div className="col-md-12">
                            <p className="info-block">Gerne können Sie Ihr Gerät spontan während unseren Öffnungszeiten für die Reparatur vorbeibringen und direkt auf das reparierte Gerät warten!</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function setHeight(){
    /*find height item-column*/
    let maxHeight = 0
    $('.item-column').each( function(){
        if($('div', this).height() > maxHeight) maxHeight = $('div', this).height()
    }).height(maxHeight)
    /*end*/
}
function calendarTimePosition() {
    if($('.xdsoft_time_variant').height() < $('.xdsoft_timepicker').height()){
        let count = $('.xdsoft_timepicker').height() - $('.xdsoft_time_variant').height()
        if(count - 96 > 0) $('.xdsoft_time_variant').css({ marginTop: count/2 - 24 + 'px'})
    }
}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(BookAnAppointment)
