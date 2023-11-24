import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { cookieApi } from '../../api/apiCookie'

import ItemRating from './itemRating'
import ItemRatingMobile from '../mobile/ratingPage/itemRatingMobile'
import WriteRatingModal from './writeRatingModal'
import WriteRatingModalMobile from '../mobile/ratingPage/writeRatingModalMobile'

import  {connect} from 'react-redux'

export class RatingPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pagination: {
                activePage: 0,
                totalItemsCount: 0,
                pageCount: 0

            },
            sort: {
                options: [
                    { label: "Höchste", value: 'highest'},
                    { label: "Niedrigste", value: 'lowest'},
                    { label: "Neuste", value: 'newest'}
                ],
                currentValue: "highest"
            },
            data: {
                items: [],
                info:{
                    total: 0,
                    average: 0,
                    statistics: [
                        {stars: 5, count: 0},
                        {stars: 4, count: 0},
                        {stars: 3, count: 0},
                        {stars: 2, count: 0},
                        {stars: 1, count: 0},
                    ]
                }
            },
            showModalWriteRating: false
        }

        this._loadRatingData = this._loadRatingData.bind(this)
        this.mapStatistics = this.mapStatistics.bind(this)
        this.mapRatings = this.mapRatings.bind(this)
        this.changeSortBy = this.changeSortBy.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.clickHelpfulBtn = this.clickHelpfulBtn.bind(this)
        this.closeShowModalWriteRating = this.closeShowModalWriteRating.bind(this)
        this.writeRating = this.writeRating.bind(this)
    }
    componentDidMount(){
        this._loadRatingData(1)
    }
    _loadRatingData(page, noScroll){
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.get(`/api/getRatings?page=${page}&sort=${this.state.sort.currentValue}`)
            .then(result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                if(!noScroll) window.scrollTo(0, 0)
                this.setState({ data: {...this.state.data, items: result.data.items, info: result.data.info},
                                pagination: {...this.state.pagination,
                                                activePage: page - 1,
                                                pageCount: Math.ceil(result.data.info.total/10),
                                                totalItemsCount: result.data.info.total,
                                                }
                })
            })
    }
    writeRating(){
        if(!cookieApi.getCookie('writeRating')){
            this.setState({ showModalWriteRating: true})
        }
        else {
            this.setState({ writeRatingToday: true })
            setTimeout( () => this.setState({writeRatingToday: false}), 3000)
        }

    }
    closeShowModalWriteRating(){
        this.setState({ showModalWriteRating: false})
    }
    handlePageChange(nextPage){
        this._loadRatingData(nextPage.selected + 1)
        $('.wrapComments').css({display: 'none'})
        this.setState({ pagination: { ...this.state.pagination, activePage: nextPage.selected }})
    }
    changeSortBy(e){
        let { value } = e
        this.setState({ sort: {...this.state.sort, currentValue: value} }, () => this._loadRatingData(1))
    }
    mapStatistics(item, i){
        let values = ['Ausgezeichnet', 'Sehr gut', 'Gut', 'Befriedigend', 'Ungenügend'],
            className = item.count == 100 ? 'ratingCount full' : 'ratingCount'
        return(
            <div className="itemStatistic" key={i}>
                <span className="name">{values[i]}</span>
                <span className="ratingLine">
                    <span className={className} style={{width: item.count + '%'}}/>
                </span>
                <span className="count">{item.count} %</span>
            </div>
        )
    }
    mapRatings(item, i){
        if(window.isMobile) return <ItemRatingMobile key={i}
                                               clickHelpfulBtn={this.clickHelpfulBtn}
                                               currentPage={this.state.pagination.activePage}
                                               loadData={this._loadRatingData}
                                               user={ this.props.user }
                                               data={item}/>
        else return <ItemRating key={i}
                           clickHelpfulBtn={this.clickHelpfulBtn}
                           currentPage={this.state.pagination.activePage}
                           loadData={this._loadRatingData}
                           user={ this.props.user }
                           data={item}/>
    }
    clickHelpfulBtn(ratingId, isChecked){
        let operation = isChecked ? 'remove' : 'add',
            body = {ratingId, operation},
            { activePage } = this.state.pagination
        document.getElementById('spinner-box-load').style.display = 'block'
        axios.post(`/api/updateHelpfulCount`, body)
            .then( result => {
                document.getElementById('spinner-box-load').style.display = 'none'
                this._loadRatingData( activePage + 1, true)
            })

    }
    render() {
        let {data: {info, items}, sort, pagination, writeRatingToday, showModalWriteRating } = this.state
        return (
            <div className="ratingPage">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row topInfo clearfix">
                                <div className="col-md-3">
                                    <p className="average">Durchschnitt ({info.total} Bewertungen)</p>
                                    <div className="star-rating">
                                        <div className="back-stars">
                                            <img src="/images/design/star_unselected.svg" alt=""/>
                                            <img src="/images/design/star_unselected.svg" alt=""/>
                                            <img src="/images/design/star_unselected.svg" alt=""/>
                                            <img src="/images/design/star_unselected.svg" alt=""/>
                                            <img src="/images/design/star_unselected.svg" alt=""/>

                                            <div className="front-stars" style={{width: (info.average/5)*100 + '%'}}>
                                                <img src="/images/design/star.svg" alt=""/>
                                                <img src="/images/design/star.svg" alt=""/>
                                                <img src="/images/design/star.svg" alt=""/>
                                                <img src="/images/design/star.svg" alt=""/>
                                                <img src="/images/design/star.svg" alt=""/>
                                            </div>
                                        </div>
                                        <span>{info.average}</span>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="wrapStatistic">
                                        {info.statistics.map(this.mapStatistics)}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="buttons">
                                        { writeRatingToday && <span className="errorWrite">Sie können nur eine Bewertung pro Tag abgeben</span>}
                                        <span className="btn write" onClick={this.writeRating}>Bewertung abgeben</span>
                                        <Select
                                            placeholder="Auswählen..."
                                            value={sort.currentValue}
                                            name="changeSortBy"
                                            options={sort.options}
                                            searchable={false}
                                            clearable={false}
                                            onChange={this.changeSortBy}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row wrapRatings">
                                {items.map(this.mapRatings)}
                                <div className="paginate">
                                    {items.length > 0 && <ReactPaginate previousLabel={"Vorherige"}
                                                                        nextLabel={"Nächste"}
                                                                        breakLabel={<a href="">...</a>}
                                                                        breakClassName={"break-me"}
                                                                        pageCount={pagination.pageCount}
                                                                        forcePage={pagination.activePage}
                                                                        marginPagesDisplayed={5}
                                                                        pageRangeDisplayed={5}
                                                                        onPageChange={this.handlePageChange}
                                                                        containerClassName={"pagination"}
                                                                        subContainerClassName={"pages pagination"}
                                                                        activeClassName={"active"}/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!window.isMobile && <WriteRatingModal  showModalWriteRating={showModalWriteRating}
                                                        closeShowModalWriteRating={this.closeShowModalWriteRating}
                                                        user={this.props.user}/>}
                { window.isMobile && <WriteRatingModalMobile user={this.props.user}
                                                             showModalWriteRating={this.props.showModalWriteRating}
                                                             closeShowModalWriteRating={this.props.closeShowModalWriteRating}/>}
            </div>
        )
    }
}

RatingPage.propTypes = {}
RatingPage.defaultProps = {}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(RatingPage)
