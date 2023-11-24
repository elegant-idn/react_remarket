import React, { Component } from 'react'
import { SimpleImg } from 'react-simple-img'
import { Link } from 'react-router'
import { connect } from "react-redux";
import * as shopActions from "../../actions/shop";
import { bindActionCreators } from "redux";
import * as placesActions from "../../actions/places";
import { seoReadMoreClick } from '../seoText/seoText';

const FOOTER_SEO_CH =
  <React.Fragment>
    <div>
          <h1>iPhone, Samsung Galaxy, iPad, MacBook gebraucht kaufen und verkaufen per Knopfdruck.</h1>
          <p>Viele elektronische Geräte wie <strong>Handys, Smartphones, Tablets oder Computer</strong> werden bereits nach kurzer Zeit der Nutzung durch neue Geräte ersetzt. Nicht selten landen die alten Geräte beim lokalen Entsorgungsbetrieb oder einfach in der Schublade oder im Schrank, sofern es sich um kleine Geräte wie beispielsweise <strong>Smartphones</strong> handelt. Dabei ist auch gebrauchte Elektronik noch sehr gefragt. Geräte wie das <strong>iPhone, iPad, ein Samsung Galaxy sowie tragbare Computer und Desktopcomputer</strong> können durchaus noch einiges an Geld bringen, wenn sie über Shops wie unserem angeboten und verkauft werden. Viele Menschen können sich neue Geräte namhafter Hersteller nicht leisten und greifen deshalb auf <strong>gebrauchte Geräte</strong> zurück. Anstatt nun eventuell defekte Geräte von Privatleuten ohne Garantie oder Sicherheit zu kaufen, sollten Sie gebrauchte und geprüfte <strong>Computer, Smartphones oder Tablets gebraucht und geprüft kaufen</strong>, die in zahlreichen Ausführungen auf unserer Homepage erhältlich sind. Die Geräte werden zu deutlich günstigeren Preisen als den ehemaligen Neupreisen angeboten, so dass sich noch jede Menge Geld sparen lässt.</p>
          <h2>Verkaufen Sie Ihre Elektronik, wenn Sie neue Geräte gekauft haben</h2>
          <p>Anstatt Ihr nicht mehr benötigtes Smartphone, Tablet oder ein Notebook im Schrank einstauben zu lassen, bieten Sie es doch einfach über unseren <strong>Onlineshop</strong> zum Verkauf an. Es funktioniert ganz einfach. Sie wählen einfach den entsprechenden Gerätetyp wie beispielsweise Ihr <strong>iPhone, MacBook oder den Apple Mac mini</strong> aus und machen weitere Angaben zu den Ausstattungsmerkmalen und den Zustand des Gerätes. Innerhalb weniger Minuten und mit nur <strong>wenigen Klicks</strong> ist der aktuelle Preis für das von Ihnen angebotene Gerät ermittelt. Sie wissen also sofort, was Sie bekommen. Einfacher geht es nicht. Der Versand ist auch unkompliziert, da Sie die Kosten dafür ersetzt bekommen. Wurde das Gerät durch uns überprüft, erhalten Sie Ihr <strong>Geld innerhalb kürzester Zeit</strong> ohne weitere Abzüge.</p>
          <h2>Möchten Sie ein gebrauchtes Smartphone oder Notebook kaufen?</h2>
          <p>Wenn Sie auf der Suche nach einem preisgünstigen <strong>iPhone, iPad, Samsung Galaxy</strong> oder einem anderen Mac-Computer sind, sollten Sie sich in unserem Onlineangebot umschauen. Sie bekommen zahlreiche Geräte namhafter Hersteller <strong>günstig gebraucht und geprüft</strong>. Falls doch etwas nicht in Ordnung sein sollte, nutzen Sie einfach die einjährige <strong>Garantie</strong>, die wir auf die Geräte aus unserem Angebot geben. Die Geräte werden <strong>versandkostenfrei</strong> an Sie geliefert.</p>
      </div>
  </React.Fragment>

export class Footer extends Component {
  constructor(props) {
    super(props);
  }

  globalClick = e => {
    if (e.target.tagName.toLowerCase() === 'a') {
      this.props.shopActions.definedCounerForSearchInput(' ')
    }
  }

  render() {
    const data = JSON.parse(window.localStorage.getItem("locationData"))
    const active = {};
    if (data) {
      active.place = data.data.find(item => item.active === true)
      if (active.place == null) {
        active.place = data.data[0];
      }
    }
    const currentPlace = this.props.places
    let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]
    return (
      <footer id="footer" onClick={this.globalClick}>
        <div className="container-fluid">
          <div className="row">

            <div className="col-xs-12 col-sm-5 col-lg-3">
              <div className="address">
                <img src={domain === 'ch' ? "/images/design/logo_all_pages.svg" : "/images/design/logo_all_pages.svg"} alt="" width="160" />
              </div>
            </div>
            <div className="col-xs-6 col-sm-4 col-lg-2">
              <ul>
                <li className="head">Schnellübersicht</li>
                <li><Link to="/verkaufen">Verkaufen</Link></li>
                <li><Link to="/kaufen">Kaufen</Link></li>
                <li><Link to="/firmenkunden">Firmenkunden</Link></li>
              </ul>
            </div>
            <div className="col-xs-6 col-sm-3 col-lg-2 text-left">
              <ul>
                <li className="head">Weiteres</li>
                <li><Link to="/kontakt">Kontakt</Link></li>
                <li><Link to="/ueber-uns/agb/">AGB</Link></li>
                <li><Link to="/ueber-uns/widerrufsbelehrung/">Widerrufsbelehrung</Link></li>
                <li><Link to="/ueber-uns/datenschutzerklaerung/">Datenschutzerklärung</Link></li>
                <li><Link to="/ueber-uns/impressum/">Impressum</Link></li>
              </ul>
            </div>
            <div className='col-xs-6 col-sm-4 col-lg-3'>
              <div className="numPhone">
                <img src="/images/design/guy-banner.svg" alt="" />
                <span><a href="tel:+41615112244">061 511 22 44</a></span></div>
                {currentPlace ?
                  <p className="location">
                    <img src="/images/design/location.svg" />
                    {currentPlace.descriptionBranch}<br />
                    {currentPlace.address}<br />
                    {currentPlace.zip + ' ' + currentPlace.city}
                  </p> :
                  active.place ?
                    <p className="location">
                      <img src="/images/design/location.svg" />
                      {active.place.descriptionBranch}<br />
                      {active.place.address}<br />
                      {active.place.zip + ' ' + active.place.city}
                    </p>
                    :
                    ''
                }
            </div>
            <div className="col-xs-6 col-sm-4 col-lg-2 proven-text">
              <div className="right-part">
                {domain === 'ch' &&
                  <div className="provenexpert">
                    <a href="https://www.provenexpert.com/de-de/ireparatur-ch-remarket-ch/?utm_source=Widget&utm_medium=Widget&utm_campaign=Widget"
                      title="Erfahrungen & Bewertungen zu remarket.ch anzeigen" rel="noopener" target="_blank"
                      style={{ textDecoration: 'none' }}>
                      <SimpleImg src="https://images.provenexpert.com/cb/31/0208e362264a28e99cc49dcc8520/widget_portrait_200_de_1.png"
                        srcSet=""
                        // wrapperClassName="clearSimpleImgWrapper"
                        alt="Erfahrungen & Bewertungen zu remarket.ch"
                        width="200"
                        height="240" />
                    </a>
                  </div>
                }
                {domain === 'de' &&
                  <div className="provenexpert">
                    <a href="https://www.provenexpert.com/remarket-de-recommerce-gmbh/?utm_source=Widget&utm_medium=Widget&utm_campaign=Widget"
                      title="Erfahrungen & Bewertungen zu remarket.de anzeigen"
                      rel="noopener"
                      target="_blank" style={{ textDecoration: 'none' }}>
                      <SimpleImg src="https://images.provenexpert.com/e1/69/ef4bafa499aa5b40ff5dbff9b780/widget_portrait_200_de_1.png"
                        srcSet=""
                        alt="Erfahrungen & Bewertungen zu remarket.de Recommerce GmbH"
                        width="200"
                        height="240"
                        style={{ border: 0 }} />
                    </a>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="footerBottom">
          <div className="container-fluid">
            {!window.isMobile &&  <div className="row">
              <div className="col-sm-6 col-sm-push-6 text-right">
                <ul>
                  <li><img src="/images/design/visa.svg" alt="" /></li>
                  <li><img src="/images/design/mastercard.svg" alt="" /></li>
                  <li><img src="/images/design/paypal.svg" alt="" /></li>

                  {domain !== 'de' && <li><img src="/images/design/postfinance.svg" alt="" /></li>}
                  {domain !== 'de' && <li><img src="/images/design/twint.svg" alt="" /></li>}
                  <li><img src="/images/design/byjuno.svg" alt="" /></li>
                  {domain !== 'ch' && <li><img src="/images/design/stripe.svg" alt="" /></li>}
                </ul>
              </div>
              <div className="col-sm-6 col-sm-pull-6 text-left">
                <p className="initial-text">Alle Rechte vorbehalten. Copyright by <Link to="/">{domain === 'ch' ? "remarket.ch" : "remarket.de"}</Link></p>
              </div>
              <div className="col-sm-12">
                <div className="seo-wrap">
                  <div className="seo">{FOOTER_SEO_CH}</div>
                  <button className="read-more-button" onClick={seoReadMoreClick} />
                </div>
              </div>
            </div>}
            {window.isMobile &&  <div className="row">
            <hr color='#D5DDE0'></hr>
            <div className="col-sm-6 col-sm-pull-6 d-flex justify-content-center" style={{justifyContent: 'center', display: 'flex'}}>
                <p className="initial-text">Alle Rechte vorbehalten. Copyright by <Link to="/">{domain === 'ch' ? "remarket.ch" : "remarket.de"}</Link></p>
              </div>
              <div className="col-sm-6 col-sm-push-6" style={{justifyContent: 'center', display: 'flex'}}>
                <ul>
                  <li><img src="/images/design/visa.svg" alt="" /></li>
                  <li><img src="/images/design/mastercard.svg" alt="" /></li>
                  <li><img src="/images/design/paypal.svg" alt="" /></li>

                  {domain !== 'de' && <li><img src="/images/design/postfinance.svg" alt="" /></li>}
                  {domain !== 'de' && <li><img src="/images/design/twint.svg" alt="" /></li>}
                  <li><img src="/images/design/byjuno.svg" alt="" /></li>
                  {domain !== 'ch' && <li><img src="/images/design/stripe.svg" alt="" /></li>}
                </ul>
              </div>
              <div className="col-sm-12">
                <div className="seo-wrap">
                  <div className="seo">{FOOTER_SEO_CH}</div>
                  <button className="read-more-button" onClick={seoReadMoreClick} />
                </div>
              </div>
            </div>}

          </div>
        </div>
      </footer>
    )
  }
}
function mapStateToProps(state) {
  return {
    places: state.places.currentLocation,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    shopActions: bindActionCreators(shopActions, dispatch),
    placesActions: bindActionCreators(placesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)