import React from 'react'

const SpinnerBox = ({id="spinner-box-load"}) => {

    return (
        <div id={id} className="dn">
            <div className="animation">
                <div className="circle"></div>
                <img src="/images/design/logo_animation-spinner.svg" alt="Logo"/>
            </div>
        </div>
    )
}
export default SpinnerBox;