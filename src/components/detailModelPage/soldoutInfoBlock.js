import React from 'react'

const SoldoutInfoBlock = ({className=''}) => {
    return (
        <div className={`col-md-3 additionalInfo ${className}`}>
            <div className="additionalInfoWrapper">
                <div className="soldoutInfo">
                    <div className="title">
                        <img src="/images/design/soldout.png" alt=""/>
                        <span>Ausverkauft</span>
                    </div>
                    <div className="desc">
                        Leider ist dieser Artikel in der Zwischenzeit verkauft worden
                    </div>
                </div>                
            </div>            
        </div>
    );
}

SoldoutInfoBlock.propTypes = {}
SoldoutInfoBlock.defaultProps = {}

export default SoldoutInfoBlock