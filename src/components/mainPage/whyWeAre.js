import React from 'react'

const WhyWeAreDifferent = () => {
  return (
    <div className="whyWeAre">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-sm-12">
            <div className="head">
              <p>Unsere Stärken</p>
              <h1>Ihre Vorteile</h1>
            </div>
          </div>
          <div className="col-md-9 col-sm-12 wrap">
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <div className="itemWhy top-l">
                  <div className="img">
                    <img src="/images/design/time-icon.svg" alt="" />
                    <img src="/images/design/time-icon-white.svg" alt="" />
                  </div>
                  <h4>Schnelle Bezahlung</h4>
                  <p>Wir zahlen Ihnen den Betrag nach Prüfung Ihres Gerätes Express aus.</p>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div className="itemWhy top-r">
                  <div className="img">
                    <img src="/images/design/headphones-icon.svg" alt="" />
                    <img src="/images/design/headphones-icon-white.svg" alt="" />
                  </div>
                  <h4>Garantie</h4>
                  <p>Sie erhalten auf alle gekauften Geräte mindestens <strong>1 Jahr Garantie</strong>.</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-6">
                <div className="itemWhy bl">
                  <div className="img">
                    <img src="/images/design/assistant-icon.svg" alt="" />
                    <img src="/images/design/assistant_icon-white.svg" alt="" />
                  </div>
                  <h4>Hilfsassistent</h4>
                  <p>Gerne hilft Ihnen unser Online-Hilfsassistent <strong>Remo</strong> beim Kauf- und Verkaufsprozess Ihres Gerätes. Gerne sind wir auch für Sie im Livechat während unseren Bürozeiten erreichbar.</p>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div className="itemWhy br">
                  <div className="img">
                    <img src="/images/design/devices-icon.svg" alt="" />
                    <img src="/images/design/devices-icon-white.svg" alt="" />
                  </div>
                  <h4>Geprüfte Geräte</h4>
                  <p>Alle Geräte die zum Kauf angeboten werden werden nach strengen Richtlinien getestet, gereinigt und aufbereitet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

WhyWeAreDifferent.propTypes = {}
WhyWeAreDifferent.defaultProps = {}

export default WhyWeAreDifferent