import React from 'react'

const ChooseLocation = ( {places, changeSummaryTabContent}) => {    
    return (
        <div className="choose-location">
            <div className="close-btn" onClick={(e) => {
                changeSummaryTabContent('generalInfo')
            }}>
                <img src={"/images/design/circle_close.svg"} />
            </div>
            <p className="title">Ladenlokal besuchen</p>
            <p className="description">
                Wählen Sie die Filiale aus, welche Sie besuchen wollen,
                um weitere Informationen zu erhalten.</p>
            <div className="place-btn">
                {places.data.map((item, i) => {
                    return (
                        <button key={`location-btn-${i}`}
                                className="btn bigText text-center"
                                onClick={(e) => {
                                    changeSummaryTabContent('bringToShop', item)
                                }}>
                            <img alt=""
                                    src={`/images/${item.id}.svg`}
                                    style={{marginRight: 17}}/>
                            <div className="location-title">
                                Filiale {item.descriptionBranch}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

ChooseLocation.propTypes = {}
ChooseLocation.defaultProps = {}

export default ChooseLocation