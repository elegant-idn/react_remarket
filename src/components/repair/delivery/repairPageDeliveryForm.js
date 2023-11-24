import React, { Component } from 'react'
import DeliveryByPost from './deliveryByPost'
import DeliveryByBicycle from './deliveryByBicycle'
import BookAnAppointment from './bookAnAppointment'

class RepairPageDeliveryForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeNavItem: ''
        }

        this.clickNavItem = this.clickNavItem.bind(this)
        this.mapNotice = this.mapNotice.bind(this)
    }
    componentDidMount(){
        $("html, body").animate({ scrollTop: $('.select-device.repair-list-part').offset().top - 90 }, 600)
    }
    componentWillMount(){
        window.recaptchaOptions = { lang: 'de' }
    }
    componentWillReceiveProps(nextProps){

    }

    clickNavItem(e){
        let activeNavItem = e.currentTarget.getAttribute('data-type')
        this.setState({ activeNavItem })
    }
    mapNotice(item){
        if(item.notice){
            return(
                <li key={item.shortcode}>{item.notice}</li>
            )
        }
    }
    render() {
        let { activeNavItem } = this.state,
            { totalPrice, selectedRepairOptions, model, basketActions, totalTime } = this.props,
            showNoticeBlock = selectedRepairOptions.some( item => item.notice)
        return (
            <div className="delivery-form animated fadeIn">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <p className="title">Wie wollen Sie die Reparatur durchführen lassen?</p>
                                <div className="navigation">
                                    <div className={activeNavItem === 'book' ? 'item-navigation active' : 'item-navigation'}
                                         data-type="book"
                                         onClick={this.clickNavItem}>
                                        <div className="image">
                                            <img src="/images/design/repair-delivery-nav-icon-1.png" alt=""/>
                                            <img src="/images/design/repair-delivery-nav-icon-1-active.png" alt=""/>
                                        </div>
                                        <p className="title">Termin buchen</p>
                                        <p className="descr">Ladenlokal besuchen</p>
                                    </div>
                                    <div className={activeNavItem === 'bicycle' ? 'item-navigation active' : 'item-navigation'}
                                         data-type="bicycle"
                                         onClick={this.clickNavItem}>
                                        <div className="image">
                                            <img src="/images/design/repair-delivery-nav-icon-2.png" alt=""/>
                                            <img src="/images/design/repair-delivery-nav-icon-2-active.png" alt=""/>
                                        </div>
                                        <p className="title">Per Velokurier</p>
                                        <p className="descr">Dauer Versand: ca. 2 Stunden (hin- und zurück)</p>
                                    </div>
                                    <div className={activeNavItem === 'post' ? 'item-navigation active' : 'item-navigation'}
                                         data-type="post"
                                         onClick={this.clickNavItem}>
                                        <div className="image">
                                            <img src="/images/design/repair-delivery-nav-icon-3.png" alt=""/>
                                            <img src="/images/design/repair-delivery-nav-icon-3-active.png" alt=""/>
                                        </div>
                                        <p className="title">Per Postversand</p>
                                        <p className="descr">Dauer Versand: ca. 2-3 Tage</p>
                                    </div>
                                    <div className={activeNavItem === 'recommend' ? 'item-navigation active' : 'item-navigation'}
                                         data-type="recommend"
                                         onClick={this.clickNavItem}>
                                        <div className="image">
                                            <img src="/images/design/repair-delivery-nav-icon-4.png" alt=""/>
                                            <img src="/images/design/repair-delivery-nav-icon-4-active.png" alt=""/>
                                        </div>
                                        <p className="title">Freund empfehlen</p>
                                        <p className="descr">E-Mail, Whatsapp, etc.</p>
                                    </div>
                                </div>
                        </div>
                    </div>
                    { activeNavItem === 'post' && <DeliveryByPost totalPrice={totalPrice}
                                                                  model={model}/> }
                    { activeNavItem === 'bicycle' && <DeliveryByBicycle totalPrice={totalPrice}
                                                                        model={model}/> }
                    { activeNavItem === 'book' && <BookAnAppointment model={model}
                                                                     totalTime={totalTime}
                                                                     basketActions={basketActions}
                                                                     selectedRepairOptions={selectedRepairOptions}
                                                                     totalPrice={totalPrice}/>
                    }
                    {showNoticeBlock &&
                        <div className="row">
                            <div className="col-md-12">
                                <div className="notice-block">
                                    <p className="head-title">
                                        <img src="/images/design/warning.png" alt=""/>
                                        <b>Wichtiger Hinweis:</b> Bei Ihrer Reparatur gibt es folgendes zu beachten:</p>
                                    <ul>
                                        {selectedRepairOptions.map(this.mapNotice)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default RepairPageDeliveryForm