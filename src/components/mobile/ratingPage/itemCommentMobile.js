import React from 'react'
import PropTypes from 'prop-types'

const ItemCommentMobile = ({data, user}) => {
    return (
        <div className="itemComment clearfix">
            <div className="row">
                <div className="col-xs-2 userInfo">
                    <div className="image">
                        {data.anonym == 1 && <img src='/images/design/anonymous.png' alt=""/>}
                        {data.anonym == 0 && <span>{data.firstname.slice(0,1).toUpperCase() + data.lastname.slice(0,1).toUpperCase()}</span>}
                    </div>
                </div>
                <div className="col-xs-10">
                    {data.anonym == 0 && <span className="name">{data.firstname} {data.lastname}</span>}
                    {data.anonym == 1 && <span className="name">Anonym</span>}
                    <p className="info">
                        <span>{data.date}</span>
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <span className="messageText">{data.message}</span>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    { (user.isLogin || data.comment ) &&
                    <span className="comment"
                          onClick={(e) => $(e.target).closest('.wrapItemComment').find('.wrapComments').first().toggle('slow')}>
                                  {data.comment && data.comment.length > 0 ? `${data.comment.length} ` : null}
                        Kommentar{data.comment && data.comment.length > 1 ? 'e' : null}
                            </span>
                    }
                </div>
            </div>
        </div>
    )
}

ItemCommentMobile.propTypes = {}
ItemCommentMobile.defaultProps = {}

export default ItemCommentMobile