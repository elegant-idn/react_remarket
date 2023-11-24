import React from 'react';
import MobileDetect from 'mobile-detect'

const OverviewModal = ({
    children,
    onClose
}) => {
    let md = new MobileDetect(window.navigator.userAgent)
    return (
        <div className='customModal'>
            <div className='customModal-header'>                
                <div className='col-xs-12 titleDiv'>
                    <p className="header-title">
                        {`Bestellübersicht`}
                    </p>
                </div>
                <div className='closeDiv' onClick={onClose}>
                    <img src={"/images/design/closeBtn.svg"} />
                </div>
            </div>
            <div className={md.mobile() === 'iPhone' && md.userAgent() === 'Safari' ? 'customModal-body safari-body' : 'customModal-body'}>
                {children}
            </div>
        </div>
    )
}

OverviewModal.propTypes = {}
OverviewModal.defaultProps = {}

export default OverviewModal