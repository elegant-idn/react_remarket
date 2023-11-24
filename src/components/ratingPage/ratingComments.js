import React, {Component} from 'react'
import PropTypes from 'prop-types'

import ItemComment from './itemComment'
import ItemCommentMobile from '../mobile/ratingPage/itemCommentMobile'

class RatingComments extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.sendComment = this.sendComment.bind(this)
        this.mapComments = this.mapComments.bind(this)
    }

    sendComment(e){
        let { ratingId, previousId } = this.props,
            message = $(e.target).closest('.writeCommentForm').find('textarea[name="commentText"]').val(),
            anonym = $(e.target).closest('.writeCommentForm').find('input[name="anonymous"]').prop('checked')

        if(message.trim()){
            let body = {
                ratingId: ratingId,
                message,
                anonym,
                commentId: previousId
            }
            $(e.target).closest('.writeCommentForm').find('textarea[name="commentText"]').val(null)
            document.getElementById('spinner-box-load').style.display = 'block'
            axios.post(`/api/addRatingComment`, body)
                .then( result => {
                    document.getElementById('spinner-box-load').style.display = 'none'
                    this.props.loadData(this.props.currentPage + 1, true)
                })
        }
    }
    mapComments( item, i){
        if(window.isMobile){
            return (
                <div className="wrapItemComment" key={i}>
                    <ItemCommentMobile data={item} user={this.props.user}/>
                    <RatingComments ratingId={this.props.ratingId}
                                    loadData={this.props.loadData}
                                    currentPage={this.props.currentPage}
                                    comments={item.comment}
                                    user={this.props.user}
                                    previousId={item.id}/>
                </div>
            )
        }
        else return(
                <ItemComment data={item}
                             key={i}
                             ratingId={this.props.ratingId}
                             loadData={this.props.loadData}
                             currentPage={this.props.currentPage}
                             user={this.props.user}/>
            )
    }

    render() {
        let { user, comments } = this.props
        return (
            <div className="wrapComments row">
                {comments && comments.map(this.mapComments)}
                {user.isLogin &&
                                    <div className="writeComment">
                                        <div className="col-sm-1 col-xs-3 userInfo">
                                            <div className="image">
                                                { !user.isLogin && <img src='/images/design/anonymous.png' alt=""/>}
                                                { user.isLogin && user.data && <span>{user.data.systemAddress.first_name.slice(0,1).toUpperCase() + user.data.systemAddress.last_name.slice(0,1).toUpperCase()}</span>}
                                            </div>
                                        </div>
                                        <div className="col-sm-11 col-xs-9">
                                            <form name="writeComment" className="writeCommentForm">
                                                                <textarea name="commentText"
                                                                          placeholder="Schreibe einen Kommentar" required/>
                                                                <div className="anonym">
                                                                    <label >
                                                                        <input type="checkbox" name="anonymous"/>
                                                                        <span  className="check"/>
                                                                        Anonym veröffentlichen
                                                                    </label>
                                                                    <button className="btn"
                                                                            type="button"
                                                                            onClick={this.sendComment}>Veröffentlichen
                                                                    </button>
                                                                </div>
                                            </form>
                                        </div>
                                    </div>
                }
            </div>
        )
    }
}

RatingComments.propTypes = {}
RatingComments.defaultProps = {}

export default RatingComments