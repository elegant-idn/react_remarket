import React, {useState, useEffect} from 'react';
import {Link} from 'react-router';
import OverviewModal from './overviewModal'
import {ACCESSORIES_ID} from '../../constants/accessories';
import { composeInitialProps } from 'react-i18next';

const ProductOverview = ({
                             user,
                             addCreditsToBasket,
                             credits,
                             taxOnlyForVat,
                             basketData,
                             removeFromBasket,
                             taxValue,
                             goToCheckoutMobile,
                             tax,
                             total,
                             changeCoupon,
                             triggerChangeCoupon,
                             couponError,
                             addInsuranceToBasket,
                             addInsuranceToBasketCh,
                             updateBasketData,
                             deadline,
                             activateCountDownCoupon,
                             deadlineIsActive,
                             deadlineExpired,
                             infoRatings,
                             rateData,
                             insuranceChAmountChange,
                             insuranceChAmount
                         }) => {
    const [activeTab, setActiveTab] = useState('kaufen')
    const [positionSlide, setPositionSlide] = useState(8)
    const [month, setMonth] = useState(3);
    const [mobileAccordionIsClose, setMobileAccordionIsClose] = useState(window.isMobile ? true : false)
    const [monthPrice, setMonthPrice] = useState('00.00')
    const [insurancePriceCh, setInsurancePriceCh] = useState(false)

    let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]
    let showLevel= 3
    let totalPrice = 0;

    let uniqueBasketData = [];
    let basketTitle = '';
    basketData.forEach(item => {
        if (uniqueBasketData.some(el => el.shortcode === item.shortcode)) {
            return false
        } else {
            let count = basketData.reduce((s, item2) => {
                return s += (item2.shortcode === item.shortcode) ? 1 : 0
            }, 0);
            item.count = count;
            uniqueBasketData = [...uniqueBasketData, item];            
        }
    });
    uniqueBasketData.forEach(item => {
        let count = item.count
        if (item.productTypeId == 11) {
            totalPrice += parseFloat(item.price) * count
        } else if (item.productTypeId == 100) {
            totalPrice -= parseFloat(item.price) * count
        } else if (item.productTypeId == 999) {
            totalPrice -= parseFloat(item.price) * count
        } else if (item.productTypeId == 501) {
            return null
        } else if (item.productTypeId == 500) {
            return null
        } else if (ACCESSORIES_ID.includes(item.productTypeId)) {
            totalPrice += count * (item.discountPrice ? parseFloat(item.discountPrice) : parseFloat(item.price))
            if (basketTitle != '') {
                basketTitle +=', '
            }
            basketTitle += item.model
        } else if (item.productTypeId == 7) {  // if item 'model'
            totalPrice += count * (item.discountPrice ? parseFloat(item.discountPrice) : parseFloat(item.price))
            if (basketTitle != '') {
                basketTitle +=', '
            }
            let title = ''
            title += item.model
            title += item.capacity !== '' ? ' - ' + item.capacity : ''
            title += item.color !== '' ? ' - ' + item.color : ''
            basketTitle += title
        }
    });    
    useEffect(() => {
        setMonthPrice((totalPrice / showLevel).toFixed(2))
    }, [showLevel, totalPrice]);

    const handleChangeTab = (e) => {
        const activeNavItem = e.currentTarget.getAttribute('data-type')
        setActiveTab(activeNavItem)
    }

    const handleChangeMonth = (month) => {
        setMonth(month)
        setMonthPrice((totalPrice / month).toFixed(2))
        if (month === 3) {
            setPositionSlide(8)
        } else if (month === 6) {
            setPositionSlide(41)
        } else {
            setPositionSlide(74)
        }
    }

    function mapBasketData(item, i) {
        if (item.productTypeId == 11) {          // if item 'Shipping Method'
            return (
                <div key={`mapBasketData-${i}`} className='basket-item'>
                    <div className="item-top-with-img">
                        <div className='basket-item-top'>
                            <p className="modelName">
                                {item.name} {item.shortcode === "PICKAS" ? basketData[0].placeDescription : ""}
                            </p>
                            <div className="devicePrice">
                                <p className={'price'}>
                                    {Math.round((+item.price) * 100) / 100} {window.currencyValue}
                                </p>
                            </div>
                            <span onClick={() => removeFromBasket(item.productTypeId)} className="removeFromBasket" />
                        </div>
                    </div>
                </div>)
        } else if (item.productTypeId == 100) {        // if item 'Credits'
            item.id = i
            return (
                <div key={`mapBasketData-${i}`} className='basket-item'>
                    <div className="item-top-with-img">
                        <div className='basket-item-top'>
                            <p className="modelName">
                                {`Credits`}
                            </p>
                            <div className="devicePrice">
                                <p className={'price'}>
                                    -{Math.round((+item.price) * 100) / 100} {window.currencyValue}
                                </p>
                            </div>
                            <span onClick={() => removeFromBasket(item.productTypeId, i)} className="removeFromBasket" />
                        </div>
                    </div>
                </div>)
        } else if (item.productTypeId == 999) {        // if item 'Coupon'
            return (
                <div key={`mapBasketData-${i}`} id="coupon" className='basket-item'>
                    <div className="item-top-with-img">
                        <div className='basket-item-top'>
                            <p className="modelName">
                                {item.note} ({item.shortcode})
                            </p>
                            <div className="devicePrice">
                                <p className={'price'}>
                                    -{Math.round((+item.price) * 100) / 100} {window.currencyValue}
                                </p>
                            </div>
                            <span onClick={() => removeFromBasket(item.productTypeId, item.shortcode)} className="removeFromBasket" />
                        </div>
                    </div>
                </div>)
        } else if (item.productTypeId == 501) { // for germany       // if item 'insurance for device'
            return null
        } else if (item.productTypeId == 500) {        // if item 'insurance for product'
            return null
        } else if (ACCESSORIES_ID.includes(item.productTypeId)) {        // if item 'accessories' 3 = cases / 4 = accessories / 5 = software / 9 = spare parts / 10 = temperd glass
            let modelName = item.model ? item.model.split(" ").join('-').toLowerCase().replace(/\//g, '--') : 'model',
                deviceName = item.deviceName ? item.deviceName.toLowerCase().replace(/ /g, '-') : 'device',
                color = item.color ? item.color.toLowerCase() : 'color',
                url = `/kaufen/detail/zubehoer/${deviceName}/${modelName}/${item.shortcode}`
            return (
                <div key={`mapBasketData-${item.id}`} className='basket-item'>
                    <div className="item-top-with-img">
                        {window.isMobile && <img src={item.deviceImages.mainImg.src} alt=""/>}
                        <div className='basket-item-top'>
                            <p className="modelName">
                                <Link to={url} key={`mapBasketData-link-${item.id}`}>
                                    {item.model}
                                </Link>
                                <span className="id">ID: {item.shortcode}</span>
                            </p>
                            <div className="accessoryCountPrice">
                                <input type="number"
                                        defaultValue={item.count}
                                        min="1"
                                        className="basketItemCount"
                                        onBlur={(e) => updateBasketData(e.target.value, item.shortcode)}/>


                                {item.discountPrice &&
                                    <p className="price discount-price">{item.discountPrice} {window.currencyValue}</p>
                                }
                                <p className={item.discountPrice ? 'price old-price' : 'price'}>{Math.round((+item.price) * 100) / 100} {window.currencyValue}</p>
                            </div>
                            {(item.productTypeId == "3" || item.productTypeId == "10") ?
                                (<span onClick={() => removeFromBasket(item.productTypeId, item.shortcode)}
                                    className="removeFromBasket">
                            </span>) :
                                (<span onClick={() => removeFromBasket(null, item.shortcode)}
                                    className="removeFromBasket">
                            </span>)}
                        </div>
                    </div>
                    <div className="wrapCriterias">
                        {!window.isMobile && <img src={item.deviceImages.mainImg.src} alt=""/>}
                        <ul>
                            {item.criterias && item.criterias.map(mapCriterias)}
                            <li></li>
                        </ul>
                    </div>
                </div>
            )
        } else if (item.productTypeId == 7) {  // if item 'model'
            let modelName = item.model.replace(/ /g, '-').toLowerCase(),
                color = item.color ? item.color.toLowerCase() : 'color',
                capacity = item.capacity ? item.capacity.toLowerCase() : 'capacity',
                deviceName = item.deviceName.replace(/ /g, '-').toLowerCase()
            return (<div className='basket-item' key={`mapBasketData-${i}`}>
                <div className="item-top-with-img">
                    {window.isMobile && <img src={item.colorImage || item.deviceImages.mainImg.src} alt=""/>}
                    <div className='basket-item-top'>
                        <p className="modelName">
                            <Link to={`/kaufen/detail/${deviceName}/${modelName}/${capacity}/${color}/${item.shortcode}`}
                                  key={`mapBasketData-link-${i}`}>
                                {item.model}{item.extendedTitle && ` (${item.extendedTitle})`}
                            </Link>
                            <span className="id">ID: {item.shortcode}</span>
                        </p>
                        <div className="devicePrice">
                            {item.discountPrice &&
                              <p className="price discount-price">{Math.round((+item.discountPrice) * 100) / 100} {window.currencyValue}</p>
                            }
                            <p className={item.discountPrice ? 'price old-price' : 'price'}>{Math.round((+item.price) * 100) / 100} {window.currencyValue}</p>
                        </div>
                        <span onClick={() => removeFromBasket(null, item.shortcode)}
                              className="removeFromBasket">
                                    </span>
                    </div>
                </div>
                <div className="wrapCriterias">
                    {!window.isMobile && <img src={item.colorImage || item.deviceImages.mainImg.src} alt=""/>}
                    <ul>
                        <li><b>Farbe:</b> <span><span className={item.colorCode && item.colorCode.toLowerCase() === "#ffffff" ? "colorPic whiteColor" : "colorPic"}  style={{backgroundColor: item.colorCode}}/> {item.color}</span></li>
                        <li><b>Allgemeiner Zustand:</b> {item.condition}</li>
                        {item.criterias.length && item.criterias.map(mapCriterias)}
                    </ul>
                </div>
            </div>)
        }
        return null
    }

    function mapCriterias(item, i) {
        const lastIndex = item.values.length - 1;
        if (item.id === 16) return null // if criteria is model's color, return null
        return (<li key={`mapCriterias-${i}`}>
            <b>{item.name}: </b>
            {item.values.map((itemValue, i) => <span
                key={`mapCriterias-value-${i}`}>
                    {item.id === 'color' && <span className={itemValue.colorCode && itemValue.colorCode.toLowerCase() === "#ffffff" ? "colorPic whiteColor" : "colorPic"}  style={{backgroundColor: itemValue.colorCode}}/> }
                    {itemValue.name}{i !== lastIndex ? ', ' : ''}
                </span>)}
        </li>)
    }

    const handleTitleClick = () => {
        setMobileAccordionIsClose(!mobileAccordionIsClose)
    }

    const priceInfo = () => {
        return (
            <div className="priceInfo">
                <div>
                    <div className="per-month-tab">
                        <div className="slide-toggle"
                                style={{left: `${positionSlide}%`}}>{month} <span>Monate</span>
                        </div>
                        {parseFloat(showLevel) >= 1 && (
                            <div className={`month-panel`} onClick={() => handleChangeMonth(3)}>
                                <div className="month-desc">
                                    3
                                </div>
                            </div>
                        )}
                        {parseFloat(showLevel) >= 2 && (
                            <div className={`month-panel`} onClick={() => handleChangeMonth(6)}>

                                <div className="month-desc">
                                    6
                                </div>
                            </div>
                        )}
                        {parseFloat(showLevel) >= 3 && (
                            <div className={`month-panel`} onClick={() => handleChangeMonth(12)}>
                                <div className="month-desc">
                                    12
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="cost">
                        <h4>{monthPrice} CHF</h4>
                        <span>x {month} Monate</span>
                        <p>Sie können diesen Betrag ganz einfach per Einzahlungschein oder Kreditkarte
                            bezahlen. <strong>Jetzt mit 0%-Zinszahlung!</strong></p>
                    </div>
                    <div className="or-panel">
                        <div className="vector-3">
                        </div>
                        <span className="or">
                                                oder
                                            </span>
                        <div className="vector-4">
                        </div>
                    </div>
                    <div className='flex-between'>
                        <div className="one-time-price">
                            <h3 className="title">
                                Sofort-Kaufen Preis
                            </h3>
                            <h3 className="description">
                                ohne Ratenzahlung
                            </h3>
                        </div>
                        <div>
                            <div className="price-wrap">
                                <p className={'price'}
                                    data-price-amount={totalPrice}>{Math.round((+totalPrice) * 100) / 100} {window.currencyValue}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const insuranceInfo = () => {
        return (
            <div>
                <div className="wrap">
                    <span className='garantie'>Garantie und Schtutz</span>
                    <div className="logos">
                        <span>Ein Angebot von</span>
                        <img src="/images/logo/remarket-care.jpg" alt=""/>
                    </div>
                    <div className="checkboxs">
                        <label>
                            <input type="checkbox" onChange={(e) => insuranceChAmountChange(e)}
                                    data-insuranceamount={60} checked={insuranceChAmount === 60 ? true : false}
                                    disabled={insurancePriceCh ? true : false}/>
                            <span className="check"/>
                            <div><p className="desc1">Einzelversicherung</p><p className="desc2">60.- pro
                                Kalenderjahr</p></div>
                            <div className="question-sign">
                                <div>
                                    <img src="/images/design/bi_question-circle.svg" alt=""/>
                                    <div className="info-icon-text">
                                      Bei der Einzelversicherung ist nur Ihr eigenes Gerät versichert
                                    </div>
                                </div>
                            </div>
                        </label>
                        <label>
                            <input type="checkbox" onChange={(e) => insuranceChAmountChange(e)}
                                    data-insuranceamount={120} checked={insuranceChAmount === 120 ? true : false}
                                    disabled={insurancePriceCh ? true : false}/>
                            <span className="check"/>
                            <div>
                                <p className="desc1">Familienversicherung</p>
                                <p className="desc2">120.- pro Kalenderjahr</p>
                            </div>
                            <div className="question-sign">
                                <div>
                                    <img src="/images/design/bi_question-circle.svg" alt=""/>
                                    <div className="info-icon-text">
                                        Hier sind alle Geräte von allen Personen im gleichen Haushalt versichert
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        )

    }
    const insuranceRow = () => {
        return (
            <div className="insurance-box-ch">
                {/*  we dont need this tab at the moment */}
                {false && (
                    <div className='basket-tabs-button'>
                        <ul className="offer-tab-buttons">
                            <li
                                className={activeTab === 'mieten' ? 'active' : ''}
                                data-type="mieten"
                                onClick={(e) => handleChangeTab(e)}
                            >
                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.7934 13.2039C17.5315 12.7672 17.0596 12.5 16.5504 12.5H16.4871C16.2493 12.5002 16.0152 12.5587 15.8052 12.6704L13.4998 13.9001V9.80009H14.5498C15.461 9.80009 16.1997 9.06139 16.1997 8.15012C16.1997 7.23884 15.461 6.50014 14.5498 6.50014H8.09986C7.27147 6.50014 6.59989 5.82857 6.59989 5.00017C6.59989 4.17177 7.27147 3.50019 8.09986 3.50019H9.14985L10.8598 5.78016C10.9165 5.85568 11.0054 5.90015 11.0998 5.90015H17.6997C17.8654 5.90015 17.9997 5.76583 17.9997 5.60016V0.800239C17.9997 0.634567 17.8654 0.500244 17.6997 0.500244H11.0998C11.0054 0.500244 10.9165 0.544718 10.8598 0.620242L9.14985 2.9002H8.09986C6.94008 2.9002 5.9999 3.84039 5.9999 5.00017C5.9999 6.15995 6.94008 7.10013 8.09986 7.10013H14.5498C15.1296 7.10013 15.5997 7.57023 15.5997 8.15012C15.5997 8.73001 15.1296 9.2001 14.5498 9.2001H13.4998V8.00012C13.4998 7.83445 13.3655 7.70012 13.1998 7.70012H4.79992C4.63425 7.70012 4.49993 7.83445 4.49993 8.00012V12.5C4.26732 12.5813 4.04187 12.6816 3.82584 12.8H0V13.4H3.59994V17.9H0V18.4999H11.3674C11.6394 18.4999 11.9062 18.426 12.1393 18.286L17.2959 15.1922C17.9823 14.7805 18.205 13.8903 17.7934 13.2039ZM11.7035 4.0487C12.1721 3.88302 12.4177 3.3688 12.252 2.9002C12.0863 2.43157 11.5721 2.18599 11.1035 2.3517C10.8472 2.4423 10.6456 2.64393 10.555 2.9002H9.89984L11.2498 1.10023H17.3997V5.30016H11.2498L9.89984 3.50019H10.555C10.7207 3.96882 11.2349 4.21441 11.7035 4.0487ZM11.0998 3.2002C11.0998 3.03453 11.2341 2.9002 11.3998 2.9002C11.5655 2.9002 11.6998 3.03453 11.6998 3.2002C11.6998 3.36587 11.5655 3.50019 11.3998 3.50019C11.2341 3.50019 11.0998 3.36587 11.0998 3.2002ZM8.39986 8.30011H9.59984V9.50009H8.39986V8.30011ZM5.09992 8.30011H7.79987V9.80009C7.79987 9.96576 7.93419 10.1001 8.09986 10.1001H9.89984C10.0655 10.1001 10.1998 9.96576 10.1998 9.80009V8.30011H12.8998V14.2199L12.4084 14.4818C12.5917 13.7591 12.1543 13.0247 11.4316 12.8414C11.3232 12.8139 11.2117 12.8 11.0998 12.8H8.17816C7.23869 12.2879 6.14881 12.1231 5.09992 12.3344V8.30011ZM16.9872 14.6777L11.8306 17.7716C11.6907 17.8556 11.5306 17.9 11.3674 17.9H4.19993V13.28C5.38401 12.6745 6.79335 12.7052 7.94987 13.3619C7.99565 13.3876 8.04737 13.4008 8.09986 13.4H11.0998C11.514 13.4 11.8498 13.7358 11.8498 14.15C11.8498 14.5642 11.514 14.9 11.0998 14.9H8.39986C8.23419 14.9 8.09986 15.0343 8.09986 15.2C8.09986 15.3657 8.23419 15.5 8.39986 15.5H11.6998C11.7491 15.5001 11.7976 15.488 11.8411 15.4649L16.0875 13.1999C16.2106 13.1345 16.3478 13.1001 16.4871 13.1H16.5504C17.0195 13.1 17.3997 13.4802 17.3998 13.9492C17.3998 14.2477 17.2432 14.5242 16.9872 14.6777Z" fill="#90A397"/>
                                </svg>
                                <span>Mieten</span>
                            </li>
                            <li
                                className={activeTab === 'kaufen' ? 'active' : ''}
                                data-type="kaufen"
                                onClick={(e) => handleChangeTab(e)}
                            >

                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_2431_799)">
                                        <path d="M12.6927 8.58057H9.85938C9.66519 8.58057 9.50781 8.73795 9.50781 8.93213C9.50781 9.12631 9.66519 9.28369 9.85938 9.28369H12.6927C12.8869 9.28369 13.0443 9.12631 13.0443 8.93213C13.0443 8.73795 12.8869 8.58057 12.6927 8.58057Z" fill="#02CA95"/>
                                        <path d="M12.692 9.98682H9.20703C9.01285 9.98682 8.85547 10.1442 8.85547 10.3384C8.85547 10.5326 9.01285 10.6899 9.20703 10.6899H12.692C12.8862 10.6899 13.0436 10.5326 13.0436 10.3384C13.0436 10.1442 12.8862 9.98682 12.692 9.98682Z" fill="#02CA95"/>
                                        <path d="M17.5134 10.6764C16.9688 10.1898 16.1415 10.1832 15.5892 10.6611L14.5547 11.5562V4.76682C14.5547 4.12 14.0284 3.59375 13.3816 3.59375H4.61837C3.97155 3.59375 3.4453 4.12 3.4453 4.76682V12.647C3.40438 12.6774 3.36401 12.7081 3.32418 12.74L0.132514 15.2836C-0.019372 15.4046 -0.0443659 15.6258 0.076621 15.7777C0.14611 15.8648 0.24842 15.9101 0.351829 15.9101C0.428596 15.9101 0.505912 15.8851 0.570731 15.8335L3.7624 13.2899C4.43929 12.7503 5.28881 12.4533 6.15426 12.4533H9.85487C10.2814 12.4533 10.6283 12.8002 10.6283 13.2267C10.6283 13.6531 10.2814 14.0001 9.85487 14.0001H7.48237C7.28832 14.0001 7.13081 14.1575 7.13081 14.3517C7.13081 14.5457 7.28832 14.7033 7.48237 14.7033H9.85487C9.8789 14.7033 9.90279 14.7026 9.92655 14.7015C9.93836 14.7026 9.95031 14.7033 9.96253 14.7033H10.5739C11.4884 14.7033 12.3728 14.3737 13.0644 13.7753L16.0492 11.1929C16.3352 10.9455 16.7632 10.949 17.0451 11.2008C17.2072 11.3456 17.2966 11.5451 17.2969 11.7625C17.2971 11.9799 17.208 12.1796 17.0461 12.3247L14.2064 14.8709C13.1134 15.8509 11.7032 16.3906 10.2351 16.3906H5.42738C5.33372 16.3906 5.24404 16.428 5.17799 16.4943L3.78052 17.9006C3.64361 18.0383 3.64429 18.2609 3.78204 18.3978C3.8507 18.4659 3.94024 18.5 4.02991 18.5C4.12028 18.5 4.21064 18.4654 4.2793 18.3962L5.57363 17.0938H10.2353C11.8766 17.0938 13.4537 16.4902 14.6758 15.3944L17.5155 12.8484C17.8238 12.5719 18.0004 12.1759 18 11.7619C17.9996 11.3479 17.8223 10.9523 17.5134 10.6764ZM10.2916 4.29688V5.94427L10.0701 5.72276C9.93287 5.58557 9.71026 5.58557 9.57293 5.72276L8.99999 6.2957L8.42706 5.72276C8.35839 5.65424 8.26844 5.61977 8.17849 5.61977C8.08854 5.61977 7.99845 5.65424 7.92992 5.72276L7.70841 5.94427V4.29688H10.2916ZM12.6042 13.2437C12.1858 13.6057 11.6805 13.8467 11.1432 13.9471C11.2629 13.7339 11.3314 13.4882 11.3314 13.2267C11.3314 12.4125 10.6691 11.7501 9.85487 11.7501H6.15426C5.45745 11.7501 4.76943 11.9131 4.14843 12.2182V4.76682C4.14843 4.50768 4.35923 4.29688 4.61837 4.29688H7.00529V6.79297C7.00529 6.93524 7.09098 7.06337 7.2224 7.11775C7.35355 7.17213 7.50489 7.1422 7.60542 7.04153L8.17849 6.4686L8.75143 7.04153C8.88876 7.17886 9.11123 7.17886 9.24856 7.04153L9.8215 6.4686L10.3946 7.04153C10.4617 7.10883 10.5517 7.14453 10.6431 7.14453C10.6885 7.14453 10.7342 7.13574 10.7776 7.11775C10.909 7.06337 10.9947 6.93524 10.9947 6.79297V4.29688H13.3816C13.6408 4.29688 13.8516 4.50768 13.8516 4.76682V12.1646L12.6042 13.2437Z" fill="#02CA95"/>
                                        <path d="M9 2.78516C9.19418 2.78516 9.35156 2.62778 9.35156 2.43359V0.851562C9.35156 0.657379 9.19418 0.5 9 0.5C8.80582 0.5 8.64844 0.657379 8.64844 0.851562V2.43359C8.64844 2.62778 8.80582 2.78516 9 2.78516Z" fill="#02CA95"/>
                                        <path d="M15.3633 9.14844C15.3633 9.34262 15.5207 9.5 15.7148 9.5H17.2969C17.4911 9.5 17.6484 9.34262 17.6484 9.14844C17.6484 8.95425 17.4911 8.79688 17.2969 8.79688H15.7148C15.5207 8.79688 15.3633 8.95425 15.3633 9.14844Z" fill="#02CA95"/>
                                        <path d="M0.703125 9.5H2.28516C2.47934 9.5 2.63672 9.34262 2.63672 9.14844C2.63672 8.95425 2.47934 8.79688 2.28516 8.79688H0.703125C0.509079 8.79688 0.351562 8.95425 0.351562 9.14844C0.351562 9.34262 0.508942 9.5 0.703125 9.5Z" fill="#02CA95"/>
                                        <path d="M2.88663 3.5338C2.9553 3.60233 3.04525 3.6368 3.13533 3.6368C3.22528 3.6368 3.31523 3.60233 3.3839 3.5338C3.52109 3.39647 3.52109 3.17386 3.3839 3.03653L2.00251 1.65514C1.86518 1.51795 1.6427 1.51795 1.50524 1.65514C1.36805 1.79247 1.36805 2.01508 1.50524 2.15241L2.88663 3.5338Z" fill="#02CA95"/>
                                        <path d="M14.8632 3.6368C14.9533 3.6368 15.0432 3.60233 15.1119 3.5338L16.4933 2.15241C16.6305 2.01508 16.6305 1.79247 16.4933 1.65514C16.3559 1.51795 16.1333 1.51795 15.996 1.65514L14.6146 3.03653C14.4774 3.17386 14.4774 3.39647 14.6146 3.5338C14.6833 3.60233 14.7732 3.6368 14.8632 3.6368Z" fill="#02CA95"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2431_799">
                                            <rect width="18" height="18" fill="white" transform="translate(0 0.5)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                Kaufen
                            </li>
                        </ul>
                    </div>
                )}
                {priceInfo()}
                {insuranceInfo()}
            </div>
        )
    }

    const couponNoteRow = () => {
        return (
            <div className='couponNote'>
                <div className="couponField">
                    <div className="couponNoteLabel">
                        <img src="/images/design/gift.svg"/>
                        <label>Gutschein-Code eingeben</label>
                    </div>
                    <div className="couponNoteInput">
                        <input type="text"
                                className={ couponError ? 'errorInput' : ''}
                                name="coupon"
                                id="input_coupon"
                                placeholder="Code eingeben"/>
                        <button type="button"  className="couponButton btn" onClick={triggerChangeCoupon}>
                            einlösen
                        </button>
                    </div>
                    { couponError && <span className="errorText">{couponError}</span> }
                </div>
                <div className="commentField">
                    <div className="couponNoteLabel">
                        <img src="/images/design/medical.svg"/>
                        <label>Notizen</label>
                    </div>
                    <textarea name="comment" rows="2" placeholder="Notiz eingeben" style={{marginTop: '13px'}}/>
                </div>
            </div>
        )
    }

    return (
        <div className="col-md-5 mobile-product-wrap">
            <div className="productWrap">
                {!window.isMobile && (
                    <h3 className="title" onClick={handleTitleClick}>
                        {`Bestellübersicht  `}
                        {mobileAccordionIsClose ? (
                            <i className="fa fa-angle-right" aria-hidden="true"/>
                        ) : (
                            <i className="fa fa-angle-down" aria-hidden="true"/>
                        )}
                    </h3>
                )}
                {window.isMobile && (
                    <div className="title forMobile" onClick={handleTitleClick}>
                        <div className='titleArea'>
                            <p className='overview'>
                                {`Bestellübersicht`}
                            </p>
                            <p className='description'>
                                {basketTitle}
                            </p>
                        </div>
                        {mobileAccordionIsClose ? (
                            <div className='priceArea'>
                                <span>
                                    {`${totalPrice} CHF `}
                                </span>
                                <i className="fa fa-angle-right" aria-hidden="true"/>
                            </div>
                        ) : (
                            <div className='priceArea'>
                                <span>
                                    {`${totalPrice} CHF `}
                                </span>
                                <i className="fa fa-angle-down" aria-hidden="true"/>
                            </div>
                        )}
                    </div>
                )}
                {!window.isMobile && (
                    <div>
                        <div className={`basket-table ${mobileAccordionIsClose ? 'mobileAccordionIsClose' : ''}`}>
                            {uniqueBasketData.map(mapBasketData)}
                            {insuranceRow()}
                        </div>
                        {couponNoteRow()}
                    </div>
                )}
                {window.isMobile && !mobileAccordionIsClose && (
                    <OverviewModal onClose={handleTitleClick}>
                        <div className={`basket-table ${mobileAccordionIsClose ? 'mobileAccordionIsClose' : ''}`}>
                            {uniqueBasketData.map(mapBasketData)}
                            {insuranceRow()}
                            {couponNoteRow()}
                        </div>
                    </OverviewModal>
                )}                
            </div>            
        </div>

    )
}

ProductOverview.propTypes = {}
ProductOverview.defaultProps = {}

export default ProductOverview