import React, { Component } from 'react'

import CustomerAboutUs from '../mainPage/customerAboutUs'
import Banner from '../mainPage/banner'
import Numbers from '../mainPage/numbers'

class RepairPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    componentDidMount(){
        $('button.repairNow').on('click', () => $("html, body").animate({ scrollTop: $('.select-device').offset().top - 130 }, 600))
    }

    render() {
        return (
            <div className="repair-page">
                <section className="top">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-5">
                                <p className="title">Smartphone & Tablet</p>
                                <p className="title">Express Reparatur</p>
                                <p className="text">Wir reparieren Ihr Apple iPhone, Apple iPad und Samsung Galaxy in Basel Express oder senden Sie uns Ihr defektes Gerät kostenlos per Post zu.</p>
                                <ul>
                                    <li><span className="check-icon"/>Ohne Datenverlust</li>
                                    <li><span className="check-icon"/>Verwendung von originalen Ersatzteile</li>
                                    <li><span className="check-icon"/>Ohne Terminvereinbarung</li>
                                    <li><span className="check-icon"/>1 Jahr Garantie auf die Arbeit und Ersatzteile</li>
                                </ul>
                                <button className="btn repairNow">
                                    Jetzt reparieren
                                    <span><i className="fa fa-long-arrow-right" aria-hidden="true"/></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="phone">
                        <img src="/images/design/devices_repair.png"/>
                    </div>
                    <div className="bigTriangle">
                        <img src="/images/design/company-triangle.svg" alt=""/>
                    </div>
                    <img className="grayTriangle" src="/images/design/company-triangle-gray.svg" alt=""/>
                </section>
                {this.props.children}
                <section className="why-we-different">
                    <img src="/images/design/repair_different_bg.png" className="image-phone" alt=""/>
                    <img src="/images/design/repair_different_bg_rect.svg" className="image-rect" alt=""/>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <p className="category">Ihre Vorteile</p>
                                <p className="title"><span>warum wir anderst<br/> sind</span></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-7">
                                <div className="row wrap-items">
                                    <div className="col-sm-6 item-why">
                                        <div className="image">
                                            <img src="/images/design/time-icon.svg" alt=""/>
                                            <img src="/images/design/time-icon-white.svg" alt=""/>
                                        </div>
                                        <h4>Die schnelle iPhone Reparatur in Basel</h4>
                                        <p>In unserem Repair-Center in Basel reparieren wir Ihr iPhone auch ohne Termin in kürzester Zeit fachgerecht und kostengünstig mit Originalteilen. Nutzen Sie unsere professionelle Express Reparatur und profitieren Sie von unserem Expertenwissen zu allen iPhone Modellen. Ein Jahr Garantie auf alle Leistungen sowie eine schnelle und unkomplizierte Abwicklung unterstreichen unsere hochwertige Arbeit.</p>
                                        <p className="arrow"><i className="fa fa-long-arrow-right" aria-hidden="true"/></p>
                                    </div>
                                    <div className="col-sm-6 item-why">
                                        <div className="image">
                                            <img src="/images/design/time-icon.svg" alt=""/>
                                            <img src="/images/design/time-icon-white.svg" alt=""/>
                                        </div>
                                        <h4>Ihre Vorteile bei remarket.ch</h4>
                                        <p>Ob Firmenkunde oder Privatkunde – bei remarket.ch profitieren Sie von einer schnellen, unkomplizierten und fachgerechten Abwicklung. Auch ohne Terminvereinbarung helfen wir Ihnen in unserer Klinik für Smartphones in kürzester Zeit weiter. Bei allen Reparaturarbeiten legen wir grössten Wert darauf, dass alle Daten Ihrer Geräte erhalten bleiben.</p>
                                        <p className="arrow"><i className="fa fa-long-arrow-right" aria-hidden="true"/></p>
                                    </div>
                                    <div className="col-sm-6 item-why">
                                        <div className="image">
                                            <img src="/images/design/time-icon.svg" alt=""/>
                                            <img src="/images/design/time-icon-white.svg" alt=""/>
                                        </div>
                                        <h4>Attraktive Vorteile für Firmenkunden</h4>
                                        <p>Firmenkunden profitieren bei remarket.ch nicht nur von fachgerechten Reparaturen, sondern auch von einer schnellen und anwenderfreundlichen Abwicklung. In Ihrem Kundenkonto können Sie jederzeit alle aktuellen Reparaturen einsehen und nachverfolgen. Darüber hinaus können Sie bei uns bequem per Rechnung zahlen und müssen nicht in Vorkasse gehen.</p>
                                        <p className="arrow"><i className="fa fa-long-arrow-right" aria-hidden="true"/></p>
                                    </div>
                                    <div className="col-sm-6 item-why">
                                        <div className="image">
                                            <img src="/images/design/time-icon.svg" alt=""/>
                                            <img src="/images/design/time-icon-white.svg" alt=""/>
                                        </div>
                                        <h4>Ihr Spezialist bei Wasserschäden</h4>
                                        <p>Wasserschäden am Smartphone oder Tablet sind besonders ärgerlich. Die Experten von remarket.ch kennen sich dank jahrelanger Erfahrung mit Wasserschäden aus und retten Ihre Daten fachgerecht und zügig, wenn das Gerät mit Wasser in Berührung gekommen ist. Darüber hinaus erstellen wir gerne professionelle Versicherungsgutachten für Ihren Wasserschaden.</p>
                                        <p className="arrow"><i className="fa fa-long-arrow-right" aria-hidden="true"/></p>
                                    </div>
                                    <div className="col-sm-6 item-why">
                                        <div className="image">
                                            <img src="/images/design/time-icon.svg" alt=""/>
                                            <img src="/images/design/time-icon-white.svg" alt=""/>
                                        </div>
                                        <h4>Wir helfen bei Batterieproblemen</h4>
                                        <p>Die Batterie gehört leider immer noch zu den Schwachstellen von Smartphones und Tablets. Bei remarket.ch haben wir uns daher darauf spezialisiert, Batterien schnell, fachgerecht und kostengünstig auszutauschen. Wir prüfen die aktuelle Kapazität Ihrer Batterie kostenlos und beraten Sie kompetent zu möglichen Lösungen.</p>
                                        <p className="arrow"><i className="fa fa-long-arrow-right" aria-hidden="true"/></p>
                                    </div>
                                    <div className="col-sm-6 item-why">
                                        <div className="image">
                                            <img src="/images/design/time-icon.svg" alt=""/>
                                            <img src="/images/design/time-icon-white.svg" alt=""/>
                                        </div>
                                        <h4>Smartphone-, Tablet- und Macbook-Zubehör</h4>
                                        <p>Bei remarket.ch führen wir ein grosses Sortiment an technisch hochwertigem Zubehör für Smartphones, Tablets und Macbooks. Wir haben nicht nur mehr als 30.000 Etuis auf Lager, sondern bieten auch Kabel und Kopfhörer sowie Schutzhüllen für das iPhone und Taschen für Macbooks an.</p>
                                        <p className="arrow"><i className="fa fa-long-arrow-right" aria-hidden="true"/></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container">
                    <CustomerAboutUs/>
                </div>
                <div className="container banner-area">
                    <Banner/>
                </div>
                <Numbers/>
            </div>
        )
    }
}

export default RepairPage