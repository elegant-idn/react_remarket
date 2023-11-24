import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

class FaqPage extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.handleClickItem = this.handleClickItem.bind(this)
    }

    handleClickItem(e){
        [...document.querySelectorAll('.faqPage-accordion>li')].forEach( item => {
            item.classList.remove('active')
            item.firstChild.classList.remove('fa-minus-square')
            item.firstChild.classList.add('fa-plus-square')
        })
        e.currentTarget.classList.add('active')
        e.currentTarget.firstChild.classList.remove('fa-plus-square')
        e.currentTarget.firstChild.classList.add('fa-minus-square')
    }

    render() {
        return (
            <div className="container">
                <h4 className="agb-header" >
                    <Link to="/ueber-uns" activeClassName="active"> Über uns</Link> &gt;&gt;
                    <Link to="/ueber-uns/faq" activeClassName="active">Anleitungen und Hilfe</Link>
                </h4>
                <ul className="faqPage-accordion">
                    <li onClick={this.handleClickItem}>
                        <i className="fa fa-plus-square" aria-hidden="true"></i><h3 className="title">Warum wird mein Modell nicht aufgeführt?</h3>
                        <div className="content">
                            <p>Wir konzentrieren uns auf die gängigsten schweizer Smartphone Modelle und sind auf die <strong>Apple iPhone und Samsung Galaxy</strong> Geräte spezialisiert. Die Marken HTC, Sony, Microsoft, Nokia, Wiko, Huawei, Xiaomi etc. reparieren wir zum aktuellen Zeitpunkt noch nicht.</p>
                        </div>
                    </li>
                    <li onClick={this.handleClickItem}>
                        <i className="fa fa-plus-square" aria-hidden="true"></i><h3 className="title">Was kostet meine Reparatur?</h3>
                        <div className="content" >
                            <p>Wählen Sie auf der Reparatur-Seite Ihr Modell aus und klicken Sie auf den Defekt Ihres Gerätes, welchen Sie repariert haben wollen. Es wird Ihnen dann im Detail der Reparaturpreis und die Zeit angezeigt.</p>
                        </div>
                    </li>
                    <li onClick={this.handleClickItem}>
                        <i className="fa fa-plus-square" aria-hidden="true"></i><h3 className="title">Wie deaktiviere ich Mein iPhone suchen (Mein iPad suchen / MIS)?</h3>
                        <div className="content" >
                            <h3>"Mein iPhone suchen" deaktivieren</h3>
                            <ul>
                                <li>
                                    <h4>1. Einloggen bei iCloud.com von APPLE</h4>
                                    <p><strong>Klicken Sie auf Ihrem PC / Mac auf den folgenden Link und loggen Sie sich mit Ihrer APPLE-ID ein.</strong></p>
                                    <p>Hinweis: Dies ist in der Regel die Emailadresse und Passwort, mit der Sie auch Ihre Apps, Spiele, und Musik kaufen.</p>
                                </li>
                                <li>
                                    <h4>2. Finden des richtigen Gerätes</h4>
                                    <p><strong>Klicken Sie auf Ihrem PC / Mac auf den folgenden Link und loggen Sie sich mit Ihrer APPLE-ID ein.</strong></p>
                                    <p>Hinweis: Wenn Sie sich nicht sicher sind, welches das Richtige ist, können Sie auch alle Geräte nach der Reihe löschen.</p>
                                    <p>Keine Sorge: Es werden niemals die Daten am Gerät gelöscht, sondern lediglich die "Mein iPhone suchen"-Funktion. Diese Funktion kann auch jederzeit wieder kostenlos aktiviert werden.</p>
                                </li>
                                <li>
                                    <h4>3. Entfernen des Gerätes</h4>
                                    <p><strong>Sie sehen dann ein Foto Ihres Gerätes und klicken dort auf » Von "Mein iPhone suchen" entfernen</strong></p>
                                    <p>Hinweis: Bitte klicken Sie _NICHT_ auf den Button » iPhone löschen «, dies würde die Daten auf dem Gerät löschen.</p>
                                </li>
                                <li>
                                    <h4>4. Fertig</h4>
                                    <p><strong>Nun kann Ihr Gerät zum Komplettaustausch eingesendet, bzw. verkauft werden.</strong></p>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li onClick={this.handleClickItem}>
                        <i className="fa fa-plus-square" aria-hidden="true"></i><h3 className="title">Wann haben Sie geöffnet? / Wie sind die Öffnungszeiten?</h3>
                        <div className="content" >
                            <h3>Unsere Öffnungszeiten</h3>
                            <p>Mo-Fr von 09:00 bis 18:30</p>
                            <p>Wir haben immer durchgehend über Mittag geöffnet!</p>
                        </div>
                    </li>
                    <li onClick={this.handleClickItem}>
                        <i className="fa fa-plus-square" aria-hidden="true"></i><h3 className="title">Wie komme ich zu Ihnen? Wo ist Ihr Ladenlokal?</h3>
                        <div className="content" >
                            <p>Wir befinden uns in der <strong>Gerbergasse 82, 4001 Basel</strong> (rechts neben der Brötli-Bar / Links von Negishi Sushi).</p>
                            <h3>Lageplan</h3>
                            <div className="map"><iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8740.40180698479!2d7.586805530859824!3d47.55592084512538!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xafcc7bb0b0fa1ad9!2siReparatur.ch+-+iPhone+repair+Basel!5e0!3m2!1sen!2sch!4v1501835305770" width="100%" height="400" frameBorder="0"  allowFullScreen></iframe></div>

                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

FaqPage.propTypes = {}
FaqPage.defaultProps = {}

export default FaqPage