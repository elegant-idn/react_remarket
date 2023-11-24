import React from 'react'
import PropTypes from 'prop-types'

import RatingComments from './ratingComments'

const ItemComment = ({data, ratingId, loadData, currentPage, user}) => {
    return (
        <div className="itemComment clearfix">
            <div className="col-sm-1 userInfo">
                <div className="image">
                    {data.anonym == 1 && <img src='/images/design/anonymous.png' alt=""/>}
                    {data.anonym == 0 && <span>{data.firstname.slice(0,1).toUpperCase() + data.lastname.slice(0,1).toUpperCase()}</span>}
                </div>
            </div>
            <div className="col-sm-11">
                <p className="commentText">
                    {data.anonym == 0 && <span className="name">{data.firstname} {data.lastname}</span>}
                    {data.anonym == 1 && <span className="name">Anonym</span>}
                    <span>{data.message}</span>
                </p>
                <p className="info">
                    <span>{data.date}</span>
                    { (user.isLogin || data.comment ) &&
                    <span className="comment"
                          onClick={(e) => $(e.target).closest('.itemComment').find('.wrapComments').first().toggle('slow')}>
                                {data.comment && data.comment.length > 0 ? `${data.comment.length} ` : null}
                        Kommentar{data.comment && data.comment.length > 1 ? 'e' : null}
                            </span>
                    }
                </p>
                <RatingComments ratingId={ratingId}
                                loadData={loadData}
                                currentPage={currentPage}
                                comments={data.comment}
                                user={user}
                                previousId={data.id}/>
            </div>
        </div>
    )
}

ItemComment.propTypes = {}
ItemComment.defaultProps = {}

export default ItemComment