import React, {Component} from 'react'
import {Animated} from "react-animated-css"
import SendLinks from "../sendLinks"
import SpinnerDots from "../../spinnerDots/spinnerDots"
import axios from "axios";

class TemplateAssistant extends Component {

    state = {
        isAnim: true,
        sellDeadline: process.env.MIX_IS_SELL_COUPON ? true : false,
        sellDeadlineExpired: false,
        isUnlimited: false,
        isActive: false
    }
    componentWillMount(){
        const {selectedAnswers, values, name, content} = this.props;

        let selected = []
        if(name && selectedAnswers ){
            selected =  selectedAnswers[name];
        }
        if(selected && selected.length >0){
            if(selected.every( elem => values.some(el=> el.id == elem.id ))){
                this.setState ({
                    isAnim: false
                })
            }
        }
        if(content){
            axios.get('/api/updatePurchaseStatistics')
            snaptr('track','VIEW_CONTENT',  {'VIEW_CONTENT': 'true'});
        }
    }
    componentDidMount(){
        let resetCounter = location.search.split('discount=')[1];
        if(resetCounter) {
            window.localStorage.removeItem("sellDeadline");
        }
        if(process.env.MIX_IS_SELL_COUPON && this.props.content){
            this.setState({ sellDeadline: false })

            this.updateCountDown()
            // Update the count down if timer not load
            setTimeout(() => {
                this.updateCountDown()
            }, 1000)


// Update the count down every 1 min
            this.countdown = setInterval(() => {
                this.setState({ sellDeadline: false })
                this.updateCountDown()
            }, 60000);
        }
    }
    componentWillUnmount(){
        clearInterval(this.countdown);
    }
    updateCountDown(){
        const countDownShortcode = location.search.split('shortcode=')[1];
        this.setState({ sellDeadline: true })
        let sellDeadline = JSON.parse(window.localStorage.getItem('sellDeadline')),
            numericTimer = document.getElementById("timer");
        if(!sellDeadline) {
            var countDownDate = new Date();
            countDownDate.setSeconds(countDownDate.getSeconds()-1);
            countDownDate.setHours(countDownDate.getHours() + 48);
            sellDeadline = {countDownDate: countDownDate, sellDeadlineExpired: 0, couponShortcode: '', isUnlimited: 0, isActive: 1};
            window.localStorage.setItem('sellDeadline', JSON.stringify(sellDeadline));
        }
        if(sellDeadline && !countDownShortcode && sellDeadline.sellDeadlineExpired){
            this.setState({ sellDeadlineExpired: true });
            clearInterval(this.countdown);
            return;
        }
        if(countDownShortcode || (sellDeadline.couponShortcode!=='' && !sellDeadline.sellDeadlineExpired )) {
            let coupon = countDownShortcode ? countDownShortcode : sellDeadline.couponShortcode
            axios.get(`/api/checkCoupon?coupon=${coupon}&couponType=6`)
                .then((data) => {
                    sellDeadline.couponShortcode = coupon;
                    sellDeadline.isUnlimited = sellDeadline.isUnlimited ? 1 : (countDownShortcode ? 1 : 0);
                    sellDeadline.sellDeadlineExpired = sellDeadline.isUnlimited?0:this.state.sellDeadlineExpired;
                    this.setState({isUnlimited: sellDeadline.isUnlimited, sellDeadlineExpired: sellDeadline.sellDeadlineExpired})
                    window.localStorage.setItem('sellDeadline', JSON.stringify(sellDeadline));
                })
                .catch(error => {
                    let {data} = error.response
                    console.log('error', data);
                    sellDeadline.sellDeadlineExpired = 1;
                    sellDeadline.isUnlimited = 0;
                    window.localStorage.setItem('sellDeadline', JSON.stringify(sellDeadline));
                    clearInterval(this.countdown);
                    this.setState({ sellDeadlineExpired: true });
                    return;
                })
        }

        let basketDataVerkaufen = JSON.parse(window.localStorage.getItem('basketDataVerkaufen'));
        let couponInBasket = basketDataVerkaufen?basketDataVerkaufen.filter(item => item.productTypeId === 999):[];
        sellDeadline.isActive = couponInBasket.length ? 0: 1;
        this.setState({ isActive: sellDeadline.isActive })
        window.localStorage.setItem('sellDeadline', JSON.stringify(sellDeadline));
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = new Date(sellDeadline.countDownDate).getTime() - now;
        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 48)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display the result in the element with id="numericTimer"

        if(numericTimer) {
            numericTimer.innerHTML = hours + "Std. " + minutes + "Min."
        }

        // If the count down is finished
        if (!countDownShortcode && !sellDeadline.isUnlimited && distance < 0) {
            sellDeadline.sellDeadlineExpired = 1;
            window.localStorage.setItem('sellDeadline', JSON.stringify(sellDeadline));
            this.setState({ sellDeadlineExpired: true });
            clearInterval(this.countdown);
        }
    }
    _calculatePrice = (userAnswers ) => {
        let minPrice = +userAnswers.Model[0].minPrice,
            total = 0,
            oldPrice = 0
        for (let key in userAnswers) {
            if (key === 'Defects') {
                userAnswers[key].forEach(item => total += +item.price)
            }
            else if (key !== 'Brand' && key !== 'Submodel' && key !== 'image' && key !== 'Device' && key !== 'Condition' && key !== 'comment') {
                if (key === 'Model') {
                    userAnswers[key].forEach(item => {
                        total += +item.price
                    })
                }
                else {
                    userAnswers[key].forEach(item => {
                        let modelPrice = +userAnswers.Model[0].price,
                            itemPrice = +item.valuePrice.replace(/,/g, ".").replace(/[^\d.]/g, ""),
                            newPrice = 0,
                            isPersantage = item.valuePrice.includes('%'),
                            isNegative = item.valuePrice.includes('-')
                        if (isPersantage) {
                            newPrice = Math.ceil((modelPrice * (itemPrice / 100)) / 5) * 5
                            if (isNegative) {
                                total -= newPrice
                            }
                            else {
                                total += newPrice
                            }
                        }
                        else {
                            if (isNegative) {
                                total -= itemPrice
                            }
                            else {
                                total += itemPrice
                            }
                        }

                    })
                }
            }
        }
        if (total < minPrice) total = minPrice
        oldPrice = total
        if (userAnswers.Model[0].discountPrice > 0) total += +userAnswers.Model[0].discountPrice
        if (oldPrice === total) oldPrice = 0
        oldPrice = (Math.round(oldPrice / 5)) * 5
        total = (Math.round(total / 5)) * 5
        return {price: total || 0, oldPrice: oldPrice || 0, couponPrice: total + 20}
    }
    _mapCriterias = (userAnswers) => {
        let elementsArray = []
        for (let answer in userAnswers) {
            let titleName = '',
                className = "col-xs-12 col-sm-6 itemAnswerAssistant"
            switch (answer) {
                case 'Brand':
                    titleName = 'Marke'
                    break
                case 'Submodel':
                    titleName = 'Untermodell'
                    break
                case 'Model':
                    titleName = 'Modell'
                    break
                case 'Condition':
                    titleName = 'Allgemeiner Zustand'
                    break
                case 'Defects':
                    titleName = 'Liste der Defekte'
                    break
                default:
                    titleName = answer
            }
            if (answer !== 'image' && answer !== 'Device' && answer !== 'Defects' && answer !== 'comment') {
                elementsArray.push(
                    <div className={className} key={answer}>
                        <p className="title">{titleName}</p>
                        <ul>
                            {userAnswers[answer].map((item, i) => {
                                    return (<li key={i}>
                                        {item.name} {item.nameExt ? ` (${item.nameExt})` : null}
                                        {!item.hasOwnProperty('colorCode') && answer !== 'Model' && item.image &&
                                        <img src={item.image}/>}
                                        {item.colorCode &&
                                        <span className="colorPic" style={{backgroundColor: item.colorCode}}/>}
                                    </li>)
                                }
                            )
                            }
                            {userAnswers[answer].length === 0 && <li>-</li>}
                        </ul>
                    </div>
                )
            }
            if (answer === 'Defects') {
                elementsArray.push(
                    <div className={className} key={answer}>
                        <p className="title">{titleName}</p>
                        <p>{userAnswers[answer].map((item, i) =>
                            <span
                                key={i}>{item['description-short']}{i < userAnswers[answer].length - 1 ? ', ' : null}</span>)}
                        </p>
                    </div>
                )
            }
        }
        //wrap in row class
        let groupSize = 2
        let rows = elementsArray.reduce((r, element, index) => {
            index % groupSize === 0 && r.push([])
            r[r.length - 1].push(element)
            return r;
        }, []).map(function (rowContent, i) {
            return <div className="row" key={i}>{rowContent}</div>
        })
        return rows
    }

    render() {
        const { question, content, userAnswers, user, handleSellNow } = this.props;
        const delay = this.props.delay;
        const { sellDeadlineExpired,  sellDeadline, isUnlimited, isActive } = this.state;
        const calcPrice = userAnswers ? this._calculatePrice(userAnswers) : null;
        let animDelay=0;
        if(!delay) {
            animDelay = 1000
        }
        else if (delay === 0) {
            animDelay = 0;
        }
        else (animDelay = delay + 1000)
        return (
            <Animated animationInDelay={delay?delay:0} animateOnMount={!delay?false:true} className={!delay?"cancelAnimation":""}>
            <div>
                <p>Remo</p>
                {content &&
                <div className="question assistant">
                    <div>
                        <img className="assistantContent" src="/images/design/assistantForQuestion-small.svg" alt=""/>
                        <span>{question}</span>
                        <div className="tabSummary sendLinks">{!window.isMobile && <SendLinks user={user} id="summary1" isAssistantQuestion={true}/>}</div>
                    </div>
                    <div className="assistant content panel">
                        <div className="panel-body">
                            <div className="col-md-12 tabSummary">
                                <div className="row">
                                    {window.isMobile && <SendLinks user={user} id="summary1"/>}
                                </div>
                            </div>
                            {
                                !window.isMobile && <div className="col-md-5 top-row">
                                    <div className="col-sm-12  text-center">
                                        <img src={userAnswers.image} className="imageAssistantContent"/>
                                    </div>
                                    <div className="priceAssistant">
                                        <p className="title">Ihr Preis
                                            { isActive && !sellDeadlineExpired && calcPrice.price > 99 ?
                                                <Animated animationIn="zoomIn" animationInDelay={1500} style={{display: "inline"}}>
                                                    <span> | <span className='old-price'> {calcPrice.price} {window.currencyValue}</span>
                                                    </span>
                                                </Animated>

                                                : ''
                                            }
                                        </p>
                                        {
                                            isActive && calcPrice.price > 99 && !sellDeadlineExpired ?
                                                <React.Fragment>
                                                    <Animated animationIn="zoomOut" animationInDelay={1000}>
                                                            <p  className='value' style={{color: '#333333', textDecoration: 'line-through'}}>
                                                                {calcPrice.price}  {window.currencyValue}
                                                            </p>
                                                    </Animated>
                                                     <Animated animationIn="bounceIn" animationInDelay={1500}>
                                                            <p className='value' style={{display: 'block', position: 'absolute', bottom: '63%'}}>
                                                                {calcPrice.couponPrice}  {window.currencyValue}
                                                            </p>
                                                    </Animated>
                                                </React.Fragment>

                                            :
                                                <Animated animationIn="bounceIn" animationInDelay={1000}>
                                                        <p className='value'>
                                                            {calcPrice.price}  {window.currencyValue}
                                                        </p>
                                                </Animated>
                                        }
                                    </div>
                                    {
                                        (sellDeadline && isActive && !isUnlimited && !sellDeadlineExpired && calcPrice.price > 99) ?
                                        <div className="coupon">
                                            <p>Angebot gilt nur für kurze Zeit!</p>
                                            <div className="countdown">
                                                <img src="/images/design/shop/coupons/group.svg" alt=""/>
                                                <span id='timer'></span>
                                            </div>
                                        </div>
                                            : ''
                                    }
                                </div>
                            }

                            <div className="col-md-7 panel_markup">
                                <div className="row">
                                    <div>
                                        <div className="wrapAnswers">
                                            {this._mapCriterias(userAnswers)}
                                        </div>
                                    </div>
                                </div>
                                {
                                    window.isMobile &&
                                        <React.Fragment>
                                            <div className="col-sm-5 top-row p-0">
                                                <div className="col-xs-6 col-sm-12  text-center">
                                                    <img src={userAnswers.image} className="imageAssistantContent"/>
                                                </div>
                                                <div className="priceAssistant">
                                                    <p className="title">Ihr Preis
                                                        { isActive && !sellDeadlineExpired && calcPrice.price > 99 ?
                                                            <Animated animationIn="zoomIn" animationInDelay={2000} style={{display: "inline"}}>
                                                    <span> | <span className='old-price'> {calcPrice.price} {window.currencyValue}</span>
                                                    </span>
                                                            </Animated>

                                                            : ''
                                                        }
                                                    </p>
                                                    {
                                                        isActive && calcPrice.price > 99 && !sellDeadlineExpired ?
                                                            <React.Fragment>
                                                                <Animated animationIn="zoomOut" animationInDelay={1500}>
                                                                    <p  className='value' style={{color: '#333333', textDecoration: 'line-through'}}>
                                                                        {calcPrice.price}  {window.currencyValue}
                                                                    </p>
                                                                </Animated>
                                                                <Animated animationIn="bounceIn" animationInDelay={2000}>
                                                                    <p className='value' style={{display: 'block', position: 'absolute', bottom: '63%'}}>
                                                                        {calcPrice.couponPrice}  {window.currencyValue}
                                                                    </p>
                                                                </Animated>
                                                            </React.Fragment>

                                                            :
                                                            <Animated animationIn="bounceIn" animationInDelay={1000}>
                                                                <p className='value'>
                                                                    {calcPrice.price}  {window.currencyValue}
                                                                </p>
                                                            </Animated>
                                                    }
                                                </div>

                                            </div>
                                            { sellDeadline && isActive && !isUnlimited && !sellDeadlineExpired && calcPrice.price > 99 ?
                                                <div className="coupon">
                                                    <p>Angebot gilt nur für kurze Zeit!</p>
                                                    <div className="countdown top-row">
                                                        <img src="/images/design/shop/coupons/group.svg" alt=""/>
                                                        <span id='timer'></span>
                                                    </div>
                                                </div>
                                                :''
                                            }
                                        </React.Fragment>
                                }
                                <div className="row">
                                    <div className="col-md-12">
                                        <button className="btn quickSell" onClick={handleSellNow}>
                                            Jetzt verkaufen
                                            <img src="/images/design/sell-icon-white.svg" alt=""/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                }
                {!content &&
                <div className="question assistant">
                    <img className="assistant" src="/images/design/assistantForQuestion-small.svg" alt=""/>
                    {this.state.isAnim &&
                    <span>
                        <Animated animationOutDelay={animDelay} isVisible={false}>
                            <SpinnerDots />
                        </Animated>
                        <span>
                            <Animated animationInDelay={animDelay}>
                                {question}
                            </Animated>
                        </span>
                    </span>
                    }
                    {!this.state.isAnim && <span>{question}</span>}
                </div>
                }
            </div>
            </Animated>
        )
    }

}

TemplateAssistant.propTypes = {}
TemplateAssistant.defaultProps = {}

export default TemplateAssistant