import React from 'react'

const SpinnerDots = ({id="spinner-dots-load"}) => {

    return (
        <div id={id} className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
        </div>
    )
}
export default SpinnerDots;