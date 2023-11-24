import React from 'react'
import Slider from 'react-slick'

function InviteFriend (){
    function mapPeriods(){
        let periodsArray = [
            <div className="col-sm-4 text-center itemPeriod" key="1">
                <div className="image">
                    <div className="num"><img src="images/design/1_green.svg" alt=""/></div>
                    <img src="images/design/invite_friends_how_it_works-1.svg" alt=""/>
                </div>
                <h4>Preis berechnen</h4>
                <p>Ihr/e Freund/In wählt den Zustand des Gerätes aus und Sie erhaltet direkt einen fairen Ankaufspreis.</p>
            </div>,
            <div className="col-sm-4 text-center itemPeriod" key="2">
                <div className="image">
                    <div className="num"><img src="images/design/2.svg" alt=""/></div>
                    <img src="images/design/invite_friends_how_it_works-2.svg" alt=""/>
                </div>
                <h4>Preis berechnen</h4>
                <p>Wählen Sie den Zustand Ihres Gerätes aus und Sie erhalten direkt einen fairen Ankaufspreis.</p>
            </div>,
            <div className="col-sm-4 text-center itemPeriod" key="3">
                <div className="image">
                    <div className="num"><img src="images/design/3.svg" alt=""/></div>
                    <img src="images/design/get-icon.svg" alt=""/>
                </div>
                <h4>Zahlung erhalten</h4>
                <p>Nach Prüfung Ihres Gerätes wird der Betrag <strong>Express</strong> ausbezahlt.</p>
            </div>
        ]
        let settings = {
            dots: true,
            arrows: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        }
        if(!window.isMobile){
            return(
                <div>
                    {periodsArray.map( item => item)}
                </div>
            )
        }
        else{
            return(
                <Slider {...settings}>
                    {periodsArray.map( item => item)}
                </Slider>
            )
        }
    }
    return (
        <div className="invite-friend">
            <section className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-5">
                            <p className="title">An Freunde weiterempfehlen</p>
                            <p className="description">Laden Sie Ihre Freunde zu remarket ein und erhalten Sie bei jedem Verkauf / Einkauf 20.00 CHF Extra!</p>
                            <button className="btn registerNow">
                                Jetzt registrieren
                                <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                            </button>
                        </div>
                    </div>
                </div>
                <img src="/images/design/invite_friend_bg.png" className="img-bg" alt=""/>
            </section>
            <section className="how-it-works">
                <h2 className="title">So funktioniert es</h2>
                <div className="container">
                    <div className="wrap-periods">
                        <div className="col-sm-11">
                            <div className="row">
                                {mapPeriods()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default InviteFriend