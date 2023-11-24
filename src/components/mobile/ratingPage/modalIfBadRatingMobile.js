import React from 'react'

const ModalIfBadRatingMobile = ({publishIfBadRating, closeModal}) => {
    return (
        <div className="modal fade"
             id="modalBadRating"
             tabIndex="-1"
             role="dialog"
             aria-labelledby="modalBadRating">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <form name="formIfBadRating" onSubmit={publishIfBadRating}>
                            <div className="wrapForm">
                                <div className="modal-title"><img src="/images/design/sad.svg" alt=""/></div>
                                <p className="head">We are sorry to hear that, what could we change to do better?</p>
                                <label><input type="radio" name="feedbackStatus" value="1" required/>
                                    <span/>support (in store, mail or phone)
                                </label>
                                <label><input type="radio" name="feedbackStatus" value="2" required/>
                                    <span/>Delivery (long waiting time or else)
                                </label>
                                <label><input type="radio" name="feedbackStatus" value="3" required/>
                                    <span/>Condition (not as online stated, doa)
                                </label>
                                <label><input type="radio" name="feedbackStatus" value="4" required/>
                                    <span/>Payment (pricing, problems with payment)
                                </label>
                                <div className="message">
                                    <input type="text" name="feedbackText" placeholder="Additional Feedback..."/>
                                </div>
                            </div>
                            <div className="buttons">
                                <button onClick={closeModal}
                                        type="button"
                                        className="btn closeBtn"
                                        data-dismiss="modal"
                                        aria-label="Close">
                                    Dismiss
                                </button>
                                <button className="btn" onSubmit={publishIfBadRating}>Publish</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

ModalIfBadRatingMobile.propTypes = {}
ModalIfBadRatingMobile.defaultProps = {}

export default ModalIfBadRatingMobile