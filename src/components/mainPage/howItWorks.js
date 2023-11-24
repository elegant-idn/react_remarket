import React from 'react'
import { SimpleImg } from 'react-simple-img'
import Slider from 'react-slick'

const HowItWorks = () => {
  let url = window.domainName.name === 'remarket.ch' ? 'https://www.youtube.com/embed/JfIWohNjpjk?autoplay=true' : 'https://www.youtube.com/embed/PH7pguELBlg?autoplay=true',
    url2 = window.domainName.name === 'remarket.ch' ? 'https://www.youtube.com/embed/JfIWohNjpjk?autoplay=true&amp;rel=0&amp;showinfo=0' : 'https://www.youtube.com/embed/PH7pguELBlg?autoplay=true&amp;rel=0&amp;showinfo=0';

  function mapPeriodsVerkaufen() {
    if (!window.isMobile) {
      return (
        <React.Fragment>
          <div className="col-sm-6 col-md-3 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/1.svg" alt="" /></div>
              <img src="images/design/estimate-icon.svg" alt="" />
            </div>
            <h4>Preis berechnen</h4>
            <p>Wählen Sie den Zustand Ihres Gerätes aus und Sie erhalten direkt einen fairen Ankaufspreis.</p>
          </div>
          <div className="col-sm-6 col-md-3 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/2.svg" alt="" /></div>
              <img src="images/design/send-icon.svg" alt="" />
            </div>
            <h4>Gerät einsenden</h4>
            <p>Senden Sie Ihr Gerät <strong>kostenlos</strong> mit dem vorfrankierten Versandlabel per Post zu.</p>
          </div>
          <div className="col-sm-6 col-md-3 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/3.svg" alt="" /></div>
              <img src="images/design/get-icon.svg" alt="" />
            </div>
            <h4>Zahlung erhalten</h4>
            <p>Nach Prüfung Ihres Gerätes wird der Betrag Express ausbezahlt.</p>
          </div>
          <div className='col-sm-6 col-md-3 itemPeriod'>
            <div className="mac-right">
              <a className="lightBoxVideoLink" aria-label="macbook-upd" href={url2} style={{ display: 'block', position: 'relative' }}>
                <span className="pulse-btn-on-mac"><span className="content" /></span>
                <SimpleImg src="/images/design/video-image.jpg" className="image-section" width="100%" style={{justifyContent: 'end'}}/>
              </a>
            </div>
          </div>
        </React.Fragment>
      )
    }
    else {
      return (
        <React.Fragment>
          <div className="col-sm-12 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/1.svg" alt="" /></div>
              <img src="images/design/estimate-icon.svg" alt="" />
            </div>
            <h4>Preis berechnen</h4>
            <p>Wählen Sie den Zustand Ihres Gerätes aus und Sie erhalten direkt einen fairen Ankaufspreis.</p>
          </div>
          <div className="col-sm-12 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/2.svg" alt="" /></div>
              <img src="images/design/send-icon.svg" alt="" />
            </div>
            <h4>Gerät einsenden</h4>
            <p>Senden Sie Ihr Gerät <strong>kostenlos</strong> mit dem vorfrankierten Versandlabel per Post zu.</p>
          </div>
          <div className="col-sm-12 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/3.svg" alt="" /></div>
              <img src="images/design/get-icon.svg" alt="" />
            </div>
            <h4>Zahlung erhalten</h4>
            <p>Nach Prüfung Ihres Gerätes wird der Betrag Express ausbezahlt.</p>
          </div>
          <div className='col-sm-12 itemPeriod'>
            <div className="mac">
              <a className="lightBoxVideoLink" href={url} aria-label="macbook-upd">
                <span className="pulse-btn-on-mac">
                  <span className="content" />
                </span>
                <SimpleImg alt="macbook-upd" src="/images/design/video-image.jpg" height="350px" width="100%" />
              </a>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  function mapPeriodsKaufen() {
    if (!window.isMobile) {
      return (
        <React.Fragment>
          <div className="col-sm-6 col-md-3 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/1.svg" alt="" /></div>
              <img src="images/design/estimate-icon.svg" alt="" />
            </div>
            <h4>Gerät Auswählen</h4>
            <p>Wählen Sie aus unserem  vielseitigen Angebot ein Gerät, welches Ihren Wünschen entspricht und zahlen Sie einen Top Preis</p>
          </div>
          <div className="col-sm-6 col-md-3 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/2.svg" alt="" /></div>
              <img src="images/design/shipment.svg" alt="" />
            </div>
            <h4>Versand</h4>
            <p>Alle Geräte sind auf Lager und werden in kürzester Zeit direkt zu Ihnen nach Hause versendet</p>
          </div>
          <div className="col-sm-6 col-md-3 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/3.svg" alt="" /></div>
              <img src="images/design/warranty.svg" alt="" />
            </div>
            <h4>Garantie</h4>
            <p>Remarket bietet mindestens 1 Jahr Garantie, sowie ein 14-tägiges Rückgaberecht auf alle erworbenen Geräte</p>
          </div>
          <div className='col-sm-6 col-md-3 itemPeriod'>
              <div className="mac-right">
                <a className="lightBoxVideoLink" aria-label="macbook-upd" href={url2} style={{ display: 'block', position: 'relative' }}>
                  <span className="pulse-btn-on-mac">
                    <span className="content" />
                  </span>
                  <SimpleImg src="/images/design/video-image.jpg" className="image-section" style={{justifyContent: 'end'}} />
                </a>
              </div>
          </div>
        </React.Fragment>
      )
    }
    else {
      return (
        <React.Fragment>
          <div className="col-sm-12 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/1.svg" alt="" /></div>
              <img src="images/design/estimate-icon.svg" alt="" />
            </div>
            <h4>Gerät Auswählen</h4>
            <p>Wählen Sie aus unserem  vielseitigen Angebot ein Gerät, welches Ihren Wünschen entspricht und zahlen Sie einen Top Preis</p>
          </div>
          <div className="col-sm-12 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/2.svg" alt="" /></div>
              <img src="images/design/shipment.svg" alt="" />
            </div>
            <h4>Versand</h4>
            <p>Alle Geräte sind auf Lager und werden in kürzester Zeit direkt zu Ihnen nach Hause versendet</p>
          </div>
          <div className="col-sm-12 itemPeriod">
            <div className="image">
              <div className="num"><img src="images/design/3.svg" alt="" /></div>
              <img src="images/design/warranty.svg" alt="" />
            </div>
            <h4>Garantie</h4>
            <p>Remarket bietet mindestens 1 Jahr Garantie, sowie ein 14 Tägiges Rückgaberecht auf alle erworbenen Geräte</p>
          </div>
          <div className='col-sm-12 itemPeriod'>
            <div className="mac">
              <a className="lightBoxVideoLink" aria-label="macbook-upd" href={url2} style={{ display: 'block', position: 'relative' }}>
                <span className="pulse-btn-on-mac">
                  <span className="content" />
                </span>
                <SimpleImg src="/images/design/video-image.jpg" height="350px" width="100%" style={{justifyContent: 'end'}} />
              </a>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  return (
    <div className="head row">
      <div className="col-xs-12 col-md-5 pl-0">
        <p>So funktioniert es</p>
        <h1>Smartphone, Tablet und Mac-Computer kaufen und verkaufen.</h1>
      </div>

      <div className="col-xs-12 col-md-7 buttons pl-0">
        <ul className="" role="tablist">
          <li role="presentation" className="active"><a href="#verkaufen" className="sell text-decoration-none" style={{borderRight: 'none'}} role="tab" data-toggle="tab">Ich will verkaufen</a></li>
          <li role="presentation"><a href="#kaufen" className="buy text-decoration-none" style={{borderLeft: 'none'}} role="tab" data-toggle="tab">Ich will kaufen</a></li>
        </ul>
      </div>

      <div className="col-xs-12 tab-content">
        <div role="tabpanel" className="tab-pane active" id="verkaufen">
          <div className="row periods">{mapPeriodsVerkaufen()}</div>

          <div className="row">
            <div className="col-xs-12 estimate-button">
              <a href="/verkaufen" className="estimatePrice btn"> Jetzt Gerät aussuchen</a>
            </div>
          </div>
        </div>


        <div role="tabpanel" className="tab-pane" id="kaufen">
          <div className="row periods">{mapPeriodsKaufen()}</div>

          <div className="row">
            <div className="col-xs-12 estimate-button">
              <a href="/kaufen" className="estimatePrice btn"> Jetzt Gerät aussuchen</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

HowItWorks.propTypes = {}
HowItWorks.defaultProps = {}

export default HowItWorks
