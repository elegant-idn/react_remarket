import React from 'react'
import PropTypes from 'prop-types'

const Impressum = () => {
    const domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]
    if( domain === 'ch'){
        return (
            <div className="container">
            <h1>Impressum</h1>

            <p>
            <strong>Firmensitz</strong><br />
            iReparatur.ch / remarket.ch GmbH<br />
            Gerbergasse 82<br />
            4001 Basel <br />
            Schweiz<br /><br />

            Telefon: +41 61 511 22 44<br />
            Web: www.remarket.ch<br />
            E-Mail: info@remarket.ch<br />
            UID: CHE-470.452.421<br />
            Steuernummer: CHE-470.452.421 MWST<br />
            Handelsregister-Nummer: CH-280.4.014.383-6<br /><br />

            Sie erreichen unseren Kundendienst für Fragen, Bestellungen, Reklamationen und Beanstandungen unter Telefon: +41 61 511 22 44 sowie per Email unter info@remarket.ch. Für Anfragen können Sie auch das <a href="/kontakt/">Kontaktformular</a> auf unserer Internetseite nutzen.
</p>

<h2>Haftungsausschluss</h2>
<p>Bei direkten oder indirekten Verweisen auf fremde Webseiten ("Hyperlinks"), die ausserhalb des Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung ausschliesslich in dem Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. Der Autor erklärt hiermit ausdrücklich, dass zum Zeitpunkt der Linksetzung keine illegalen Inhalte auf den zu verlinkenden Seiten erkennbar waren. Auf die aktuelle und zukünftige Gestaltung, die Inhalte oder die Urheberschaft der verlinkten/verknüpften Seiten hat der Autor keinerlei Einfluss. Deshalb distanziert er sich hiermit ausdrücklich von allen Inhalten aller verlinkten /verknüpften Seiten, die nach der Linksetzung verändert wurden. Diese Feststellung gilt für alle innerhalb des eigenen Internetangebotes gesetzten Links und Verweise sowie für Fremdeinträge in vom Autor eingerichteten Gästebüchern, Diskussionsforen, Linkverzeichnissen, Mailinglisten und in allen anderen Formen von Datenbanken, auf deren Inhalt externe Schreibzugriffe möglich sind. Für illegale, fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der über Links auf die jeweilige Veröffentlichung lediglich verweist.</p>

<h2>Urheber- und Kennzeichenrecht</h2>
<p>Der Autor ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten Bilder, Grafiken, Tondokumente, Videosequenzen und Texte zu beachten, von ihm selbst erstellte Bilder, Grafiken, Tondokumente, Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken, Tondokumente, Videosequenzen und Texte zurückzugreifen. Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken- und Warenzeichen unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts und den Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein aufgrund der blossen Nennung ist nicht der Schluss zu ziehen, dass Markenzeichen nicht durch Rechte Dritter geschützt sind! Das Copyright für veröffentlichte, vom Autor selbst erstellte Objekte bleibt allein beim Autor der Seiten. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung des Autors nicht gestattet.</p>
             </div>
        )
    }
    else{
        return (

            <div className="container">
            <h1>Impressum</h1>
            <h2>Angaben gem&auml;&szlig; &sect; 5 TMG:</h2>
            <p>remarket.de Recommerce GmbH<br />
            Berner Weg 23<br />
            D-79539 Lörrach</p>

            <h2>Vertreten durch:</h2>
            <p>vertreten durch den Gesch&auml;ftsf&uuml;hrer Patric Glanzmann</p>

            <h2>Kontakt:</h2>
            <p>Telefon: 0049 7621-9165650<br />
            E-Mail: info@remarket.de</p>

            <h2>Registereintrag:</h2>
            <p>Eintragung im Handelsregister HRB 716542<br />
            Registergericht: Amtsgericht Freiburg<br />
            Registernummer: Registernummer</p>

            <h2>Umsatzsteuer:</h2>
            <p>Umsatzsteuer-Identifikationsnummer gem&auml;&szlig; &sect;27 a Umsatzsteuergesetz:<br />
            DE313423632</p>

            <h2>Streitschlichtung</h2>

            <p>Die Europ&auml;ische Kommission stellt eine
            Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr"
            target="_blank">https://ec.europa.eu/consumers/odr</a><br /> Unsere E-Mail-Adresse finden Sie oben im
            Impressum.</p> <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.</p>

            <h2>Haftung f&uuml;r Inhalte</h2>
            <p>Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder gespeicherte fremde Informationen zu
            &uuml;berwachen oder nach Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit
            hinweisen.</p> <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach
            den allgemeinen Gesetzen bleiben hiervon unber&uuml;hrt. Eine diesbez&uuml;gliche Haftung ist jedoch
            erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m&ouml;glich. Bei Bekanntwerden
            von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

            <h2>Haftung f&uuml;r Links</h2>

            <p>Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf
            deren Inhalte wir keinen Einfluss haben. Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte auch
            keine Gew&auml;hr &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist stets der jeweilige
            Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf m&ouml;gliche Rechtsverst&ouml;&szlig;e &uuml;berpr&uuml;ft. Rechtswidrige Inhalte
            waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p> <p>Eine permanente inhaltliche Kontrolle der
            verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
            Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

            <h2>Urheberrecht</h2>
            <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem deutschen Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede
            Art der Verwertung au&szlig;erhalb der Grenzen des Urheberrechtes bed&uuml;rfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f&uuml;r
            den privaten, nicht kommerziellen Gebrauch gestattet.</p>

            <p>Soweit die Inhalte auf dieser Seite nicht
            vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
            Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
            werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
            werden wir derartige Inhalte umgehend entfernen.</p>

            <p>Quelle: <a href="https://www.e-recht24.de">erecht24.de</a></p>
            </div>
        )
    }
}

Impressum.propTypes = {}
Impressum.defaultProps = {}

export default Impressum
