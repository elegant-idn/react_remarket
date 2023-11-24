import React from 'react'
import PropTypes from 'prop-types'

import RatingComments from '../../ratingPage/ratingComments'

const ItemRatingMobile = ({ data, user, loadData, currentPage, clickHelpfulBtn }) => {
    function mapStars(n) {
        let arr = []
        for(let i = 0; i < n; ++i){
            arr.push(<img src="/images/design/star.svg" key={i}/>)
        }
        return arr
    }
    function showComment(e) {
        $(e.target).closest('.itemRating').find('.wrapComments').first().toggle('slow')
    }
    return (
        <div className="itemRating clearfix">
            <div className="row">
                <div className="col-xs-3 userInfo">
                    {!data.googleRating &&
                        <div className="image">
                            {data.anonym == 1 && <img src='/images/design/anonymous.png' alt=""/>}
                            {data.anonym == 0 && <span>{data.firstname.slice(0,1).toUpperCase() + data.lastname.slice(0,1).toUpperCase()}</span>}
                        </div>
                    }
                    {data.googleRating &&
                                        <div className="image google">
                                            <img src={data.photo} alt=""/>
                                        </div>
                    }
                </div>
                <div className="col-xs-6 wrapStars">
                    <p className="name">{data.name}</p>
                    <div className="stars">{mapStars(data.stars)}</div>
                </div>
                <div className="col-xs-3 date">
                    <span>{data.date}</span>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <p className="text">"{data.message}"</p>
                </div>
            </div>
            <div className="row buttons">
                <div className="col-xs-6 text-left">
                    { !data.googleRating && (user.isLogin || data.comments.length > 0 ) &&
                            <span className="comment" onClick={showComment}>
                                {data.comments.length > 0 ? `${data.comments.length} ` : null}
                                Kommentar{data.comments.length > 1 ? 'e' : null}
                             </span>
                    }
                </div>
                <div className="col-xs-6 text-right">
                    { !data.googleRating && user.isLogin &&
                                     <span className={data.helpful ? 'helpfulBtn active' : 'helpfulBtn'}
                                           onClick={() => clickHelpfulBtn(data.id, data.helpful)}>
                                     Hilfreich</span>
                    }
                </div>
            </div>
            <RatingComments comments={data.comments}
                            user={user}
                            ratingId={data.id}
                            loadData={loadData}
                            currentPage={currentPage}
                            previousId={0}/>
        </div>
    )
}

ItemRatingMobile.propTypes = {}
ItemRatingMobile.defaultProps = {}

export default ItemRatingMobile