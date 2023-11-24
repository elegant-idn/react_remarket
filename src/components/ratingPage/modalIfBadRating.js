import React from 'react'

const ModalIfBadRating = ({publishIfBadRating, closeModal}) => {
    return (
        <div className="modal fade"
             id="modalBadRating"
             tabIndex="-1"
             role="dialog"
             aria-labelledby="modalBadRating">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button onClick={closeModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title"><img src="/images/design/sad.svg" alt=""/></h4>
                    </div>
                    <div className="modal-body">
                        <p className="head">Das tut uns Leid zu hören, wie können wir uns verbessern?</p>
                        <form name="formIfBadRating" onSubmit={publishIfBadRating}>
                            <label><input type="radio" name="feedbackStatus" value="1" required/>
                                    <span/>Support-Dienstleistung (Ladenlokal, E-Mail, Telefon etc.)
                            </label>
                            <label><input type="radio" name="feedbackStatus" value="2" required/>
                                <span/>Lieferzeiten (Zu lange Lieferzeiten oder ähnliches)
                            </label>
                            <label><input type="radio" name="feedbackStatus" value="3" required/>
                                <span/>Zustandsbeschreibung (nicht wie online beschrieben, Garantiefall etc.)
                            </label>
                            <label><input type="radio" name="feedbackStatus" value="4" required/>
                                <span/>Zahlungsmöglichkeiten (Probleme bei der Zahlung, Preisgestaltung etc.)
                            </label>
                            <div className="message">
                                <p>Zusätzliches Feedback</p>
                                <textarea name="feedbackText" placeholder="Optional..."/>
                            </div>
                            <div className="text-right">
                                <button className="btn" onSubmit={publishIfBadRating}>Veröffentlichen</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

ModalIfBadRating.propTypes = {}
ModalIfBadRating.defaultProps = {}

export default ModalIfBadRating