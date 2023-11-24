import React from 'react'

function Widerrufsbelehrung (){
  let domain = window.domainName.name.split('.')[window.domainName.name.split('.').length - 1]

  if( domain === 'de'){
      return (
        <div className="container">
            <h1>Widerrufsbelehrung</h1>
            <strong>Widerrufsrecht bei Verträgen</strong>
            <p>Sie haben das Recht, innerhalb von vierzehn Tagen ohne die Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt - ab dem Tag, an dem Sie selbst oder eine von Ihnen ernannte dritte Person, die nicht gleichzeitig der Beförderer ist, die Ware in Besitz genommen haben beziehungsweise hat - vierzehn Tage.</p>

            <p>Um von Ihrem Widerrufsrecht Gebrauch zu machen, ist Ihrerseits eine eindeutige Erklärung (zum Beispiel per Post oder E-Mail) an uns (remarket.de Recommerce GmbH, Berner Weg 23, D-79539 Lörrach (Telefon: 07621 916 56 50 , E-Mail: info@remarket.de) über Ihren Entschluss zum Widerruf des Vertrags zu richten. Sie haben die Möglichkeit, für diesen Zweck das beiliegende Muster-Widerrufsformular zu verwenden. Die Verwendung des Formulars ist jedoch nicht vorgeschrieben.</p>

            <p>Um die Widerrufsfrist zu wahren, ist es ausreichend, die Meldung über die Inanspruchnahme des Widerrufsrechts vor Ablauf der oben genannten Widerrufsfrist von vierzehn Tagen abzusenden.</p>

            <strong>Folgen des Widerrufs</strong>

            <p>Wenn der Vertrag Ihrerseits widerrufen wird, so sind wir verpflichtet, alle Ihrerseits getätigten Zahlungen einschließlich der Kosten für den Versand (mit Ausnahme der für andere als den Standardversand gewählte Liefermethoden zusätzlich angefallenen Kosten) unverzüglich und spätestens innerhalb von vierzehn Tagen ab dem Tag zu erstatten, an welchem die Mitteilung über den Widerruf des Vertrags bei uns eingetroffen ist.</p>

            <p>Um den Kaufpreis des Geräts zu erstatten, nutzen wir das Zahlungsmittel, das Ihrerseits bei der ursprünglichen Bestellung verwendet wurde, es sei denn, es wurde mit Ihnen ausdrücklich eine andere Form der Erstattung vereinbart. In keinem Fall berechnen wir Ihnen in Verbindung mit dieser Rückzahlung Entgelte. Wir haben das Recht, die Rückzahlung so lange zu verweigern, bis wir die Waren erhalten haben oder bis Ihrerseits ein Nachweis über die Rücksendung der Waren erbracht wurde, wobei der frühere Zeitpunkt entscheidend für die 14-tägige Frist zur Rückzahlung ist.</p>

            <p>An dem Tag, an dem Sie uns über die Inanspruchnahme des Widerrufsrechts informieren, haben Sie die Geräte unverzüglich und spätestens innerhalb von vierzehn Tagen ab dem Datum der Information über den Widerruf an uns zurückzuschicken. Die Frist gilt als gewahrt, wenn die Waren vor Ablauf der 14-tägigen Frist von Ihnen abgesendet werden.</p>

            <p>Wenn der Preis der einzelnen, zurückzusendenden Waren einen Wert von 40 {window.currencyValue} nicht übersteigt, so sind die unmittelbaren Kosten der Rücksendung von Ihnen zu tragen. Andernfalls übernehmen wir die Kosten für die Rücksendung.</p>

            <p>Ein etwaiger Wertverlust der Waren ist nur von Ihnen zu tragen, wenn der Wertverlust durch einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht erforderlichen Umgang Ihrerseits zurückgeführt werden kann.</p>

            <strong>Hinweis auf Nichtbestehen dieses Widerrufsrechts:</strong>
            <p>Dieses Widerrufsrecht wird nicht angewendet bei Fernabsatzverträgen</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '25px'}}>
                <li>zur Lieferung von Gütern/Waren, die eindeutig auf Ihren persönlichen Bedarf abgestimmt sind oder für deren Produktion eine individuelle Wahl oder Bestimmung Ihrerseits maßgeblich ist und welche nicht vorgefertigt sind.</li>
                <li>zur Lieferung von Gütern/Waren, die versiegelt sind und die sich wegen gesundheitsgefährdenden oder hygienischen Gründen nicht zur Rückgabe eignen, wenn die entsprechende Versiegelung nach erfolgter Lieferung entfernt wird,</li>
                <li>zur Lieferung von Gütern/Waren, sofern diese nach erfolgter Lieferung wegen ihrer Beschaffenheit nicht trennbar mit anderen Waren/Gütern vermischt werden,</li>
                <li>zur Lieferung von Video- oder Tonaufnahmen oder PC-Software in einer Packung mit Versiegelung, sofern diese Versiegelung nach erfolgter Lieferung entfernt wird.</li>
            </ul>
            <br /><br />
            <h2>Muster - Widerrufsformular - Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es an uns zurück.</h2>

<strong>Per Brief: </strong><br /><br />
remarket.de Recommerce GmbH<br />
Berner Weg 23, 79539 Lörrach<br />
Telefon: 0049 7621 9165650<br /><br />

<strong>Per E-Mail: </strong><br />
info@remarket.de<br /><br />

Hiermit widerrufe(n) ich / wir ______________________________<br /><br />

(Vor- und Nachname), Kundennummer ______________________________<br /><br />

Anschrift <br />

______________________________ (Straße, Hausnummer) <br /><br />

______________________________ (PLZ) <br /><br />

______________________________ (Ort)<br /><br />


den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Waren Artikel ID (optional)<br /><br />

Artikelname ______________________________<br /><br />

Widerrufsgrund (optional) ______________________________<br /><br />

Bestellt am ______________________________ (Datum)<br /><br />

Erhalten am ______________________________ (Datum)<br /><br />


______________________________ (Ort, Datum und Unterschrift)
        </div>
      )
    }
      if( domain === 'ch'){
          return (
            <div className="container">
                <h1>Widerrufsbelehrung</h1>
                <strong>Widerrufsrecht bei Verträgen</strong>
                <p>Sie haben das Recht, innerhalb von vierzehn Tagen ohne die Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt - ab dem Tag, an dem Sie selbst oder eine von Ihnen ernannte dritte Person, die nicht gleichzeitig der Beförderer ist, die Ware in Besitz genommen haben beziehungsweise hat - vierzehn Tage.</p>

                <p>Um von Ihrem Widerrufsrecht Gebrauch zu machen, ist Ihrerseits eine eindeutige Erklärung (zum Beispiel per Post oder E-Mail) an uns (happyphone.ch GmbH, Gerbergasse 82, CH-4001 Basel (Telefon: 061 511 22 44 , E-Mail: info@remarket.ch) über Ihren Entschluss zum Widerruf des Vertrags zu richten. Sie haben die Möglichkeit, für diesen Zweck das beiliegende Muster-Widerrufsformular zu verwenden. Die Verwendung des Formulars ist jedoch nicht vorgeschrieben.</p>

                <p>Um die Widerrufsfrist zu wahren, ist es ausreichend, die Meldung über die Inanspruchnahme des Widerrufsrechts vor Ablauf der oben genannten Widerrufsfrist von vierzehn Tagen abzusenden.</p>

                <strong>Folgen des Widerrufs</strong>

                <p>Wenn der Vertrag Ihrerseits widerrufen wird, so sind wir verpflichtet, alle Ihrerseits getätigten Zahlungen einschliesslich der Kosten für den Versand (mit Ausnahme der für andere als den Standardversand gewählte Liefermethoden zusätzlich angefallenen Kosten) unverzüglich und spätestens innerhalb von vierzehn Tagen ab dem Tag zu erstatten, an welchem die Mitteilung über den Widerruf des Vertrags bei uns eingetroffen ist.</p>

                <p>Um den Kaufpreis des Geräts zu erstatten, nutzen wir das Zahlungsmittel, das Ihrerseits bei der ursprünglichen Bestellung verwendet wurde, es sei denn, es wurde mit Ihnen ausdrücklich eine andere Form der Erstattung vereinbart. In keinem Fall berechnen wir Ihnen in Verbindung mit dieser Rückzahlung Entgelte. Wir haben das Recht, die Rückzahlung so lange zu verweigern, bis wir die Waren erhalten haben oder bis Ihrerseits ein Nachweis über die Rücksendung der Waren erbracht wurde, wobei der frühere Zeitpunkt entscheidend für die 14-tägige Frist zur Rückzahlung ist.</p>

                <p>An dem Tag, an dem Sie uns über die Inanspruchnahme des Widerrufsrechts informieren, haben Sie die Geräte unverzüglich und spätestens innerhalb von vierzehn Tagen ab dem Datum der Information über den Widerruf an uns zurückzuschicken. Die Frist gilt als gewahrt, wenn die Waren vor Ablauf der 14-tägigen Frist von Ihnen abgesendet werden.</p>

                <p>Wenn der Preis der einzelnen, zurückzusendenden Waren einen Wert von 40 {window.currencyValue} nicht übersteigt, so sind die unmittelbaren Kosten der Rücksendung von Ihnen zu tragen. Andernfalls übernehmen wir die Kosten für die Rücksendung.</p>

                <p>Ein etwaiger Wertverlust der Waren ist nur von Ihnen zu tragen, wenn der Wertverlust durch einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht erforderlichen Umgang Ihrerseits zurückgeführt werden kann.</p>

                <strong>Hinweis auf Nichtbestehen dieses Widerrufsrechts:</strong>
                <p>Dieses Widerrufsrecht wird nicht angewendet bei Fernabsatzverträgen</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '25px'}}>
                    <li>zur Lieferung von Gütern/Waren, die eindeutig auf Ihren persönlichen Bedarf abgestimmt sind oder für deren Produktion eine individuelle Wahl oder Bestimmung Ihrerseits massgeblich ist und welche nicht vorgefertigt sind.</li>
                    <li>zur Lieferung von Gütern/Waren, die versiegelt sind und die sich wegen gesundheitsgefährdenden oder hygienischen Gründen nicht zur Rückgabe eignen, wenn die entsprechende Versiegelung nach erfolgter Lieferung entfernt wird,</li>
                    <li>zur Lieferung von Gütern/Waren, sofern diese nach erfolgter Lieferung wegen ihrer Beschaffenheit nicht trennbar mit anderen Waren/Gütern vermischt werden,</li>
                    <li>zur Lieferung von Video- oder Tonaufnahmen oder PC-Software in einer Packung mit Versiegelung, sofern diese Versiegelung nach erfolgter Lieferung entfernt wird.</li>
                </ul>
                <br /><br />
                <h2>Muster - Widerrufsformular - Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es an uns zurück.</h2>

    <strong>Per Brief: </strong><br /><br />
    iReparatur.ch / remarket.ch GmbH<br />
    Gerbergasse 82, CH-4001 Basel<br />
    Telefon: 0041 61 511 22 44<br /><br />

    <strong>Per E-Mail: </strong><br />
    info@remarket.ch<br /><br />

    Hiermit widerrufe(n) ich / wir ______________________________<br /><br />

    (Vor- und Nachname), Kundennummer ______________________________<br /><br />

    Anschrift <br />

    ______________________________ (Strasse, Hausnummer) <br /><br />

    ______________________________ (PLZ) <br /><br />

    ______________________________ (Ort)<br /><br />


    den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Waren Artikel ID (optional)<br /><br />

    Artikelname ______________________________<br /><br />

    Widerrufsgrund (optional) ______________________________<br /><br />

    Bestellt am ______________________________ (Datum)<br /><br />

    Erhalten am ______________________________ (Datum)<br /><br />


    ______________________________ (Ort, Datum und Unterschrift)
            </div>
          )
        }

}
export default Widerrufsbelehrung
